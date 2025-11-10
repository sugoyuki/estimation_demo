const { MService, MRuleGeneral, MRuleForce } = require('../models');
const { Op } = require('sequelize');

/**
 * 料金自動計算サービス（境界値判定対応）
 */
class FeeCalculator {
  /**
   * 校正項目の料金を計算
   * @param {Object} itemData - 校正項目データ
   * @returns {Object} - { base_fee, point_fee, subtotal, calculation_details }
   */
  async calculateFee(itemData) {
    const {
      service_id,
      point_count,
      range1_value,
      range2_value,
      force_range1_value,
      force_range2_value,
      quantity
    } = itemData;

    // サービス情報取得
    const service = await MService.findByPk(service_id);
    if (!service) {
      throw new Error(`Service not found: ${service_id}`);
    }

    if (!service.is_active) {
      throw new Error(`Service is not active: ${service_id}`);
    }

    let baseFee = parseFloat(service.base_fee) || 0;
    let pointFee = 0;
    let calculationDetails = {
      equipment_name: service.equipment_name,
      field: service.field,
      requires_point_calc: service.requires_point_calc
    };

    // 点数計算が必要な場合
    if (service.requires_point_calc) {
      if (!point_count || point_count <= 0) {
        throw new Error('point_count is required for this service');
      }

      // 分野に応じた計算
      if (service.field === '一般') {
        const result = await this.calculateGeneralFee(
          service_id,
          range1_value,
          range2_value
        );
        baseFee = result.base_fee || baseFee;
        pointFee = result.point_fee;
        calculationDetails = { ...calculationDetails, ...result.details };
      } else if (service.field === '力学') {
        const result = await this.calculateForceFee(
          service_id,
          force_range1_value,
          force_range2_value
        );
        baseFee = result.base_fee || baseFee;
        pointFee = result.point_fee;
        calculationDetails = { ...calculationDetails, ...result.details };
      } else {
        throw new Error(`Unsupported field: ${service.field}`);
      }
    }

    // 小計計算: (基本料金 + 点数料金 × 点数) × 数量
    const qty = quantity || 1;
    const itemTotal = baseFee + (pointFee * (point_count || 0));
    const subtotal = itemTotal * qty;

    return {
      base_fee: baseFee,
      point_fee: pointFee,
      subtotal: subtotal,
      calculation_details: calculationDetails
    };
  }

  /**
   * 一般分野の料金計算（境界値判定対応）
   */
  async calculateGeneralFee(service_id, range1_value, range2_value) {
    if (range1_value === undefined || range1_value === null) {
      throw new Error('range1_value is required for general field');
    }

    // 適合するルールを検索
    const rules = await MRuleGeneral.findAll({
      where: {
        service_id,
        is_active: true
      },
      order: [['range1_min', 'ASC']]
    });

    // 各ルールに対して境界値判定
    for (const rule of rules) {
      // Range1の判定
      const range1Match = this.checkRangeMatch(
        range1_value,
        rule.range1_min,
        rule.range1_max,
        rule.range1_min_included,
        rule.range1_max_included
      );

      if (!range1Match) {
        continue;
      }

      // Range2が定義されている場合は追加判定
      if (rule.range2_min !== null || rule.range2_max !== null) {
        if (range2_value === undefined || range2_value === null) {
          continue; // Range2が必要だが値が提供されていない
        }

        const range2Match = this.checkRangeMatch(
          range2_value,
          rule.range2_min,
          rule.range2_max,
          rule.range2_min_included,
          rule.range2_max_included
        );

        if (!range2Match) {
          continue;
        }
      }

      // マッチするルールが見つかった
      return {
        base_fee: 0, // 一般分野は基本料金はサービス側で定義
        point_fee: parseFloat(rule.point_fee),
        details: {
          rule_id: rule.rule_id,
          resolution: rule.resolution,
          applied_range1: this.formatRange(
            rule.range1_min,
            rule.range1_max,
            rule.range1_min_unit,
            rule.range1_max_unit,
            rule.range1_min_included,
            rule.range1_max_included
          ),
          applied_range2: rule.range2_min !== null || rule.range2_max !== null
            ? this.formatRange(
                rule.range2_min,
                rule.range2_max,
                rule.range2_min_unit,
                rule.range2_max_unit,
                rule.range2_min_included,
                rule.range2_max_included
              )
            : null,
          point_fee_unit: rule.point_fee
        }
      };
    }

    throw new Error(
      `No matching rule found for range1=${range1_value}` +
      (range2_value !== undefined ? `, range2=${range2_value}` : '')
    );
  }

