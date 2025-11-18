import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calibrationApi, servicesApi, rulesGeneralApi, rulesForceApi } from '../api/services';

function EstimateNew() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  // 見積基本情報
  const [formData, setFormData] = useState({
    request_number: '',
    customer_name: '',
    request_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // 明細リスト
  const [items, setItems] = useState([]);

  // サービス選択状態（階層的絞り込み）
  const [serviceSelection, setServiceSelection] = useState({
    field_id: '',
    equipment_name: '',
    equipment_type1: '',
    equipment_type2: '',
    combination: '',
    calibration_item: '',
    method: '',
    service_id: ''
  });

  // フィルター後のサービスリスト
  const [filteredServices, setFilteredServices] = useState([]);

  // 選択可能なオプション
  const [availableOptions, setAvailableOptions] = useState({
    fields: [],
    equipmentNames: [],
    equipmentType1: [],
    equipmentType2: [],
    combinations: [],
    calibrationItems: [],
    methods: []
  });

  // ルール選択状態
  const [ruleSelection, setRuleSelection] = useState({
    selectedService: null,
    availableRules: [],
    resolution: '',
    range1_name: '',
    range1_value: '',
    range1_unit: '',
    range2_name: '',
    range2_value: '',
    range2_unit: '',
    matchedRule: null,
    point_count: 1
  });

  // 新規明細フォーム
  const [newItem, setNewItem] = useState({
    item_name: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // サービス選択が変更されたら、利用可能なオプションを更新
  useEffect(() => {
    updateAvailableOptions();
  }, [services, serviceSelection]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [servicesRes] = await Promise.all([
        servicesApi.getAll({ is_active: true })
      ]);

      const servicesData = servicesRes.data.data || [];
      setServices(servicesData);

      // 分野リストを作成
      const uniqueFields = Array.from(
        new Set(servicesData.map(s => s.fieldInfo?.field_id))
      )
        .filter(id => id)
        .map(id => {
          const service = servicesData.find(s => s.fieldInfo?.field_id === id);
          return {
            field_id: id,
            field_name: service.fieldInfo.field_name,
            revenue_category: service.fieldInfo.revenue_category
          };
        });

      setFields(uniqueFields);
    } catch (err) {
      console.error('データ取得に失敗しました', err);
      alert('データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailableOptions = () => {
    // field_idでフィルター
    let filtered = services;

    if (serviceSelection.field_id) {
      filtered = filtered.filter(s => s.fieldInfo?.field_id === parseInt(serviceSelection.field_id));
    }

    // equipment_nameでフィルター
    if (serviceSelection.equipment_name) {
      filtered = filtered.filter(s => s.equipment_name === serviceSelection.equipment_name);
    }

    // equipment_type1でフィルター
    if (serviceSelection.equipment_type1) {
      filtered = filtered.filter(s =>
        (s.equipment_type1 || '') === serviceSelection.equipment_type1
      );
    }

    // equipment_type2でフィルター
    if (serviceSelection.equipment_type2) {
      filtered = filtered.filter(s =>
        (s.equipment_type2 || '') === serviceSelection.equipment_type2
      );
    }

    // combinationでフィルター
    if (serviceSelection.combination) {
      filtered = filtered.filter(s =>
        (s.combination || '') === serviceSelection.combination
      );
    }

    // calibration_itemでフィルター
    if (serviceSelection.calibration_item) {
      filtered = filtered.filter(s =>
        (s.calibration_item || '') === serviceSelection.calibration_item
      );
    }

    // methodでフィルター
    if (serviceSelection.method) {
      filtered = filtered.filter(s =>
        (s.method || '') === serviceSelection.method
      );
    }

    setFilteredServices(filtered);

    // 利用可能なオプションを抽出
    const getUniqueValues = (key) => {
      const currentFiltered = getCurrentFilteredServices(key);
      return Array.from(new Set(currentFiltered.map(s => s[key] || '')))
        .filter(v => v !== '');
    };

    // 各フィールドに対して、それより上の階層でフィルターされたサービスから選択肢を抽出
    const getCurrentFilteredServices = (upToKey) => {
      let result = services;

      if (upToKey === 'equipment_name' && serviceSelection.field_id) {
        result = result.filter(s => s.fieldInfo?.field_id === parseInt(serviceSelection.field_id));
      }

      if (['equipment_type1', 'equipment_type2', 'combination', 'calibration_item', 'method'].includes(upToKey)) {
        if (serviceSelection.field_id) {
          result = result.filter(s => s.fieldInfo?.field_id === parseInt(serviceSelection.field_id));
        }
        if (serviceSelection.equipment_name) {
          result = result.filter(s => s.equipment_name === serviceSelection.equipment_name);
        }
      }

      if (['equipment_type2', 'combination', 'calibration_item', 'method'].includes(upToKey)) {
        if (serviceSelection.equipment_type1) {
          result = result.filter(s => (s.equipment_type1 || '') === serviceSelection.equipment_type1);
        }
      }

      if (['combination', 'calibration_item', 'method'].includes(upToKey)) {
        if (serviceSelection.equipment_type2) {
          result = result.filter(s => (s.equipment_type2 || '') === serviceSelection.equipment_type2);
        }
      }

      if (['calibration_item', 'method'].includes(upToKey)) {
        if (serviceSelection.combination) {
          result = result.filter(s => (s.combination || '') === serviceSelection.combination);
        }
      }

      if (upToKey === 'method') {
        if (serviceSelection.calibration_item) {
          result = result.filter(s => (s.calibration_item || '') === serviceSelection.calibration_item);
        }
      }

      return result;
    };

    setAvailableOptions({
      fields: fields,
      equipmentNames: getUniqueValues('equipment_name'),
      equipmentType1: getUniqueValues('equipment_type1'),
      equipmentType2: getUniqueValues('equipment_type2'),
      combinations: getUniqueValues('combination'),
      calibrationItems: getUniqueValues('calibration_item'),
      methods: getUniqueValues('method')
    });
  };

  // サービス選択時にルールを取得
  const handleServiceSelected = async () => {
    if (filteredServices.length !== 1) {
      alert('サービスを一つに絞り込んでください');
      return;
    }

    const selectedService = filteredServices[0];
    setRuleSelection(prev => ({ ...prev, selectedService }));

    // ルール取得
    try {
      if (selectedService.field === '一般') {
        const response = await rulesGeneralApi.getAll({ service_id: selectedService.service_id });
        setRuleSelection(prev => ({
          ...prev,
          availableRules: response.data.data || []
        }));
      } else if (selectedService.field === '力学') {
        const response = await rulesForceApi.getAll({ service_id: selectedService.service_id });
        setRuleSelection(prev => ({
          ...prev,
          availableRules: response.data.data || []
        }));
      }
    } catch (err) {
      console.error('ルール取得に失敗しました', err);
      alert('ルール取得に失敗しました');
    }
  };

  // ルールマッチング（一般分野）
  const matchGeneralRule = () => {
    const { selectedService, availableRules, resolution, range1_value, range2_value } = ruleSelection;

    if (!selectedService || !range1_value) {
      return null;
    }

    const value1 = parseFloat(range1_value);

    // 分解能でフィルター
    let filtered = availableRules;
    if (resolution) {
      filtered = filtered.filter(r => r.resolution === resolution);
    }

    // 範囲1で判定
    filtered = filtered.filter(r => {
      if (r.range1_min !== null && r.range1_max !== null) {
        const min = parseFloat(r.range1_min);
        const max = parseFloat(r.range1_max);
        const minOk = r.range1_min_included ? (value1 >= min) : (value1 > min);
        const maxOk = r.range1_max_included ? (value1 <= max) : (value1 < max);
        return minOk && maxOk;
      }
      return false;
    });

    // 範囲2が必要かチェック
    const hasRange2 = filtered.some(r => r.range2_name && r.range2_min !== null);

    if (hasRange2) {
      // 範囲2が存在する場合、範囲2値の選択が必須
      if (!range2_value) {
        return null; // 範囲2値が未選択の場合はマッチしない
      }
      const value2 = parseFloat(range2_value);
      filtered = filtered.filter(r => {
        if (r.range2_min !== null && r.range2_max !== null) {
          const min = parseFloat(r.range2_min);
          const max = parseFloat(r.range2_max);
          const minOk = r.range2_min_included ? (value2 >= min) : (value2 > min);
          const maxOk = r.range2_max_included ? (value2 <= max) : (value2 < max);
          return minOk && maxOk;
        }
        return false;
      });
    }

    return filtered.length === 1 ? filtered[0] : null;
  };

  // ルールマッチング（力学分野）
  const matchForceRule = () => {
    const { availableRules, range1_value, range2_value } = ruleSelection;

    if (!range1_value) {
      return null;
    }

    const value1 = parseFloat(range1_value);

    // 範囲1で判定
    let filtered = availableRules.filter(r => {
      if (r.range1_min !== null && r.range1_max !== null) {
        const min = parseFloat(r.range1_min);
        const max = parseFloat(r.range1_max);
        const minOk = r.range1_min_included ? (value1 >= min) : (value1 > min);
        const maxOk = r.range1_max_included ? (value1 <= max) : (value1 < max);
        return minOk && maxOk;
      }
      return false;
    });

    // 範囲2が必要かチェック
    const hasRange2 = filtered.some(r => r.range2_name && r.range2_value);

    if (hasRange2) {
      // 範囲2が存在する場合、範囲2値の選択が必須
      if (!range2_value) {
        return null; // 範囲2値が未選択の場合はマッチしない
      }
      // 範囲2値でフィルター
      filtered = filtered.filter(r => r.range2_value === range2_value);
    }

    return filtered.length === 1 ? filtered[0] : null;
  };

  // 利用可能な単位を取得（一般分野 範囲1）
  const getAvailableRange1Units = () => {
    const { availableRules, resolution, range1_name } = ruleSelection;

    let filtered = availableRules;
    if (resolution) {
      filtered = filtered.filter(r => r.resolution === resolution);
    }
    if (range1_name) {
      filtered = filtered.filter(r => r.range1_name === range1_name);
    }

    const units = new Set<string>();
    filtered.forEach(r => {
      if (r.range1_min_unit) units.add(r.range1_min_unit);
      if (r.range1_max_unit) units.add(r.range1_max_unit);
    });

    return Array.from(units);
  };

  // 利用可能な単位を取得（一般分野 範囲2）
  const getAvailableRange2Units = () => {
    const { availableRules, resolution, range1_name, range2_name } = ruleSelection;

    let filtered = availableRules;
    if (resolution) {
      filtered = filtered.filter(r => r.resolution === resolution);
    }
    if (range1_name) {
      filtered = filtered.filter(r => r.range1_name === range1_name);
    }
    if (range2_name) {
      filtered = filtered.filter(r => r.range2_name === range2_name);
    }

    const units = new Set<string>();
    filtered.forEach(r => {
      if (r.range2_min_unit) units.add(r.range2_min_unit);
      if (r.range2_max_unit) units.add(r.range2_max_unit);
    });

    return Array.from(units);
  };

  // 利用可能な単位を取得（力学分野 範囲1）
  const getAvailableForceRange1Units = () => {
    const { availableRules, range1_name } = ruleSelection;

    let filtered = availableRules;
    if (range1_name) {
      filtered = filtered.filter(r => r.range1_name === range1_name);
    }

    const units = new Set<string>();
    filtered.forEach(r => {
      if (r.range1_min_unit) units.add(r.range1_min_unit);
      if (r.range1_max_unit) units.add(r.range1_max_unit);
    });

    return Array.from(units);
  };

  // 価格計算
  const calculatePrice = (rule, pointCount) => {
    if (!rule) return { baseFee: 0, pointFee: 0, total: 0 };

    const baseFee = parseFloat(rule.base_fee || 0);
    const pointFee = parseFloat(rule.point_fee || 0);
    const total = baseFee + (pointFee * pointCount);

    return { baseFee, pointFee, total };
  };

  // ルール確定して明細に追加
  const handleAddItemWithRule = () => {
    const { selectedService } = ruleSelection;

    if (!selectedService) {
      alert('サービスを選択してください');
      return;
    }

    if (!newItem.item_name) {
      alert('校正品名は必須です');
      return;
    }

    // ルールマッチング
    const matchedRule = selectedService.field === '一般'
      ? matchGeneralRule()
      : matchForceRule();

    if (!matchedRule) {
      alert('条件に一致するルールが見つかりませんでした');
      return;
    }

    const price = calculatePrice(matchedRule, ruleSelection.point_count);

    setItems([...items, {
      service_id: selectedService.service_id,
      equipment_name: selectedService.equipment_name,
      field: selectedService.field,
      ...newItem,
      ...ruleSelection,
      matchedRule,
      base_fee: price.baseFee,
      point_fee: price.pointFee,
      subtotal: price.total,
      temp_id: Date.now()
    }]);

    // リセット
    resetSelection();
  };

  const resetSelection = () => {
    setServiceSelection({
      field_id: '',
      equipment_name: '',
      equipment_type1: '',
      equipment_type2: '',
      combination: '',
      service_id: ''
    });

    setRuleSelection({
      selectedService: null,
      availableRules: [],
      resolution: '',
      range1_name: '',
      range1_value: '',
      range1_unit: '',
      range2_name: '',
      range2_value: '',
      range2_unit: '',
      matchedRule: null,
      point_count: 1
    });

    setNewItem({
      item_name: '',
      manufacturer: '',
      model_number: '',
      serial_number: '',
      quantity: 1,
      notes: ''
    });
  };

  const handleRemoveItem = (tempId) => {
    setItems(items.filter(item => item.temp_id !== tempId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.request_number || !formData.customer_name) {
      alert('見積番号と顧客名は必須です');
      return;
    }

    if (items.length === 0) {
      alert('明細を少なくとも1件追加してください');
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        ...formData,
        total_amount: items.reduce((sum, item) => sum + (item.subtotal || 0), 0),
        status: 'draft'
      };

      const response = await calibrationApi.createRequest(requestData);
      const requestId = response.data.data.request_id;

      // 明細を登録
      for (const item of items) {
        await calibrationApi.createItem({
          request_id: requestId,
          service_id: item.service_id,
          item_name: item.item_name,
          manufacturer: item.manufacturer || '',
          model_number: item.model_number || '',
          serial_number: item.serial_number || '',
          quantity: item.quantity,
          point_count: item.point_count,
          base_fee: item.base_fee,
          point_fee: item.point_fee,
          subtotal: item.subtotal,
          notes: item.notes || ''
        });
      }

      alert('見積を作成しました');
      navigate('/estimates');
    } catch (err) {
      console.error('見積作成に失敗しました', err);
      alert('見積作成に失敗しました: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="estimate-new">
      <h1>新規見積作成</h1>

      <form onSubmit={handleSubmit}>
        {/* 見積基本情報 */}
        <div className="form-card">
          <h2>見積基本情報</h2>

          <div className="form-group">
            <label>見積番号 *</label>
            <input
              type="text"
              value={formData.request_number}
              onChange={(e) => setFormData({ ...formData, request_number: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>顧客名 *</label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>依頼日</label>
            <input
              type="date"
              value={formData.request_date}
              onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>備考</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        {/* 明細追加フォーム */}
        <div className="form-card">
          <h2>明細追加</h2>

          {/* ステップ1: サービス選択（階層的絞り込み） */}
          <fieldset className="form-section">
            <legend>ステップ1: サービス選択</legend>

            <div className="form-group">
              <label>分野 *</label>
              <select
                value={serviceSelection.field_id}
                onChange={(e) => {
                  setServiceSelection({
                    field_id: e.target.value,
                    equipment_name: '',
                    equipment_type1: '',
                    equipment_type2: '',
                    combination: '',
                    calibration_item: '',
                    method: '',
                    service_id: ''
                  });
                }}
              >
                <option value="">選択してください</option>
                {availableOptions.fields.map(f => (
                  <option key={f.field_id} value={f.field_id}>
                    {f.field_name} ({f.revenue_category})
                  </option>
                ))}
              </select>
            </div>

            {serviceSelection.field_id && (
              <div className="form-group">
                <label>機器名 *</label>
                <select
                  value={serviceSelection.equipment_name}
                  onChange={(e) => {
                    setServiceSelection({
                      ...serviceSelection,
                      equipment_name: e.target.value,
                      equipment_type1: '',
                      equipment_type2: '',
                      combination: '',
                      calibration_item: '',
                      method: ''
                    });
                  }}
                >
                  <option value="">選択してください</option>
                  {availableOptions.equipmentNames.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}

            {serviceSelection.equipment_name && availableOptions.equipmentType1.length > 0 && (
              <div className="form-group">
                <label>機器種類1</label>
                <select
                  value={serviceSelection.equipment_type1}
                  onChange={(e) => {
                    setServiceSelection({
                      ...serviceSelection,
                      equipment_type1: e.target.value,
                      equipment_type2: '',
                      combination: '',
                      calibration_item: '',
                      method: ''
                    });
                  }}
                >
                  <option value="">選択してください</option>
                  {availableOptions.equipmentType1.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            {serviceSelection.equipment_type1 && availableOptions.equipmentType2.length > 0 && (
              <div className="form-group">
                <label>機器種類2</label>
                <select
                  value={serviceSelection.equipment_type2}
                  onChange={(e) => {
                    setServiceSelection({
                      ...serviceSelection,
                      equipment_type2: e.target.value,
                      combination: '',
                      calibration_item: '',
                      method: ''
                    });
                  }}
                >
                  <option value="">選択してください</option>
                  {availableOptions.equipmentType2.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            {serviceSelection.equipment_name && availableOptions.combinations.length > 0 && (
              <div className="form-group">
                <label>組み合わせ</label>
                <select
                  value={serviceSelection.combination}
                  onChange={(e) => {
                    setServiceSelection({
                      ...serviceSelection,
                      combination: e.target.value,
                      calibration_item: '',
                      method: ''
                    });
                  }}
                >
                  <option value="">選択してください</option>
                  {availableOptions.combinations.map((comb, idx) => (
                    <option key={idx} value={comb}>{comb}</option>
                  ))}
                </select>
              </div>
            )}

            {serviceSelection.equipment_name && filteredServices.some(s => s.calibration_item) && (
              <div className="form-group">
                <label>校正項目</label>
                <select
                  value={serviceSelection.calibration_item}
                  onChange={(e) => {
                    setServiceSelection({
                      ...serviceSelection,
                      calibration_item: e.target.value,
                      method: ''
                    });
                  }}
                >
                  <option value="">選択してください</option>
                  {availableOptions.calibrationItems.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            {serviceSelection.equipment_name && filteredServices.some(s => s.method) && (
              <div className="form-group">
                <label>手法</label>
                <select
                  value={serviceSelection.method}
                  onChange={(e) => {
                    setServiceSelection({
                      ...serviceSelection,
                      method: e.target.value
                    });
                  }}
                >
                  <option value="">選択してください</option>
                  {availableOptions.methods.map((method, idx) => (
                    <option key={idx} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              絞り込み結果: {filteredServices.length}件のサービス
              {filteredServices.length === 1 && (
                <button
                  type="button"
                  onClick={handleServiceSelected}
                  className="btn btn-primary"
                  style={{ marginLeft: '16px' }}
                >
                  このサービスを選択
                </button>
              )}
            </div>
          </fieldset>

          {/* ステップ2: ルール選択 */}
          {ruleSelection.selectedService && (
            <fieldset className="form-section">
              <legend>ステップ2: 料金ルール選択</legend>

              <p>選択されたサービス: <strong>{ruleSelection.selectedService.equipment_name}</strong></p>

              {ruleSelection.selectedService.field === '一般' && (
                <>
                  {/* 一般分野のルール選択 */}
                  <div className="form-group">
                    <label>分解能</label>
                    <select
                      value={ruleSelection.resolution}
                      onChange={(e) => setRuleSelection({ ...ruleSelection, resolution: e.target.value })}
                    >
                      <option value="">選択してください</option>
                      {Array.from(new Set(ruleSelection.availableRules.map(r => r.resolution))).map((res, idx) => (
                        <option key={idx} value={res}>{res}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>範囲1名称</label>
                    <select
                      value={ruleSelection.range1_name}
                      onChange={(e) => setRuleSelection({ ...ruleSelection, range1_name: e.target.value })}
                    >
                      <option value="">選択してください</option>
                      {Array.from(new Set(ruleSelection.availableRules.map(r => r.range1_name))).map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>範囲1 値 *</label>
                      <input
                        type="number"
                        step="any"
                        value={ruleSelection.range1_value}
                        onChange={(e) => setRuleSelection({ ...ruleSelection, range1_value: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>単位</label>
                      <select
                        value={ruleSelection.range1_unit}
                        onChange={(e) => setRuleSelection({ ...ruleSelection, range1_unit: e.target.value })}
                      >
                        <option value="">選択してください</option>
                        {getAvailableRange1Units().map((unit, idx) => (
                          <option key={idx} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {ruleSelection.availableRules.some(r => r.range2_name) && (
                    <>
                      <div className="form-group">
                        <label>範囲2名称</label>
                        <select
                          value={ruleSelection.range2_name}
                          onChange={(e) => setRuleSelection({ ...ruleSelection, range2_name: e.target.value })}
                        >
                          <option value="">選択してください</option>
                          {Array.from(new Set(ruleSelection.availableRules.map(r => r.range2_name).filter(n => n))).map((name, idx) => (
                            <option key={idx} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>範囲2 値</label>
                          <input
                            type="number"
                            step="any"
                            value={ruleSelection.range2_value}
                            onChange={(e) => setRuleSelection({ ...ruleSelection, range2_value: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>単位</label>
                          <select
                            value={ruleSelection.range2_unit}
                            onChange={(e) => setRuleSelection({ ...ruleSelection, range2_unit: e.target.value })}
                          >
                            <option value="">選択してください</option>
                            {getAvailableRange2Units().map((unit, idx) => (
                              <option key={idx} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {ruleSelection.selectedService.field === '力学' && (
                <>
                  {/* 力学分野のルール選択 */}
                  <div className="form-group">
                    <label>範囲1名称</label>
                    <select
                      value={ruleSelection.range1_name}
                      onChange={(e) => setRuleSelection({ ...ruleSelection, range1_name: e.target.value })}
                    >
                      <option value="">選択してください</option>
                      {Array.from(new Set(ruleSelection.availableRules.map(r => r.range1_name))).map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>範囲1 値 *</label>
                      <input
                        type="number"
                        step="any"
                        value={ruleSelection.range1_value}
                        onChange={(e) => setRuleSelection({ ...ruleSelection, range1_value: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>単位</label>
                      <select
                        value={ruleSelection.range1_unit}
                        onChange={(e) => setRuleSelection({ ...ruleSelection, range1_unit: e.target.value })}
                      >
                        <option value="">選択してください</option>
                        {getAvailableForceRange1Units().map((unit, idx) => (
                          <option key={idx} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {ruleSelection.availableRules.some(r => r.range2_name) && (
                    <>
                      <div className="form-group">
                        <label>範囲2名称</label>
                        <select
                          value={ruleSelection.range2_name}
                          onChange={(e) => setRuleSelection({ ...ruleSelection, range2_name: e.target.value })}
                        >
                          <option value="">選択してください</option>
                          {Array.from(new Set(ruleSelection.availableRules.map(r => r.range2_name).filter(n => n))).map((name, idx) => (
                            <option key={idx} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>範囲2 値</label>
                        <select
                          value={ruleSelection.range2_value}
                          onChange={(e) => setRuleSelection({ ...ruleSelection, range2_value: e.target.value })}
                        >
                          <option value="">選択してください</option>
                          {Array.from(new Set(ruleSelection.availableRules.map(r => r.range2_value).filter(v => v))).map((val, idx) => (
                            <option key={idx} value={val}>{val}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="form-group">
                <label>点数 *</label>
                <input
                  type="number"
                  min="1"
                  value={ruleSelection.point_count}
                  onChange={(e) => setRuleSelection({ ...ruleSelection, point_count: parseInt(e.target.value) })}
                  required
                />
              </div>

              {/* 価格プレビュー */}
              {(() => {
                const matched = ruleSelection.selectedService.field === '一般'
                  ? matchGeneralRule()
                  : matchForceRule();

                if (matched && ruleSelection.point_count) {
                  const price = calculatePrice(matched, ruleSelection.point_count);
                  return (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f0f0f0', borderRadius: '4px' }}>
                      <h4>料金プレビュー</h4>
                      <p>基本料金: ¥{price.baseFee.toLocaleString()}</p>
                      <p>点数料金: ¥{price.pointFee.toLocaleString()} × {ruleSelection.point_count}点</p>
                      <p><strong>合計: ¥{price.total.toLocaleString()}</strong></p>
                    </div>
                  );
                }
                return null;
              })()}
            </fieldset>
          )}

          {/* ステップ3: 明細情報 */}
          {ruleSelection.selectedService && (
            <fieldset className="form-section">
              <legend>ステップ3: 明細情報</legend>

              <div className="form-group">
                <label>校正品名 *</label>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>メーカー</label>
                <input
                  type="text"
                  value={newItem.manufacturer}
                  onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>型番</label>
                <input
                  type="text"
                  value={newItem.model_number}
                  onChange={(e) => setNewItem({ ...newItem, model_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>シリアル番号</label>
                <input
                  type="text"
                  value={newItem.serial_number}
                  onChange={(e) => setNewItem({ ...newItem, serial_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>数量</label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>備考</label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <button
                type="button"
                onClick={handleAddItemWithRule}
                className="btn btn-primary"
              >
                明細を追加
              </button>
            </fieldset>
          )}
        </div>

        {/* 明細リスト */}
        {items.length > 0 && (
          <div className="form-card">
            <h2>見積明細一覧</h2>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>校正品名</th>
                    <th>サービス</th>
                    <th>点数</th>
                    <th>基本料金</th>
                    <th>点数料金</th>
                    <th>小計</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.temp_id}>
                      <td>{item.item_name}</td>
                      <td>{item.equipment_name}</td>
                      <td>{item.point_count}</td>
                      <td>¥{item.base_fee.toLocaleString()}</td>
                      <td>¥{item.point_fee.toLocaleString()}</td>
                      <td>¥{item.subtotal.toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.temp_id)}
                          className="btn btn-sm btn-danger"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>合計</td>
                    <td style={{ fontWeight: 'bold' }}>
                      ¥{items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 送信ボタン */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || items.length === 0}>
            {loading ? '保存中...' : '見積を作成'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/estimates')}
            className="btn"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export default EstimateNew;
