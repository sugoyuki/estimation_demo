--
-- PostgreSQL database dump
--

\restrict hicT3KXz5lDb4laFR7rZtMJKprN0yZIdjZT3SwrHk3232ReUkFg9y0dPdor5dU0

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: m_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_fields (
    field_id integer NOT NULL,
    field_name character varying(50) NOT NULL,
    revenue_category character varying(50) NOT NULL,
    rule_table_type character varying(20),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE m_fields; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.m_fields IS '分野マスタテーブル';


--
-- Name: COLUMN m_fields.field_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_fields.field_name IS '分野名（温度、湿度、体積、力、圧力、質量など）';


--
-- Name: COLUMN m_fields.revenue_category; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_fields.revenue_category IS '収入区分（熱学、力学など）';


--
-- Name: COLUMN m_fields.rule_table_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_fields.rule_table_type IS 'ルールテーブル種別（general or force）';


--
-- Name: m_fields_field_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_fields_field_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: m_fields_field_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_fields_field_id_seq OWNED BY public.m_fields.field_id;


--
-- Name: m_rules_force; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_rules_force (
    rule_id integer NOT NULL,
    service_id integer NOT NULL,
    range1_name character varying(100),
    range1_min numeric(15,6),
    range1_min_unit character varying(50),
    range1_max numeric(15,6),
    range1_max_unit character varying(50),
    range2_name character varying(100),
    range2_value character varying(100),
    point_fee numeric(10,2) NOT NULL,
    base_fee numeric(10,2) DEFAULT 0.00,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    range1_min_included boolean DEFAULT true,
    range1_max_included boolean DEFAULT true
);


--
-- Name: TABLE m_rules_force; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.m_rules_force IS '力学分野料金ルールマスタ - Excel「力」シートに対応';


--
-- Name: COLUMN m_rules_force.range1_min_included; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_rules_force.range1_min_included IS '範囲1最小値を含むか（1=含む(>=)、0=含まない(>)）';


--
-- Name: COLUMN m_rules_force.range1_max_included; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_rules_force.range1_max_included IS '範囲1最大値を含むか（1=含む(<=)、0=含まない(<)）';


--
-- Name: m_rules_force_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_rules_force_rule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: m_rules_force_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_rules_force_rule_id_seq OWNED BY public.m_rules_force.rule_id;


--
-- Name: m_rules_general; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_rules_general (
    rule_id integer NOT NULL,
    service_id integer NOT NULL,
    resolution character varying(100),
    range1_name character varying(100),
    range1_min numeric(15,6),
    range1_min_unit character varying(50),
    range1_min_included boolean DEFAULT true,
    range1_max numeric(15,6),
    range1_max_unit character varying(50),
    range1_max_included boolean DEFAULT true,
    range2_name character varying(100),
    range2_min numeric(15,6),
    range2_min_unit character varying(50),
    range2_min_included boolean DEFAULT true,
    range2_max numeric(15,6),
    range2_max_unit character varying(50),
    range2_max_included boolean DEFAULT true,
    point_fee numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE m_rules_general; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.m_rules_general IS '一般分野料金ルールマスタ - Excel「汎用」シートに対応';


--
-- Name: COLUMN m_rules_general.range1_min_included; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_rules_general.range1_min_included IS '1=境界を含む(>=)、0=境界を含まない(>)';


--
-- Name: COLUMN m_rules_general.range1_max_included; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_rules_general.range1_max_included IS '1=境界を含む(<=)、0=境界を含まない(<)';


--
-- Name: COLUMN m_rules_general.range2_min_included; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_rules_general.range2_min_included IS '1=境界を含む(>=)、0=境界を含まない(>)';


--
-- Name: COLUMN m_rules_general.range2_max_included; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.m_rules_general.range2_max_included IS '1=境界を含む(<=)、0=境界を含まない(<)';


--
-- Name: m_rules_general_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_rules_general_rule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: m_rules_general_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_rules_general_rule_id_seq OWNED BY public.m_rules_general.rule_id;


--
-- Name: m_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_services (
    service_id integer NOT NULL,
    field character varying(100) NOT NULL,
    equipment_name character varying(255) NOT NULL,
    equipment_type1 character varying(100),
    equipment_type2 character varying(100),
    combination character varying(100),
    main_option character varying(100),
    option_name character varying(255),
    calibration_item character varying(255),
    method character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    field_id integer NOT NULL,
    field_number integer NOT NULL
);


--
-- Name: TABLE m_services; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.m_services IS '共通校正項目マスタ（親テーブル）- Excel「共通項」シートに対応';


--
-- Name: m_services_service_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_services_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: m_services_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_services_service_id_seq OWNED BY public.m_services.service_id;


--
-- Name: t_calibration_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_calibration_items (
    item_id integer NOT NULL,
    request_id integer NOT NULL,
    service_id integer NOT NULL,
    item_name character varying(255) NOT NULL,
    manufacturer character varying(255),
    model_number character varying(255),
    serial_number character varying(255),
    quantity integer DEFAULT 1,
    point_count integer,
    range1_value numeric(15,6),
    range2_value numeric(15,6),
    force_range1_value numeric(15,6),
    force_range2_value character varying(100),
    base_fee numeric(10,2) DEFAULT 0.00,
    point_fee numeric(10,2) DEFAULT 0.00,
    subtotal numeric(10,2) DEFAULT 0.00,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE t_calibration_items; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.t_calibration_items IS '校正明細（見積明細）';


--
-- Name: t_calibration_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.t_calibration_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: t_calibration_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.t_calibration_items_item_id_seq OWNED BY public.t_calibration_items.item_id;


--
-- Name: t_calibration_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_calibration_requests (
    request_id integer NOT NULL,
    request_number character varying(50) NOT NULL,
    customer_name character varying(255) NOT NULL,
    request_date date NOT NULL,
    total_amount numeric(12,2) DEFAULT 0.00,
    status character varying(50) DEFAULT 'draft'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE t_calibration_requests; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.t_calibration_requests IS '校正依頼（見積）';


--
-- Name: t_calibration_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.t_calibration_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: t_calibration_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.t_calibration_requests_request_id_seq OWNED BY public.t_calibration_requests.request_id;


--
-- Name: m_fields field_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_fields ALTER COLUMN field_id SET DEFAULT nextval('public.m_fields_field_id_seq'::regclass);


--
-- Name: m_rules_force rule_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_rules_force ALTER COLUMN rule_id SET DEFAULT nextval('public.m_rules_force_rule_id_seq'::regclass);


--
-- Name: m_rules_general rule_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_rules_general ALTER COLUMN rule_id SET DEFAULT nextval('public.m_rules_general_rule_id_seq'::regclass);


--
-- Name: m_services service_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_services ALTER COLUMN service_id SET DEFAULT nextval('public.m_services_service_id_seq'::regclass);


--
-- Name: t_calibration_items item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_items ALTER COLUMN item_id SET DEFAULT nextval('public.t_calibration_items_item_id_seq'::regclass);


--
-- Name: t_calibration_requests request_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_requests ALTER COLUMN request_id SET DEFAULT nextval('public.t_calibration_requests_request_id_seq'::regclass);


--
-- Name: m_fields m_fields_field_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_fields
    ADD CONSTRAINT m_fields_field_name_key UNIQUE (field_name);


--
-- Name: m_fields m_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_fields
    ADD CONSTRAINT m_fields_pkey PRIMARY KEY (field_id);


--
-- Name: m_rules_force m_rules_force_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_rules_force
    ADD CONSTRAINT m_rules_force_pkey PRIMARY KEY (rule_id);


--
-- Name: m_rules_general m_rules_general_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_rules_general
    ADD CONSTRAINT m_rules_general_pkey PRIMARY KEY (rule_id);


--
-- Name: m_services m_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_services
    ADD CONSTRAINT m_services_pkey PRIMARY KEY (service_id);


--
-- Name: t_calibration_items t_calibration_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_items
    ADD CONSTRAINT t_calibration_items_pkey PRIMARY KEY (item_id);


--
-- Name: t_calibration_requests t_calibration_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_requests
    ADD CONSTRAINT t_calibration_requests_pkey PRIMARY KEY (request_id);


--
-- Name: t_calibration_requests t_calibration_requests_request_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_requests
    ADD CONSTRAINT t_calibration_requests_request_number_key UNIQUE (request_number);


--
-- Name: m_services uk_field_number; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_services
    ADD CONSTRAINT uk_field_number UNIQUE (field_id, field_number);


--
-- Name: idx_items_request; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_items_request ON public.t_calibration_items USING btree (request_id);


--
-- Name: idx_items_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_items_service ON public.t_calibration_items USING btree (service_id);


--
-- Name: idx_requests_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_requests_customer ON public.t_calibration_requests USING btree (customer_name);


--
-- Name: idx_requests_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_requests_date ON public.t_calibration_requests USING btree (request_date);


--
-- Name: idx_requests_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_requests_number ON public.t_calibration_requests USING btree (request_number);


--
-- Name: idx_rules_force_range1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rules_force_range1 ON public.m_rules_force USING btree (range1_min, range1_max);


--
-- Name: idx_rules_force_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rules_force_service ON public.m_rules_force USING btree (service_id);


--
-- Name: idx_rules_general_range1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rules_general_range1 ON public.m_rules_general USING btree (range1_min, range1_max);


--
-- Name: idx_rules_general_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rules_general_service ON public.m_rules_general USING btree (service_id);


--
-- Name: idx_services_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_services_active ON public.m_services USING btree (is_active);


--
-- Name: idx_services_equipment_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_services_equipment_name ON public.m_services USING btree (equipment_name);


--
-- Name: idx_services_field; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_services_field ON public.m_services USING btree (field);


--
-- Name: m_rules_force update_m_rules_force_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_m_rules_force_updated_at BEFORE UPDATE ON public.m_rules_force FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: m_rules_general update_m_rules_general_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_m_rules_general_updated_at BEFORE UPDATE ON public.m_rules_general FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: m_services update_m_services_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_m_services_updated_at BEFORE UPDATE ON public.m_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: t_calibration_items update_t_calibration_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_t_calibration_items_updated_at BEFORE UPDATE ON public.t_calibration_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: t_calibration_requests update_t_calibration_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_t_calibration_requests_updated_at BEFORE UPDATE ON public.t_calibration_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: m_services fk_field; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_services
    ADD CONSTRAINT fk_field FOREIGN KEY (field_id) REFERENCES public.m_fields(field_id);


--
-- Name: m_rules_force m_rules_force_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_rules_force
    ADD CONSTRAINT m_rules_force_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.m_services(service_id) ON DELETE CASCADE;


--
-- Name: m_rules_general m_rules_general_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_rules_general
    ADD CONSTRAINT m_rules_general_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.m_services(service_id) ON DELETE CASCADE;


--
-- Name: t_calibration_items t_calibration_items_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_items
    ADD CONSTRAINT t_calibration_items_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.t_calibration_requests(request_id) ON DELETE CASCADE;


--
-- Name: t_calibration_items t_calibration_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_calibration_items
    ADD CONSTRAINT t_calibration_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.m_services(service_id);


--
-- PostgreSQL database dump complete
--

\unrestrict hicT3KXz5lDb4laFR7rZtMJKprN0yZIdjZT3SwrHk3232ReUkFg9y0dPdor5dU0