  /**
   * 力学分野の料金計算（境界値判定対応）
   */
  async calculateForceFee(service_id, force_range1_value, force_range2_value) {
    if (force_range1_value === undefined || force_range1_value === null) {
      throw new Error('force_range1_value is required for force field');
    }

    // 適合するルールを検索
    const rules = await MRuleForce.findAll({
      where: {
        service_id,
        is_active: true
      },
      order: [['range1_min', 'ASC']]
    });

    // 各ルールに対して判定
    for (const rule of rules) {
      // Range1の境界値判定（荷重など）
      const range1Match = this.checkRangeMatch(
        force_range1_value,
        rule.range1_min,
        rule.range1_max,
        rule.range1_min_included,
        rule.range1_max_included
      );

      if (!range1Match) {
        continue;
      }

      // Range2の値判定（荷重方向など: 片方向/両方向/-）
      if (rule.range2_value && force_range2_value) {
        if (rule.range2_value !== '-' && rule.range2_value !== force_range2_value) {
          continue;
        }
      }

      // マッチするルールが見つかった
      return {
        base_fee: parseFloat(rule.base_fee) || 0,
        point_fee: parseFloat(rule.point_fee),
        details: {
          rule_id: rule.rule_id,
          field_cd: rule.field_cd,
          range1_name: rule.range1_name,
          applied_range1: this.formatRange(
            rule.range1_min,
            rule.range1_max,
            rule.range1_min_unit,
            rule.range1_max_unit,
            rule.range1_min_included,
            rule.range1_max_included
          ),
          range2_name: rule.range2_name,
          applied_range2: rule.range2_value || 'N/A',
          base_fee_value: rule.base_fee,
          point_fee_unit: rule.point_fee
        }
      };
    }

    throw new Error(
      `No matching rule found for force_range1=${force_range1_value}` +
      (force_range2_value ? `, force_range2=${force_range2_value}` : '')
    );
  }

  /**
   * 境界値を考慮した範囲判定
   * @param {number} value - 判定する値
   * @param {number} min - 最小値
   * @param {number} max - 最大値
   * @param {boolean} minIncluded - 最小値を含むか（1=含む(>=)、0=含まない(>)）
   * @param {boolean} maxIncluded - 最大値を含むか（1=含む(<=)、0=含まない(<)）
   * @returns {boolean} - 範囲内ならtrue
   */
  checkRangeMatch(value, min, max, minIncluded, maxIncluded) {
    // 最小値チェック
    if (min !== null && min !== undefined) {
      if (minIncluded) {
        if (value < min) return false; // 含む: value >= min
      } else {
        if (value <= min) return false; // 含まない: value > min
      }
    }

    // 最大値チェック
    if (max !== null && max !== undefined) {
      if (maxIncluded) {
        if (value > max) return false; // 含む: value <= max
      } else {
        if (value >= max) return false; // 含まない: value < max
      }
    }

    return true;
  }

  /**
   * 範囲を文字列としてフォーマット
   */
  formatRange(min, max, minUnit, maxUnit, minIncluded, maxIncluded) {
    if (min === null && max === null) {
      return 'N/A';
    }

    const minBracket = minIncluded ? '[' : '(';
    const maxBracket = maxIncluded ? ']' : ')';
    const minStr = min !== null ? `${min}${minUnit || ''}` : '-∞';
    const maxStr = max !== null ? `${max}${maxUnit || ''}` : '∞';

    return `${minBracket}${minStr}, ${maxStr}${maxBracket}`;
  }
}

module.exports = new FeeCalculator();
