--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: m_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_category (
    category_no integer NOT NULL,
    category_level integer NOT NULL,
    parent_category_no integer,
    category_nm character varying(100) NOT NULL,
    category_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_update_date timestamp without time zone,
    category_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    category_delete_date timestamp without time zone
);


ALTER TABLE public.m_category OWNER TO postgres;

--
-- Name: m_category_category_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_category_category_no_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_category_category_no_seq OWNER TO postgres;

--
-- Name: m_category_category_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_category_category_no_seq OWNED BY public.m_category.category_no;


--
-- Name: m_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_customer (
    customer_no integer NOT NULL,
    customer_name character varying(30) NOT NULL,
    customer_tel character varying(50),
    customer_representative_name character varying(30),
    customer_business_reg_no character varying(50) NOT NULL,
    customer_addr character varying(200),
    customer_fax_no character varying(50),
    customer_manager_name character varying(50),
    customer_manager_email character varying(100),
    customer_manager_tel character varying(50),
    customer_country_code character varying(20),
    customer_type character varying(20),
    customer_e_tax_invoice_yn character varying(20),
    customer_transaction_start_date timestamp without time zone,
    customer_transaction_end_date timestamp without time zone,
    customer_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    customer_update_date timestamp without time zone,
    customer_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    customer_delete_date timestamp without time zone
);


ALTER TABLE public.m_customer OWNER TO postgres;

--
-- Name: m_customer_customer_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_customer_customer_no_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_customer_customer_no_seq OWNER TO postgres;

--
-- Name: m_customer_customer_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_customer_customer_no_seq OWNED BY public.m_customer.customer_no;


--
-- Name: m_employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_employee (
    employee_id character varying(50) NOT NULL,
    employee_pw character varying(50) NOT NULL,
    employee_name character varying(50) NOT NULL,
    employee_email character varying(30),
    employee_tel character varying(20) NOT NULL,
    employee_role character varying(20) NOT NULL,
    employee_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    employee_update_date timestamp without time zone,
    employee_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    employee_delete_date timestamp without time zone
);


ALTER TABLE public.m_employee OWNER TO postgres;

--
-- Name: m_order_d; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_order_d (
    order_d_no integer NOT NULL,
    order_h_no integer NOT NULL,
    product_cd character varying(10) NOT NULL,
    order_d_price numeric(15,2) NOT NULL,
    order_d_qty integer NOT NULL,
    order_d_total_price numeric(15,2) NOT NULL,
    order_d_delivery_request_date timestamp without time zone,
    order_d_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    order_d_update_date timestamp without time zone,
    order_d_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    order_d_delete_date timestamp without time zone
);


ALTER TABLE public.m_order_d OWNER TO postgres;

--
-- Name: m_order_d_order_d_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_order_d_order_d_no_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_order_d_order_d_no_seq OWNER TO postgres;

--
-- Name: m_order_d_order_d_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_order_d_order_d_no_seq OWNED BY public.m_order_d.order_d_no;


--
-- Name: m_order_h; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_order_h (
    order_h_no integer NOT NULL,
    customer_no integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    order_h_total_price numeric(15,2) NOT NULL,
    order_h_status character varying(10),
    order_h_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    order_h_update_date timestamp without time zone,
    order_h_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    order_h_delete_date timestamp without time zone
);


ALTER TABLE public.m_order_h OWNER TO postgres;

--
-- Name: m_order_h_order_h_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_order_h_order_h_no_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_order_h_order_h_no_seq OWNER TO postgres;

--
-- Name: m_order_h_order_h_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_order_h_order_h_no_seq OWNED BY public.m_order_h.order_h_no;


--
-- Name: m_price; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_price (
    price_no integer NOT NULL,
    customer_no integer NOT NULL,
    product_cd character varying(10) NOT NULL,
    price_customer numeric(15,2) NOT NULL,
    price_start_date date,
    price_end_date date,
    price_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    price_update_date timestamp without time zone,
    price_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    price_delete_date timestamp without time zone
);


ALTER TABLE public.m_price OWNER TO postgres;

--
-- Name: m_price_price_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_price_price_no_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_price_price_no_seq OWNER TO postgres;

--
-- Name: m_price_price_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_price_price_no_seq OWNED BY public.m_price.price_no;


--
-- Name: m_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_product (
    product_cd character varying(10) NOT NULL,
    category_no integer,
    product_nm character varying(100) NOT NULL,
    product_insert_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    product_update_date timestamp without time zone,
    product_delete_yn character varying(20) DEFAULT 'N'::character varying NOT NULL,
    product_delete_date timestamp without time zone,
    product_price numeric(15,2) NOT NULL
);


ALTER TABLE public.m_product OWNER TO postgres;

--
-- Name: m_category category_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_category ALTER COLUMN category_no SET DEFAULT nextval('public.m_category_category_no_seq'::regclass);


--
-- Name: m_customer customer_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_customer ALTER COLUMN customer_no SET DEFAULT nextval('public.m_customer_customer_no_seq'::regclass);


--
-- Name: m_order_d order_d_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_d ALTER COLUMN order_d_no SET DEFAULT nextval('public.m_order_d_order_d_no_seq'::regclass);


--
-- Name: m_order_h order_h_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_h ALTER COLUMN order_h_no SET DEFAULT nextval('public.m_order_h_order_h_no_seq'::regclass);


--
-- Name: m_price price_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_price ALTER COLUMN price_no SET DEFAULT nextval('public.m_price_price_no_seq'::regclass);


--
-- Data for Name: m_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_category (category_no, category_level, parent_category_no, category_nm, category_insert_date, category_update_date, category_delete_yn, category_delete_date) FROM stdin;
382	2	115	?ㅻ쭏??怨듦린泥?젙湲?2024-09-24 10:47:14.15221	\N	N	\N
383	2	115	 ?ㅻ쭏???꾨룞 釉붾씪?몃뱶	2024-09-24 10:47:34.04442	\N	N	\N
384	2	115	 ?ㅻ쭏??議곕챸 ?쒖뼱?μ튂 諛?遺??2024-09-24 10:47:40.629443	\N	N	\N
386	3	116	 ?ㅻ쭏???명떚洹몃젅?댁뀡 議곕챸	2024-09-24 10:48:01.364975	\N	N	\N
387	3	116	 ?ㅻ쭏??議곕챸?ㅽ듃	2024-09-24 10:48:15.811926	\N	N	\N
388	3	116	 臾댁꽑 LED ?⑤꼸	2024-09-24 10:48:24.106373	\N	N	\N
389	3	116	 ?ㅻ쭏???⑦봽	2024-09-24 10:48:30.211985	\N	N	\N
140	3	137	留ㅽ듃由ъ뒪	2024-09-18 20:19:19.426468	\N	N	2024-09-22 18:48:45.615
391	3	383	?붾쭑釉붾씪?몃뱶	2024-09-24 10:49:10.919691	\N	Y	2024-09-24 10:49:19.357
293	3	137	寃⑥슱?대텋	2024-09-22 18:53:35.818597	2024-09-22 18:53:50.133	Y	2024-09-22 20:09:44.484
390	3	383	?뺣쭑踰뚯쭛釉붾씪?몃뱶	2024-09-24 10:49:01.646291	\N	Y	2024-09-24 10:49:25.097
29	1	\N	?꾩옄湲곌린	2024-09-13 00:00:00	\N	N	\N
30	1	\N	二쇰갑?⑺뭹	2024-09-13 00:00:00	\N	N	\N
31	1	\N	臾멸뎄瑜?2024-09-13 00:00:00	\N	N	\N
32	1	\N	?대룞湲곌뎄	2024-09-13 00:00:00	\N	N	\N
33	1	\N	李⑤웾?⑺뭹	2024-09-13 00:00:00	\N	N	\N
34	2	29	?명듃遺?2024-09-13 00:00:00	\N	N	\N
35	2	29	?ㅻ쭏?명룿	2024-09-13 00:00:00	\N	N	\N
38	2	31	?명듃	2024-09-13 00:00:00	\N	N	\N
39	2	31	?꾧린援?2024-09-13 00:00:00	\N	N	\N
40	2	32	?꾨졊	2024-09-13 00:00:00	\N	N	\N
41	2	32	?붽? 留ㅽ듃	2024-09-13 00:00:00	\N	N	\N
42	2	33	李⑤웾??泥?냼湲?2024-09-13 00:00:00	\N	N	\N
43	2	33	李⑤웾??諛⑺뼢??2024-09-13 00:00:00	\N	N	\N
44	3	34	寃뚯씠諛??명듃遺?2024-09-13 00:00:00	\N	N	\N
45	3	34	?명듃?쇰턿	2024-09-13 00:00:00	\N	N	\N
46	3	35	?덈뱶濡쒖씠?쒗룿	2024-09-13 00:00:00	\N	N	\N
47	3	35	?꾩씠??2024-09-13 00:00:00	\N	N	\N
50	3	39	蹂쇳렂	2024-09-13 00:00:00	\N	N	\N
51	3	41	?붽? 釉붾줉	2024-09-13 00:00:00	\N	N	\N
52	3	42	李⑤웾??誘몃땲 泥?냼湲?2024-09-13 00:00:00	\N	N	\N
53	3	43	臾댄뼢 諛⑺뼢??2024-09-13 00:00:00	\N	N	\N
1	1	\N	媛援?2024-09-12 02:51:35.430188	\N	N	2024-09-24 10:56:16.879
392	3	383	?뺣쭑踰뚯쭛釉붾씪?몃뱶, 140x195 cm	2024-09-24 10:49:30.127655	\N	N	\N
393	3	383	?붾쭑釉붾씪?몃뱶, 100x195 cm	2024-09-24 10:49:35.316347	\N	N	\N
138	3	137	?щ쫫?대텋	2024-09-18 20:18:58.671396	\N	N	\N
394	3	383	?붾쭑釉붾씪?몃뱶, 140x195 cm	2024-09-24 10:49:39.940185	\N	N	\N
395	3	383	踰뚯쭛釉붾씪?몃뱶, 100x195 cm	2024-09-24 10:49:43.709823	\N	N	\N
396	3	384	由щえ而?2024-09-24 10:50:10.519654	\N	N	\N
397	3	384	?뚮윭洹?2024-09-24 10:50:16.114772	\N	N	\N
398	3	384	?ㅻ쭏???쒗뭹 ?덈툕	2024-09-24 10:50:22.545876	\N	N	\N
399	3	384	臾댁꽑 ?붾㉧/?꾩썝 ?ㅼ쐞移?2024-09-24 10:50:26.970399	\N	N	\N
385	2	115	 ??댄뙆???ㅽ뵾而?2024-09-24 10:47:44.627466	\N	Y	2024-09-24 10:51:06.596
400	3	385	?≪옄+WiFi ?ㅽ뵾而?2024-09-24 10:50:40.202397	\N	Y	2024-09-24 10:51:06.602
401	3	385	WiFi 梨낆옣 ?ㅽ뵾而?2024-09-24 10:50:48.150675	\N	Y	2024-09-24 10:51:06.625
402	3	385	梨낆옣 ?ㅽ뵾而??뚮줈?댁뒪?좊뱶	2024-09-24 10:50:52.815201	\N	Y	2024-09-24 10:51:06.641
403	3	385	?뚮줈?댁뒪?좊뱶+WiFi ?ㅽ뵾而?2024-09-24 10:51:02.634922	\N	Y	2024-09-24 10:51:06.659
404	3	385	?뚮줈?댁뒪?좊뱶+WiFi ?ㅽ뵾而?2024-09-24 10:51:02.641539	\N	Y	2024-09-24 10:51:06.675
405	2	115	??댄뙆???ㅽ뵾而?2024-09-24 10:51:23.367449	\N	N	\N
406	3	405	?≪옄+WiFi ?ㅽ뵾而?2024-09-24 10:51:32.296525	\N	N	\N
407	3	405	WiFi 梨낆옣 ?ㅽ뵾而?2024-09-24 10:51:38.252643	\N	N	\N
408	3	405	梨낆옣 ?ㅽ뵾而??뚮줈?댁뒪?좊뱶	2024-09-24 10:51:45.343787	\N	N	\N
409	3	405	?ㅽ뵾而??꾨벑+Wi-Fi, ?좊━ ?꾨벑媛?2024-09-24 10:51:59.423755	\N	N	\N
410	3	405	?뚮줈?댁뒪?좊뱶+WiFi ?ㅽ뵾而?2024-09-24 10:52:04.764052	\N	N	\N
411	3	382	?뚯씠釉?怨듦린泥?젙湲?2024-09-24 10:52:27.373666	\N	N	\N
412	3	382	?꾪꽣2醫?2024-09-24 10:52:35.760979	\N	N	\N
413	3	382	媛?ㅽ븘??2024-09-24 10:52:42.739851	\N	N	\N
116	2	115	?ㅻ쭏??議곕챸	2024-09-13 20:34:03.279597	\N	N	\N
54	1	\N	?꾩꽌	2024-09-13 14:51:50.493116	\N	Y	2024-09-24 15:07:00.459
190	3	126	?먰듃	2024-09-19 15:04:02.904416	\N	N	\N
120	1	\N	?대┛??IKEA	2024-09-18 03:42:08.958617	\N	N	\N
121	2	120	?대┛??2024-09-18 03:42:26.627203	\N	N	\N
122	3	121	?대┛??移⑤?	2024-09-18 03:44:31.952514	\N	N	\N
123	2	120	?곸쑀??2024-09-18 03:44:52.621545	\N	N	\N
125	1	\N	?꾩썐?꾩뼱	2024-09-18 03:45:37.165102	\N	N	\N
126	2	125	?쇱쇅??媛援?2024-09-18 03:45:51.640461	\N	N	\N
127	2	125	?쇱쇅???섎궔媛援?2024-09-18 03:46:03.04122	\N	N	\N
66	1	\N	怨꾩젅?⑺뭹	2024-09-13 17:24:45.472411	\N	Y	2024-09-24 15:08:36.01
129	2	125	?뚮씪??諛쏆묠?	2024-09-18 03:47:34.604101	\N	N	\N
131	1	\N	??꾩씤?뚮━??2024-09-18 03:54:12.198892	\N	N	\N
132	2	131	議곕┰怨듦뎄	2024-09-18 03:58:33.005471	\N	N	\N
133	3	132	?섏궗 & 怨좎젙?μ튂	2024-09-18 03:58:45.197224	\N	N	\N
134	3	132	怨듦뎄	2024-09-18 03:59:08.869212	\N	N	\N
3	3	2	?щТ???섏옄	2024-09-12 02:51:35.430188	\N	Y	2024-09-24 10:56:22.188
115	1	\N	???ㅻ쭏??2024-09-13 20:33:55.294721	2024-09-23 23:00:43.19	N	\N
218	3	2	寃뚯씠諛??섏옄	2024-09-19 18:40:50.974736	\N	Y	2024-09-24 10:56:24.98
4	2	2	梨낆긽	2024-09-12 07:02:52.954318	\N	Y	2024-09-24 10:56:27.665
135	1	\N	?띿뒪???2024-09-18 04:30:59.107437	\N	N	\N
137	2	135	移④뎄	2024-09-18 20:18:46.650109	\N	N	\N
139	3	137	踰좉컻	2024-09-18 20:19:10.011297	\N	N	\N
373	2	31	test1	2024-09-23 17:02:39.893502	\N	Y	2024-09-24 15:07:14.879
124	3	123	?곸쑀??媛援?2024-09-18 03:45:06.291241	2024-09-23 09:28:56.051	N	\N
374	3	373	test3	2024-09-23 17:02:45.039241	2024-09-23 17:02:50.088	Y	2024-09-24 15:07:14.885
111	2	66	遊??⑺뭹	2024-09-13 20:30:51.886965	\N	Y	2024-09-24 15:08:36.015
112	2	66	?щ쫫 ?⑺뭹	2024-09-13 20:30:58.082962	\N	Y	2024-09-24 15:08:36.036
113	2	66	媛???⑺뭹	2024-09-13 20:31:02.899816	\N	Y	2024-09-24 15:08:36.054
114	2	66	寃⑥슱 ?⑺뭹	2024-09-13 20:31:08.344237	\N	Y	2024-09-24 15:08:36.07
118	3	114	?덊꽣	2024-09-17 22:49:13.286937	\N	Y	2024-09-24 15:08:36.09
130	3	129	?뚮씪??2024-09-18 03:47:40.764267	\N	Y	2024-09-24 15:14:54.622
36	2	30	?앷린	2024-09-13 00:00:00	\N	Y	2024-09-24 15:18:57.243
117	3	116	臾댁꽑 LED ?꾧뎄	2024-09-13 20:34:14.711563	2024-09-23 09:49:43.669	N	\N
37	2	30	議곕━?꾧뎄	2024-09-13 00:00:00	\N	Y	2024-09-24 15:18:59.93
49	3	37	?꾨씪?댄뙩	2024-09-13 00:00:00	\N	Y	2024-09-24 15:18:59.94
414	3	382	?낆옄?꾪꽣	2024-09-24 10:52:49.701818	\N	N	\N
2	2	1	?섏옄	2024-09-12 02:51:35.430188	\N	Y	2024-09-24 10:56:17.688
432	3	416	 泥쒖뿰/?몄“媛二??뚰뙆	2024-09-24 10:54:42.065919	\N	Y	2024-09-24 10:56:29.005
422	2	1	 移⑤?	2024-09-24 10:53:43.20632	\N	Y	2024-09-24 10:56:29.325
423	2	1	 ?룹옣	2024-09-24 10:53:47.20055	\N	Y	2024-09-24 10:56:29.357
415	2	1	 ?쇱쇅??媛援?2024-09-24 10:53:08.307435	\N	N	2024-09-24 10:56:28.847
416	2	1	 ?뚰뙆	2024-09-24 10:53:12.140809	\N	N	2024-09-24 10:56:28.973
417	2	1	 ?붿껜??移댁슦移?2024-09-24 10:53:16.808004	\N	N	2024-09-24 10:56:29.143
418	2	1	 ?섎궔???μ떇??2024-09-24 10:53:20.590991	\N	N	2024-09-24 10:56:29.151
419	2	1	 嫄곗떎??李ъ옣/肄섏넄?뚯씠釉?2024-09-24 10:53:24.573408	\N	N	2024-09-24 10:56:29.167
420	2	1	 TV/硫?곕??붿뼱媛援?2024-09-24 10:53:31.060874	\N	N	2024-09-24 10:56:29.198
424	3	415	 ?쇱쇅 ?섏옄	2024-09-24 10:54:03.324268	\N	N	2024-09-24 10:56:28.863
425	3	415	 ?쇱쇅 ?앺긽/?섏옄	2024-09-24 10:54:07.440205	\N	N	2024-09-24 10:56:28.879
427	3	415	 ?대┛???쇱쇅媛援?2024-09-24 10:54:16.157939	\N	N	2024-09-24 10:56:28.894
428	3	415	 ?쇱쇅??媛援ъ빱踰?2024-09-24 10:54:20.23074	\N	N	2024-09-24 10:56:28.925
429	3	415	 ?쇨킅?뺤쓽???대㉨	2024-09-24 10:54:23.7097	\N	N	2024-09-24 10:56:28.943
430	3	416	 ?⑤툕由?냼??2024-09-24 10:54:34.15655	\N	N	2024-09-24 10:56:28.988
421	2	1	 TV/硫?곕??붿뼱媛援?2024-09-24 10:53:31.633724	\N	Y	2024-09-24 10:56:29.372
426	3	415	 ?쇱쇅??荑좎뀡	2024-09-24 10:54:11.763735	\N	N	2024-09-24 10:56:28.957
431	3	416	 泥쒖뿰/?몄“媛二??뚰뙆	2024-09-24 10:54:42.066267	\N	N	2024-09-24 10:56:29.119
433	3	416	 紐⑤뱢?앹냼??2024-09-24 15:03:18.380852	\N	N	\N
434	3	416	 ?뚰뙆踰좊뱶	2024-09-24 15:03:22.490444	\N	N	\N
436	3	419	 嫄곗떎??李ъ옣	2024-09-24 15:03:50.524809	\N	N	\N
437	3	419	 肄섏넄?뚯씠釉?2024-09-24 15:03:54.359952	\N	N	\N
438	3	418	 ?섎궔??2024-09-24 15:04:00.852295	\N	N	\N
439	3	418	 ?μ떇??2024-09-24 15:04:19.64428	\N	N	\N
440	3	418	 ?섎궔?좊떅/?섎궔??2024-09-24 15:04:23.579152	\N	N	\N
441	3	417	 ?붿껜??2024-09-24 15:04:31.674995	\N	N	\N
442	3	417	 湲댁쓽??移댁슦移?2024-09-24 15:04:35.211889	\N	N	\N
443	3	417	 ?붿껜???≪꽭?쒕━/遺??2024-09-24 15:04:43.941085	\N	N	\N
444	3	420	 TV/硫?곕??붿뼱 ?섎궔	2024-09-24 15:04:53.468133	\N	N	\N
445	3	420	 TV?μ떇??2024-09-24 15:04:58.573081	\N	N	\N
518	3	507	 而ㅽ뵾硫붿씠而?愿?⑥슜??2024-09-24 15:20:41.609839	\N	N	\N
65	2	54	?좎븘???꾩꽌	2024-09-13 17:22:34.297356	\N	Y	2024-09-24 15:07:01.29
446	3	38	???명듃	2024-09-24 15:07:45.314312	\N	N	\N
447	3	38	?묒? ?명듃	2024-09-24 15:07:48.597598	\N	N	\N
448	3	39	?고븘	2024-09-24 15:07:57.993734	\N	N	\N
449	1	\N	寃⑥슱 ?쒗뭹	2024-09-24 15:08:42.615066	\N	N	\N
450	2	449	 寃⑥슱 議곕챸	2024-09-24 15:08:47.599746	\N	N	\N
451	2	449	 寃⑥슱 ?붾텇/?앸Ъ	2024-09-24 15:08:51.383219	\N	N	\N
452	2	449	 寃⑥슱 ?μ떇/?곗퐫	2024-09-24 15:08:54.599694	\N	N	\N
453	2	449	 寃⑥슱 ?쒖쫵?몃뱶	2024-09-24 15:08:58.321409	\N	N	\N
454	2	449	 寃⑥슱 ?띿뒪???2024-09-24 15:09:01.839286	\N	N	\N
455	2	449	 寃⑥슱 ?뚯씠釉붿썾??2024-09-24 15:09:08.009526	\N	N	\N
456	2	449	 寃⑥슱 ?뚯씠釉붿썾??2024-09-24 15:09:08.009412	\N	Y	2024-09-24 15:09:13.381
457	3	450	 ?μ떇???쒕뜕??議곕챸	2024-09-24 15:10:05.366804	\N	N	\N
458	3	450	 ?μ떇???꾨벑媛?2024-09-24 15:10:09.506242	\N	N	\N
459	3	450	 LED罹붾뱾	2024-09-24 15:10:13.029877	\N	N	\N
460	3	450	 ?뚯씠釉?議곕챸 ?μ떇	2024-09-24 15:10:16.718691	\N	N	\N
461	3	450	 LED ?쒗꽩	2024-09-24 15:10:23.480679	\N	N	\N
462	3	450	 以??μ떇議곕챸	2024-09-24 15:10:32.232631	\N	N	\N
463	3	451	 寃⑥슱 ?섎Т/?앸Ъ	2024-09-24 15:10:41.414627	\N	N	\N
464	3	451	 寃⑥슱 ?붾텇/苑껊퀝	2024-09-24 15:10:45.918973	\N	N	\N
465	3	451	 寃⑥슱 苑??뷀솚	2024-09-24 15:10:50.905625	\N	N	\N
466	3	452	 ?몃━ ?μ떇???≪꽭?쒕━	2024-09-24 15:11:02.033555	\N	N	\N
467	3	452	 寃⑥슱 ?묒큹/?묒큹???2024-09-24 15:11:05.624699	\N	N	\N
468	3	452	 寃⑥슱 ?뚯씠釉붿옣??2024-09-24 15:11:09.406787	\N	N	\N
469	3	453	 ?由щ뜲???붾꼫	2024-09-24 15:11:17.51281	\N	N	\N
470	3	453	 ?由щ뜲???붿???2024-09-24 15:11:21.207938	\N	N	\N
471	3	453	 ?由щ뜲??湲고봽??2024-09-24 15:11:24.403822	\N	N	\N
472	3	454	?앺긽蹂? 150x150 cm	2024-09-24 15:11:36.153218	\N	N	\N
473	3	454	?꾨퉬諛쏆묠?, 19x19 cm	2024-09-24 15:11:41.537814	\N	N	\N
474	3	454	荑좎뀡而ㅻ쾭, 50x50 cm	2024-09-24 15:11:50.197231	\N	N	\N
475	3	454	?щ━?? S/M	2024-09-24 15:11:54.975884	\N	N	\N
476	3	455	而듬컺移???? 8.5 cm	2024-09-24 15:12:10.253106	\N	N	\N
477	3	126	 ?쇨킅?뺤쓽??2024-09-24 15:13:31.410881	\N	N	\N
478	3	126	?대㉨	2024-09-24 15:13:33.661726	\N	N	\N
479	3	127	?좊컲?좊떅, 60x27x74 cm	2024-09-24 15:14:10.322705	\N	N	\N
480	3	127	?섎궔?? ?ㅻ궡?멸껴?? 80x81 cm	2024-09-24 15:14:20.244785	\N	N	\N
481	3	127	?섎궔?? 60x35x86 cm	2024-09-24 15:14:25.260428	\N	N	\N
482	3	127	?좊컲?좊떅+?꾩뼱, 81x44x90 cm	2024-09-24 15:14:33.765343	\N	N	\N
483	3	129	?뚮씪?? 140 cm	2024-09-24 15:14:57.124044	\N	N	\N
484	3	129	?뚮씪??罹먮끂?? 300 cm	2024-09-24 15:15:01.589739	\N	N	\N
485	3	129	嫄몄씠?앺뙆?쇱넄, 330x240 cm	2024-09-24 15:15:05.899139	\N	N	\N
486	3	129	?뚮씪?? 300 cm	2024-09-24 15:15:10.092145	\N	N	\N
487	3	40	而щ윭 ?꾨졊	2024-09-24 15:15:44.518965	\N	N	\N
488	3	40	?쇰컲 ?꾨졊	2024-09-24 15:15:47.253745	\N	N	\N
489	3	41	?붽? 濡ㅻ윭	2024-09-24 15:16:04.896441	\N	N	\N
490	2	29	 二쇰갑 媛??2024-09-24 15:17:03.717332	\N	N	\N
491	2	29	 耳?대툝/異⑹쟾湲?2024-09-24 15:17:09.688712	\N	N	\N
492	2	29	 紐⑤컮???쒕툝由??≪꽭?쒕━	2024-09-24 15:17:16.399415	\N	N	\N
493	3	492	 臾댁꽑 異⑹쟾湲?& ?≪꽭?쒕━	2024-09-24 15:17:23.896928	\N	N	\N
494	3	492	 ?대???& ?쒕툝由?嫄곗튂?	2024-09-24 15:17:27.839106	\N	N	\N
495	3	492	 USB 異⑹쟾湲?2024-09-24 15:17:34.812576	\N	N	\N
496	3	491	 耳?대툝 ?뺣━ ?⑺뭹	2024-09-24 15:17:54.462227	\N	N	\N
497	3	491	 諛고꽣由?& 異⑹쟾湲?2024-09-24 15:18:01.610857	\N	N	\N
498	3	490	 ?뚰삎 二쇰갑媛??2024-09-24 15:18:11.776394	\N	N	\N
499	3	490	 媛?ㅻ젅?몄?/?몃뜒??2024-09-24 15:18:15.817158	\N	N	\N
500	3	490	 ?ㅻ툙 肄ㅻ퉬	2024-09-24 15:18:19.583995	\N	N	\N
501	3	490	 媛???≪꽭?쒕━	2024-09-24 15:18:23.097685	\N	N	\N
502	3	490	 ?됱옣怨?2024-09-24 15:18:30.019383	\N	N	\N
503	3	490	 ?섑뭾湲?2024-09-24 15:18:36.513438	\N	N	\N
48	3	36	洹몃쫯 ?명듃	2024-09-13 00:00:00	\N	Y	2024-09-24 15:18:57.248
504	2	30	 ?앺뭹蹂닿?/?뺣━	2024-09-24 15:19:04.249762	\N	N	\N
505	2	30	 ?붾꼫?⑥뼱	2024-09-24 15:19:09.721961	\N	N	\N
506	2	30	 ?쒕튃?⑥뼱	2024-09-24 15:19:15.264691	\N	N	\N
507	2	30	 而ㅽ뵾/李?2024-09-24 15:19:20.624358	\N	N	\N
508	2	30	 ?뚯씠釉??띿뒪???2024-09-24 15:19:47.037391	\N	N	\N
509	2	30	 議곕━?꾧뎄	2024-09-24 15:19:51.368299	\N	N	\N
510	3	509	 ?앺뭹?⑷린 諛??쒓퍚	2024-09-24 15:19:56.866829	\N	N	\N
511	3	509	 ?앺뭹 ?⑷린 ?명듃	2024-09-24 15:20:01.639029	\N	N	\N
512	3	509	 ?됱옣怨??뺣━??2024-09-24 15:20:05.546584	\N	N	\N
513	3	509	 ?ы듃由?& 議곕━? ?뺣━??2024-09-24 15:20:13.038845	\N	N	\N
514	3	508	 ?앺긽蹂??앺긽?μ떇蹂?2024-09-24 15:20:23.985995	\N	N	\N
515	3	508	 ?앺긽留ㅽ듃/而듬컺移?2024-09-24 15:20:27.20901	\N	N	\N
516	3	507	 癒멸렇??而?2024-09-24 15:20:33.755817	\N	N	\N
517	3	507	 蹂댁삩蹂?2024-09-24 15:20:38.010696	\N	N	\N
519	3	507	 李살＜?꾩옄/愿?⑥슜??2024-09-24 15:20:46.177066	\N	N	\N
520	3	506	 ?몃젅??2024-09-24 15:21:10.534646	\N	N	\N
521	3	506	 蹂?2024-09-24 15:21:13.890547	\N	N	\N
522	3	506	 ?쒕튃?묒떆	2024-09-24 15:21:17.53048	\N	N	\N
523	3	506	 耳?댄겕 ?ㅽ깲??2024-09-24 15:21:23.586796	\N	N	\N
524	3	506	 耳?댄겕 ?ㅽ깲??2024-09-24 15:21:23.586796	\N	Y	2024-09-24 15:21:27.355
525	3	505	 ?앷린?명듃	2024-09-24 15:21:47.800566	\N	N	\N
526	3	505	 ?묒떆	2024-09-24 15:21:51.162001	\N	N	\N
527	3	505	 ?묒떆S	2024-09-24 15:21:55.211982	\N	N	\N
528	3	505	 ?ㅻぉ?묒떆	2024-09-24 15:21:58.520966	\N	N	\N
529	3	505	 ?대┛???묒떆/洹몃쫯	2024-09-24 15:22:05.966128	\N	N	\N
530	3	504	 蹂?罹?2024-09-24 15:22:39.791306	\N	N	\N
532	3	504	 臾쇰퀝/?釉붾윭	2024-09-24 15:22:49.208238	\N	N	\N
531	3	504	 ?묐뀗/議곕?猷뚯뒪?좊뱶	2024-09-24 15:22:44.429282	\N	N	\N
533	3	504	 蹂대깋媛諛?2024-09-24 15:23:05.465045	\N	N	\N
534	3	504	 ??몃옓	2024-09-24 15:23:22.074404	\N	N	\N
535	3	43	諛⑺뼢??2024-09-24 15:23:53.814007	\N	N	\N
537	3	42	?몄감 ?⑺뭹	2024-09-24 15:24:14.440331	\N	N	\N
539	2	135	 荑좎뀡/荑좎뀡而ㅻ쾭	2024-09-24 15:24:36.967336	\N	N	\N
541	3	540	 移④뎄 而ㅻ쾭/?쒗듃	2024-09-24 15:24:48.625422	\N	N	\N
543	3	540	 踰좉컻	2024-09-24 15:24:58.807961	\N	N	\N
545	3	539	 荑좎뀡	2024-09-24 15:25:12.191205	\N	N	\N
546	3	539	 ?쇱쇅??踰좉컻	2024-09-24 15:25:16.806379	\N	N	\N
548	2	131	 議곕┰??留덈（/?고겕	2024-09-24 15:25:43.396484	\N	N	\N
550	2	131	 ?뚯쓬?≪닔 ?⑤꼸	2024-09-24 15:25:50.318371	\N	N	\N
555	3	554	 ?쇰??ㅼ씠??踰쏀뙣??2024-09-24 15:26:40.816844	\N	N	\N
551	2	131	 ?쇰）?쒓굅?⑺뭹	2024-09-24 15:25:57.256421	\N	Y	2024-09-24 15:34:49.036
536	3	42	?뚰삎 泥?냼湲?2024-09-24 15:24:05.037033	\N	N	\N
538	2	135	 而ㅽ듉/釉붾씪?몃뱶	2024-09-24 15:24:34.264405	\N	N	\N
542	3	540	 ?대텋	2024-09-24 15:24:54.549277	\N	N	\N
544	3	539	 荑좎뀡而ㅻ쾭	2024-09-24 15:25:08.423304	\N	N	\N
547	3	539	 ?띿퓼??2024-09-24 15:25:20.403622	\N	N	\N
549	2	131	 ?먯옟??2024-09-24 15:25:47.272359	\N	N	\N
554	2	131	 二쇰갑 踰쏀뙣??2024-09-24 15:26:31.754039	\N	N	\N
552	3	551	 ?섏궗 & 怨좎젙?μ튂	2024-09-24 15:26:06.153581	\N	Y	2024-09-24 15:34:49.05
540	2	135	 ?대┛???띿뒪???2024-09-24 15:24:41.414955	\N	N	\N
553	3	551	 怨듦뎄	2024-09-24 15:26:09.283954	\N	Y	2024-09-24 15:34:49.329
556	2	131	?쇰）?쒓굅?⑺뭹	2024-09-24 15:34:59.275392	\N	N	\N
557	3	549	?ㅻ궡?⑸ぉ?ъ삤?? 500 ml	2024-09-24 15:35:25.347693	\N	Y	2024-09-24 15:35:35.604
558	3	556	?ㅻ궡?⑸ぉ?ъ삤?? 500 ml	2024-09-24 15:35:46.498785	\N	N	\N
559	3	556	?섏씤?몃텚?명듃	2024-09-24 15:35:51.923879	\N	N	\N
560	3	550	?낅┰?뺤뒪?щ┛, 80x150 cm	2024-09-24 15:36:07.218346	\N	N	\N
561	3	550	?≪쓬而ㅽ듉, 145x250 cm	2024-09-24 15:36:13.753696	\N	N	\N
562	3	550	諛⑹쓬?⑤꼸, 41x41 cm	2024-09-24 15:36:18.145098	\N	N	\N
563	3	548	議곕┰留덈（, 0.81 m짼	2024-09-24 15:36:40.987044	\N	N	\N
564	3	548	議곕┰留덈（, 0.90 m짼	2024-09-24 15:36:57.711604	\N	N	\N
565	3	548	紐⑥꽌由щ쭏媛먯옱, ?쇱쇅???고겕	2024-09-24 15:37:02.219869	\N	N	\N
566	3	549	?먯옟?? 143 mm	2024-09-24 15:37:17.562858	\N	N	\N
567	3	549	?먯옟?? 25 mm	2024-09-24 15:37:24.273257	\N	N	\N
568	3	121	 ?대┛??留ㅽ듃由ъ뒪	2024-09-24 15:38:01.82814	\N	N	\N
569	3	121	 ?대┛???섎궔/?뺣━	2024-09-24 15:38:05.486096	\N	N	\N
570	3	121	 ?대┛???뚰삎 媛援?2024-09-24 15:38:09.524355	\N	N	\N
571	3	121	 怨듬?諛?媛援??≪꽭?쒕━	2024-09-24 15:38:13.771588	\N	N	\N
572	3	123	 ?대┛??議곕챸	2024-09-24 15:38:53.917886	\N	N	\N
573	3	123	 湲곗?洹援먰솚?/?≪꽭?쒕━	2024-09-24 15:39:02.531038	\N	N	\N
574	3	123	 ?곸쑀??移⑤?/留ㅽ듃由ъ뒪	2024-09-24 15:39:18.059931	\N	N	\N
435	3	416	 ?뗭뒪??諛쒕컺移⑤?	2024-09-24 15:03:31.949741	2024-09-24 17:22:21.312	N	\N
\.


--
-- Data for Name: m_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_customer (customer_no, customer_name, customer_tel, customer_representative_name, customer_business_reg_no, customer_addr, customer_fax_no, customer_manager_name, customer_manager_email, customer_manager_tel, customer_country_code, customer_type, customer_e_tax_invoice_yn, customer_transaction_start_date, customer_transaction_end_date, customer_insert_date, customer_update_date, customer_delete_yn, customer_delete_date) FROM stdin;
126	?쒖삩?쒖뒪??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	JP	03	Y	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.525
35	?쇱꽦?꾩옄	010-1111-3333	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.bbb	010-1111-1111	KR	02	Y	2024-09-02 09:00:00	2024-09-25 09:00:00	2024-09-13 16:32:50.220166	2024-09-24 15:47:37.268	N	\N
58	?쒕??쏀뭹	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	Y	2024-09-20 16:09:49.687
56	?쇱쿇由ъ옄?꾧굅	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
60	硫붾뵒?≪뒪 (MedyTox)	010-1111-2222	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	Y	2024-09-20 16:18:43.799
36	SK	010-2222-3333	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
64	??낆젣??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
55	?먯궛?명봽?쇱퐫??(Doosan Infracore)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
121	?쒖씠?먯뒪耳??(JSK)	010-2222-3333	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.525
41	?쒗솕	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
38	LG?꾩옄	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
122	?쒓뎅?꾨젰怨듭궗	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.473
59	?쇱꽦臾쇱궛	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
119	移댁뭅??010-2222-3333	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.582
120	?붿뵪?뚰봽??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.582
62	?먯궛洹몃９	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
67	?꾨え?덊띁?쒗뵿	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
57	湲덊샇?앹쑀?뷀븰	010-2222-4444	???	111-11-11111	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-8211	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	2024-09-23 16:52:24.683	Y	2024-09-24 15:39:17.299
37	?꾨??먮룞李?010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
66	SK?대끂踰좎씠??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
65	?쇱꽦?앸챸	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
69	?ㅽ뒠?붿삤?쒕옒怨?010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
68	援먮낫?앸챸	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
70	S-Oil	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
123	?쒓뎅??댁뼱	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.473
124	?먯궛?명봽?쇱퐫??010-2222-2222	???	222-22-98974	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.525
125	?μ뒯	010-2222-4333	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	03	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.525
103	?먯씠移섏뿕鍮?(HLB)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	?뉎뀋	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	2024-09-23 16:32:45.052	Y	2024-09-24 15:39:35.152
101	?뚰겕?쒖뒪??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
42	GS?섑띁留덉폆	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
43	KT&G	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
46	CJ One	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
49	?쒖쭊?앸같	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
127	?꾨땲??(Winia)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-19 17:30:13.285173	\N	Y	2024-09-20 15:56:19.525
48	?먯퐫留덉???(Eco Marketing)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
53	?⑥꽦	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
54	?섎┝	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
31	?좏븳?묓뻾	010-1111-5601	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 15:18:01.467016	\N	N	\N
83	?섏??붿뒪?뚮젅??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
71	?붿떊?뺢났	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
61	YG Entertainer	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
63	JYP Entertainer	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
102	?섏씠釉?010-1111-5601	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	Y	2024-09-20 15:56:54.542
90	SM Entertainer	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
72	留덉폆而щ━	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
73	?좎뒪(Toss)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
75	?꾨찓??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
76	?덊뵆?ъ뒪	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
32	荑좏뙜 (Coupang)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 15:18:01.467016	\N	N	\N
39	?ъ뒪肄붿씤?곕궡?붾꼸	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
74	由щ뵒 (Ridi)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
77	???(Fink)	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
79	?꾨??꾩븘	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
78	?꾨땳??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
81	濡?뜲?쇳븨	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
84	?먯궛?⑥뼹?	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
82	?쒗솕?뚰겕??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
128	?먯뼱?쒖썝(SharedOne)	031-414-3270	議곕큺??374-88-00836	?쒖슱?밸퀎??媛뺣궓援???궪濡?208, 2痢?202??031-414-3270	議곕큺??cho_bh@sharedone.co.kr	031-414-3270	KR	A	Y	2024-09-24 17:00:00	\N	2024-09-24 17:00:00.467016	\N	N	\N
148	test			111-11-11111									\N	\N	2024-09-25 09:59:59.981393	\N	Y	2024-09-25 10:00:07.042
92	?좎쭊濡쒕큸	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
100	?쒗솕?먯뼱濡쒖뒪?섏씠??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
44	?좎꽭怨꾧렇猷?010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
85	??뺤쟾??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
86	??깆갹??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
87	留덊겕濡쒖젨	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
89	諛곕떖?섎?議?010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
80	吏?덉썚??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	Y	2024-09-24 15:39:29.114
91	?붾툕?덉씤	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
99	?ъ뒪肄붿?誘몄뭡	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
98	?쇱꽦諛붿씠?ㅻ줈吏곸뒪	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
94	?꾩씠?쇱뒪 (I-SENS)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
45	?대끂??(Innocean)	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
88	耳?댁뿞?붾툝??(KMW)	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
96	?쇱삩?쒗걧??010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	03	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	2024-09-24 16:29:57.292	N	\N
47	KT	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
93	?먯씠?꾨줈??010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
95	?쒖깦	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
97	?꾨??쒖쿋	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
149	test3			666-66-66666									\N	\N	2024-09-25 10:01:42.208147	2024-09-25 10:19:18.878	Y	2024-09-25 10:02:44.393
50	?먯궛	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
51	HMM	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2023-01-02 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
52	?곹뭾臾멸퀬	010-1111-1111	???	111-11-11111	?쒖슱??媛뺣궓援?02-111-1111	?대떦??	manager1@customer1.com	010-111-1111	KR	A	Y	2023-01-01 00:00:00	\N	2024-09-13 16:32:50.220166	\N	N	\N
40	濡?뜲留덊듃	010-2222-2222	???	222-22-22222	?쒖슱???쒖큹援?02-222-2222	?대떦??	manager2@customer2.com	010-222-2222	US	B	N	2024-09-26 09:00:00	2024-10-12 09:00:00	2024-09-13 16:32:50.220166	2024-09-25 09:58:43.311	N	\N
\.


--
-- Data for Name: m_employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_employee (employee_id, employee_pw, employee_name, employee_email, employee_tel, employee_role, employee_insert_date, employee_update_date, employee_delete_yn, employee_delete_date) FROM stdin;
adminn	123123123	諛뺤꽌?щ컯?쒗씗	a010@test.com	010-1213-4568	admin	2024-09-24 15:55:55.353957	2024-09-24 15:58:41.829938	Y	2024-09-24 15:58:41.829
emp065	pw065	?뺤??	jieun@company.com	010-1111-1111	staff	2024-09-19 17:51:23.500193	2024-09-24 15:59:18.684946	N	2024-09-24 15:59:18.684
emp066	pw066	?쒖?誘?jimin@company.com	010-2222-2222	staff	2024-09-19 17:51:23.500193	2024-09-24 16:01:01.222061	N	2024-09-24 16:01:01.222
emp067	pw067	媛뺣???kangms@company.com	010-1234-5678	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.270183	N	2024-09-24 16:01:01.262
emp068	pw068	理쒖꽌??choisy@company.com	010-2345-6789	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.310382	N	2024-09-24 16:01:01.31
emp069	pw069	諛깆???baekjh@company.com	010-3456-7890	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.367152	N	2024-09-24 16:01:01.367
emp070	pw070	?ㅼ???yunjh@company.com	010-4567-8901	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.46361	N	2024-09-24 16:01:01.463
emp071	pw071	源?꾩?	kimhj@company.com	010-5678-9012	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.511611	N	2024-09-24 16:01:01.511
emp072	pw072	諛뺤???parkjs@company.com	010-6789-0123	staff	2024-09-19 17:52:20.037372	2024-09-20 09:46:46.497672	N	2024-09-20 09:46:46.497
sharedone	sharedone	?먯뼱?쒖썝	admin@sharedone.com	031-414-3270	admin	2024-09-24 16:53:49.089595	2024-09-24 16:53:49.089595	N	2024-09-24 16:53:49.089595
emp02	pw02	留ㅻ땲?	emp2@company.com	010-2222-2222	manager	2024-09-12 02:54:49.089595	2024-09-24 17:16:03.064	N	2024-09-19 17:55:25.455
emp063	pw063	?댁쿋??chulsoo@company.com	010-8888-8888	staff	2024-09-19 17:51:23.500193	2024-09-24 17:16:08.668126	Y	2024-09-24 17:16:08.668
admin	admin	愿由ъ옄	emp1@company.com	010-1111-1111	admin	2024-09-12 02:54:49.089595	2024-09-24 16:01:01.944781	N	2024-09-24 16:01:01.936
emp03	pw03	?ㅽ깭??emp3@company.com	010-3333-3333	staff	2024-09-12 02:54:49.089595	2024-09-24 16:01:01.896997	N	2024-09-24 16:01:01.896
emp073	pw073	?댁닔誘?leesm@company.com	010-7890-1234	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.560627	N	2024-09-24 16:01:01.56
emp074	pw074	?뺣떎?	jungde@company.com	010-8901-2345	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.608169	N	2024-09-24 16:01:01.6
emp075	pw075	?쒗깭??hant@company.com	010-9012-3456	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.648163	N	2024-09-24 16:01:01.648
emp076	pw076	諛곗???baej@company.com	010-0123-4567	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.752144	N	2024-09-24 16:01:01.752
emp077	pw077	?ㅽ븯??ohhy@company.com	010-1234-5678	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.800579	N	2024-09-24 16:01:01.8
emp078	pw078	?좏삙吏?shj@company.com	010-2345-6789	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:01.849267	N	2024-09-24 16:01:01.849
emp079	pw079	?닿꼍誘?leekm@company.com	010-3456-7890	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:02.047463	N	2024-09-24 16:01:02.044
emp080	pw080	臾몄닔鍮?moonsb@company.com	010-4567-8901	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:02.099613	N	2024-09-24 16:01:02.098
emp081	pw081	?쒖삁吏	seoyj@company.com	010-5678-9012	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:02.144015	N	2024-09-24 16:01:02.141
emp082	pw082	?덉꽦??ahnsh@company.com	010-6789-0123	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:02.196426	N	2024-09-24 16:01:02.189
emp085	pw085	媛뺤쑀??kangyj@company.com	010-9012-3456	staff	2024-09-19 17:52:20.037372	\N	N	\N
emp086	pw086	理쒖???choijh@company.com	010-0123-4567	staff	2024-09-19 17:52:20.037372	\N	N	\N
emp087	pw087	源?쒖?	kimseojun@company.com	010-1234-5678	staff	2024-09-19 17:52:20.037372	\N	N	\N
emp083	pw083	源吏誘?kimjm@company.com	010-7890-1234	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:02.238595	N	2024-09-24 16:01:02.238
emp084	pw084	諛뺤꽦??parksw@company.com	010-8901-2345	staff	2024-09-19 17:52:20.037372	2024-09-24 16:01:02.293264	N	2024-09-24 16:01:02.288
test	test	?뚯뒪??test@test.com	010-2020-3030	manager	2024-09-24 17:13:59.830223	\N	N	\N
\.


--
-- Data for Name: m_order_d; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_order_d (order_d_no, order_h_no, product_cd, order_d_price, order_d_qty, order_d_total_price, order_d_delivery_request_date, order_d_insert_date, order_d_update_date, order_d_delete_yn, order_d_delete_date) FROM stdin;
266	3	P0016	600.00	20	12000.00	2024-12-06 09:00:00	2024-09-24 16:18:32.459409	2024-09-24 16:18:45.738186	N	\N
267	3	P0015	700.00	30	21000.00	2024-12-06 09:00:00	2024-09-24 16:18:32.522933	2024-09-24 16:18:45.785546	N	\N
268	3	P0018	800.00	10	8000.00	2024-12-06 09:00:00	2024-09-24 16:18:32.58457	2024-09-24 16:18:45.833023	N	\N
248	5	P0102	20000.00	1	20000.00	2024-09-02 09:00:00	2024-09-24 14:02:29.248751	2024-09-24 14:57:29.062034	N	\N
270	4	P0006	700.00	20	14000.00	2024-10-11 09:00:00	2024-09-24 16:19:52.334379	2024-09-24 07:19:51.888	N	\N
271	2	P0018	900.00	20	18000.00	2024-09-25 09:00:00	2024-09-24 16:20:31.768513	2024-09-24 16:20:49.942142	N	\N
251	6	P0012	300.00	10	3000.00	2024-11-01 09:00:00	2024-09-24 15:03:21.411311	2024-09-24 15:10:48.309527	N	\N
253	7	P0102	30.00	10	300.00	2024-10-31 09:00:00	2024-09-24 15:12:48.530427	2024-09-24 15:13:08.004425	N	\N
254	7	P0016	60.00	10	600.00	2024-10-31 09:00:00	2024-09-24 15:12:48.596792	2024-09-24 15:13:08.051719	N	\N
273	11	P0013	9000.00	30	270000.00	2024-10-12 09:00:00	2024-09-24 16:25:23.017611	2024-09-24 16:33:21.656006	N	\N
257	8	P0016	600.00	20	12000.00	2024-10-12 09:00:00	2024-09-24 15:16:51.152459	2024-09-24 15:24:40.314807	N	\N
263	8	P0122	400.00	20	8000.00	2024-10-12 09:00:00	2024-09-24 15:24:22.911411	2024-09-24 15:24:40.408065	N	\N
275	11	P0017	5000.00	30	150000.00	2024-10-12 09:00:00	2024-09-24 16:25:23.017611	2024-09-24 16:33:21.687646	N	\N
276	12	P0016	3000.00	10	30000.00	2024-10-11 09:00:00	2024-09-24 16:28:42.034284	2024-09-24 16:33:35.818914	N	\N
278	12	P0070	6000.00	20	120000.00	2024-10-11 09:00:00	2024-09-24 16:28:42.034284	2024-09-24 16:33:35.865793	N	\N
285	15	P0102	10000.00	20	200000.00	2024-09-01 09:00:00	2024-09-24 16:57:14.503888	\N	N	\N
289	17	P0102	11112.00	11	122232.00	2024-09-19 09:00:00	2024-09-24 17:29:22.67016	2024-09-24 17:30:59.438667	N	\N
290	17	P0016	11111.00	11	122221.00	2024-09-19 09:00:00	2024-09-24 17:29:22.67016	2024-09-24 17:30:59.475024	N	\N
291	17	P0222	3333.00	33	109989.00	2024-09-19 09:00:00	2024-09-24 17:29:22.67016	2024-09-24 17:30:59.508297	N	\N
244	1	P0016	20000.00	10	200000.00	2024-11-08 09:00:00	2024-09-24 12:34:47.268301	2024-09-24 18:15:11.345513	N	\N
293	19	P0001	3000.00	20	60000.00	2024-10-10 09:00:00	2024-09-24 19:09:33.633714	\N	N	\N
294	19	P0102	5000.00	10	50000.00	2024-10-10 09:00:00	2024-09-24 19:09:33.633714	\N	N	\N
295	19	P0016	6000.00	30	180000.00	2024-10-10 09:00:00	2024-09-24 19:09:33.633714	\N	N	\N
300	22	P0001	5000.00	20	100000.00	2024-10-11 09:00:00	2024-09-24 19:43:26.205752	\N	N	\N
301	22	A0004 	6000.00	10	60000.00	2024-10-11 09:00:00	2024-09-24 19:43:26.205752	\N	N	\N
302	22	A0005	300.00	10	3000.00	2024-10-11 09:00:00	2024-09-24 19:43:26.205752	\N	N	\N
304	24	P0050	6600.00	10	66000.00	2024-10-12 09:00:00	2024-09-25 09:40:53.008641	\N	N	\N
305	24	P0086	8000.00	10	80000.00	2024-10-12 09:00:00	2024-09-25 09:40:53.008641	\N	N	\N
306	24	P0102	9000.00	20	180000.00	2024-10-12 09:00:00	2024-09-25 09:40:53.008641	\N	N	\N
310	26	P0122	6000.00	20	120000.00	2024-10-11 09:00:00	2024-09-25 09:52:26.007758	\N	N	\N
311	26	P0086	8000.00	10	80000.00	2024-10-11 09:00:00	2024-09-25 09:52:26.007758	\N	N	\N
312	26	P0019	9000.00	20	180000.00	2024-10-11 09:00:00	2024-09-25 09:52:26.007758	\N	N	\N
269	4	P0010	600.00	20	12000.00	2024-10-11 09:00:00	2024-09-24 16:19:52.258271	2024-09-24 07:19:51.821	N	\N
272	2	P0122	800.00	13	10400.00	2024-09-25 09:00:00	2024-09-24 16:20:31.835875	2024-09-24 16:20:50.001007	N	\N
279	13	P0010	2200.00	10	22000.00	2024-11-01 09:00:00	2024-09-24 16:41:08.245811	2024-09-24 16:41:43.688587	N	\N
252	7	A0001	10.00	20	200.00	2024-10-31 09:00:00	2024-09-24 15:12:48.458334	2024-09-24 15:13:08.098615	N	\N
256	9	P0016	600.00	20	12000.00	2024-10-12 09:00:00	2024-09-24 15:16:51.151219	\N	N	\N
280	13	P0122	3333.00	50	166650.00	2024-11-01 09:00:00	2024-09-24 16:41:08.245811	2024-09-24 16:41:43.719078	N	\N
281	13	P0018	8888.00	10	88880.00	2024-11-01 09:00:00	2024-09-24 16:41:08.245811	2024-09-24 16:41:43.76639	N	\N
260	9	P0102	7000.00	10	70000.00	2024-10-12 09:00:00	2024-09-24 15:16:55.262988	\N	N	\N
282	14	P0015	500.00	20	10000.00	2024-10-11 09:00:00	2024-09-24 16:49:47.469405	\N	N	\N
262	8	P0016	600.00	20	12000.00	2024-10-12 09:00:00	2024-09-24 15:24:22.855198	2024-09-24 15:24:40.456765	N	\N
283	14	P0017	700.00	20	14000.00	2024-10-11 09:00:00	2024-09-24 16:49:47.469405	\N	N	\N
284	14	P0018	800.00	20	16000.00	2024-10-11 09:00:00	2024-09-24 16:49:47.469405	\N	N	\N
286	16	P0122	600000.00	50	30000000.00	2024-10-12 09:00:00	2024-09-24 17:08:37.149382	\N	N	\N
287	16	A0005	400000.00	10	4000000.00	2024-10-12 09:00:00	2024-09-24 17:08:37.149382	\N	N	\N
288	16	P0001	50000.00	30	1500000.00	2024-10-12 09:00:00	2024-09-24 17:08:37.149382	\N	N	\N
292	18	P0222	5000.00	10	50000.00	2024-10-12 09:00:00	2024-09-24 18:11:14.942168	\N	N	\N
245	1	P0222	5001.00	10	50010.00	2024-11-08 09:00:00	2024-09-24 12:34:47.497192	2024-09-24 18:15:11.389782	N	\N
246	1	A0001	8000.00	20	160000.00	2024-11-08 09:00:00	2024-09-24 12:34:47.569911	2024-09-24 18:15:11.424071	N	\N
296	20	P0006	60000.00	20	1200000.00	2024-10-04 09:00:00	2024-09-24 19:22:59.632967	2024-09-24 19:23:14.344962	N	\N
297	20	P0016	50000.00	10	500000.00	2024-10-04 09:00:00	2024-09-24 19:23:14.90952	2024-09-24 10:23:14.366	N	\N
298	20	P0102	80000.00	10	800000.00	2024-10-04 09:00:00	2024-09-24 19:23:14.959718	2024-09-24 10:23:14.419	N	\N
299	21	P0006	8000.00	20	160000.00	2024-10-11 09:00:00	2024-09-24 19:27:07.652631	\N	N	\N
303	23	P0222	5000.00	10	50000.00	2024-10-12 09:00:00	2024-09-25 09:37:44.326746	\N	N	\N
307	25	P0122	6000.00	20	120000.00	2024-10-11 09:00:00	2024-09-25 09:52:25.965351	\N	N	\N
308	25	P0086	8000.00	10	80000.00	2024-10-11 09:00:00	2024-09-25 09:52:25.965351	\N	N	\N
309	25	P0019	9000.00	20	180000.00	2024-10-11 09:00:00	2024-09-25 09:52:25.965351	\N	N	\N
313	27	P0050	6000.00	20	120000.00	2024-10-11 09:00:00	2024-09-25 10:39:27.663933	\N	N	\N
\.


--
-- Data for Name: m_order_h; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_order_h (order_h_no, customer_no, employee_id, order_h_total_price, order_h_status, order_h_insert_date, order_h_update_date, order_h_delete_yn, order_h_delete_date) FROM stdin;
4	55	admin	26000.00	approved	2024-09-24 14:00:08.421544	2024-09-25 10:17:02.886536	N	\N
6	58	admin	3000.00	approved	2024-09-24 15:03:21.222654	2024-09-25 10:19:13.936145	N	\N
7	58	admin	1100.00	approved	2024-09-24 15:12:48.383627	2024-09-25 10:19:15.017933	N	\N
8	58	admin	32000.00	denied	2024-09-24 15:16:51.101527	2024-09-25 10:24:51.605256	N	\N
13	55	admin	277530.00	approved	2024-09-24 16:41:08.127654	2024-09-25 10:25:27.752025	N	\N
18	36	admin	50000.00	denied	2024-09-24 18:11:14.852407	2024-09-25 10:27:27.253939	N	\N
19	60	admin	290000.00	denied	2024-09-24 19:09:33.535643	2024-09-25 10:27:28.334337	N	\N
21	36	admin	160000.00	denied	2024-09-24 19:27:07.591201	2024-09-25 10:29:14.253068	N	\N
23	36	admin	50000.00	denied	2024-09-25 09:37:44.263126	2024-09-25 10:29:14.36183	N	\N
25	64	admin	380000.00	approved	2024-09-25 09:52:17.318626	2024-09-25 10:29:23.361016	N	\N
27	55	admin	120000.00	approved	2024-09-25 10:39:27.599817	2024-09-25 10:40:05.654279	N	\N
2	55	admin	28400.00	approved	2023-12-24 14:14:08.421544	2024-09-24 16:57:18.808119	N	\N
15	35	emp02	200000.00	approved	2024-09-24 16:57:14.42584	2024-08-24 17:31:54.757651	N	\N
16	128	sharedone	35500000.00	approved	2024-09-24 17:08:37.053841	2024-09-24 17:31:52.942319	N	\N
20	56	admin	2500000.00	approved	2024-09-24 19:22:59.577579	2024-09-24 19:23:14.298171	N	\N
5	41	admin	20000.00	approved	2024-09-24 14:02:29.187858	2024-09-25 10:17:01.750408	N	\N
9	58	admin	91000.00	denied	2024-09-24 15:16:51.096453	2024-09-25 10:24:50.430882	N	\N
11	41	admin	420000.00	denied	2024-09-24 16:25:22.827332	2024-09-25 10:24:52.563448	N	\N
12	121	admin	150000.00	approved	2024-09-24 16:28:41.206884	2024-09-25 10:25:25.627115	N	\N
14	55	admin	40000.00	approved	2024-09-24 16:49:44.415488	2024-09-25 10:27:15.767243	N	\N
17	126	sharedone	354442.00	approved	2024-09-24 17:29:22.591125	2024-09-25 10:27:17.156539	N	\N
22	60	admin	163000.00	denied	2024-09-24 19:43:26.116055	2024-09-25 10:29:14.310537	N	\N
24	36	admin	326000.00	approved	2024-09-25 09:40:52.912899	2024-09-25 10:29:23.297844	N	\N
26	64	admin	380000.00	approved	2024-09-25 09:52:23.576026	2024-09-25 10:40:05.715952	N	\N
3	126	admin	41000.00	approved	2023-12-25 14:14:08.421544	2024-09-24 16:57:19.916632	N	\N
1	126	admin	410010.00	denied	2022-09-24 14:13:20.887365	2024-09-24 19:27:17.6958	N	\N
\.


--
-- Data for Name: m_price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_price (price_no, customer_no, product_cd, price_customer, price_start_date, price_end_date, price_insert_date, price_update_date, price_delete_yn, price_delete_date) FROM stdin;
274	126	P0102	15000.00	2024-09-21	2024-10-31	2024-09-24 17:24:10.978866	2024-09-24 17:25:16.418	N	\N
273	126	P0102	12000.00	2024-09-01	2024-09-20	2024-09-24 17:23:24.621529	2024-09-24 17:25:16.469	N	\N
269	35	P0102	10000.00	2100-01-01	2024-09-30	2024-09-24 16:48:37.647691	2024-09-24 16:52:20.85	Y	2024-09-24 16:54:26.041
270	35	A0005	10000.00	2024-09-01	2024-09-30	2024-09-24 16:54:36.673328	\N	N	\N
271	36	P0102	20000.00	2024-09-01	2024-09-15	2024-09-24 16:54:59.633121	2024-09-24 17:08:20.595	N	\N
272	36	P0102	20000.00	2024-09-16	2024-10-30	2024-09-24 17:00:39.146221	2024-09-24 17:08:20.657	N	\N
\.


--
-- Data for Name: m_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_product (product_cd, category_no, product_nm, product_insert_date, product_update_date, product_delete_yn, product_delete_date, product_price) FROM stdin;
P0102	122	轅덇씀??移⑤?	2024-09-24 10:36:09.753999	2024-09-24 16:47:09.628703	N	\N	1313.00
P0086	3	誘몄슜媛??2	2024-09-13 00:00:00	2024-09-24 23:23:23.151531	N	\N	10000.00
P0019	3	臾댄뼢 諛⑺뼢??1	2024-09-13 00:00:00	2024-09-24 23:22:42.771143	N	\N	10000.00
P0122	44	寃뚯씠諛??명듃遺?2024-09-24 10:42:30.448515	2024-09-24 16:47:42.000918	N	\N	1213212.00
P0222	442	移댁슦移?2024-09-24 10:37:17.385482	2024-09-24 16:47:53.609822	N	\N	123123.00
P0049	3	?ㅻ궡 ?대룞湲곌뎄 1	2024-09-13 00:00:00	2024-09-24 23:23:01.594413	N	\N	10000.00
P0050	3	?ㅻ궡 ?대룞湲곌뎄 2	2024-09-13 00:00:00	2024-09-24 23:23:02.244765	N	\N	10000.00
P0051	3	臾댁꽑 泥?냼湲?1	2024-09-13 00:00:00	2024-09-24 23:23:03.020534	N	\N	10000.00
P0052	3	臾댁꽑 泥?냼湲?2	2024-09-13 00:00:00	2024-09-24 23:23:04.132931	N	\N	10000.00
P0053	3	洹몃┫ 湲곌린 1	2024-09-13 00:00:00	2024-09-24 23:23:04.668983	N	\N	10000.00
P0054	3	洹몃┫ 湲곌린 2	2024-09-13 00:00:00	2024-09-24 23:23:05.179696	N	\N	10000.00
P0055	3	?먯뼱?꾨씪?댁뼱 1	2024-09-13 00:00:00	2024-09-24 23:23:05.630035	N	\N	10000.00
D0001	374	寃??蹂쇳렂	2024-09-24 02:45:45.806783	2024-09-24 23:22:29.085555	N	\N	10000.00
P0056	3	?먯뼱?꾨씪?댁뼱 2	2024-09-13 00:00:00	2024-09-24 23:23:06.014084	N	\N	10000.00
P0087	3	?ㅼ씪?꾪듃 ?꾧뎄 ?명듃 1	2024-09-13 00:00:00	2024-09-24 23:23:23.693024	N	\N	10000.00
P0088	3	?ㅼ씪?꾪듃 ?꾧뎄 ?명듃 2	2024-09-13 00:00:00	2024-09-24 23:23:24.17541	N	\N	10000.00
A0005	3	?섏옄	2024-09-19 16:36:52.603037	2024-09-25 08:40:15.134554	Y	2024-09-25 08:40:15.121554	10000.00
P0057	3	媛?듦린 1	2024-09-13 00:00:00	2024-09-24 23:23:06.472058	N	\N	10000.00
P0061	3	?ㅽ깲???곗뒪??1	2024-09-13 00:00:00	2024-09-24 23:19:05.220454	Y	2024-09-24 23:19:05.21746	10000.00
P0095	3	諛붾뵒 ?ㅽ겕??1	2024-09-13 00:00:00	\N	N	\N	10000.00
P0020	3	臾댄뼢 諛⑺뼢??2	2024-09-13 00:00:00	2024-09-24 23:22:43.285378	N	\N	10000.00
P0001	555	?쇰??ㅼ씠??踰쏀뙣??	2024-09-12 02:52:11.150196	2024-09-24 23:22:29.78067	N	\N	10000.00
P0021	3	寃뚯씠諛?紐⑤땲??1	2024-09-13 00:00:00	2024-09-24 23:22:44.000508	N	\N	10000.00
P0058	3	媛?듦린 2	2024-09-13 00:00:00	2024-09-24 23:23:06.86612	N	\N	10000.00
P1231	447	?섏꺽	2024-09-24 16:10:30.584283	\N	N	\N	5000.00
P0022	3	寃뚯씠諛?紐⑤땲??2	2024-09-13 00:00:00	2024-09-24 23:22:45.625632	N	\N	10000.00
P0023	3	釉붾（?ъ뒪 ?ㅽ뵾而?1	2024-09-13 00:00:00	2024-09-24 23:22:46.160709	N	\N	10000.00
P0024	3	釉붾（?ъ뒪 ?ㅽ뵾而?2	2024-09-13 00:00:00	2024-09-24 23:22:47.244429	N	\N	10000.00
P0025	3	而ㅽ뵾 硫붿씠而?1	2024-09-13 00:00:00	2024-09-24 23:22:48.076741	N	\N	10000.00
P0026	3	而ㅽ뵾 硫붿씠而?2	2024-09-13 00:00:00	2024-09-24 23:22:48.645892	N	\N	10000.00
P0059	3	留덉슦?ㅽ뙣??1	2024-09-13 00:00:00	2024-09-24 23:23:07.341678	N	\N	10000.00
P0060	3	留덉슦?ㅽ뙣??2	2024-09-13 00:00:00	2024-09-24 23:23:07.909015	N	\N	10000.00
P0062	3	?ㅽ깲???곗뒪??2	2024-09-13 00:00:00	2024-09-24 23:23:12.659629	N	\N	10000.00
P0063	3	?뚯쟾 ?섏옄 1	2024-09-13 00:00:00	2024-09-24 23:23:13.100811	N	\N	10000.00
P1424	425	洹몃쫯 ?명듃	2024-09-24 16:27:01.306809	\N	N	\N	121332.00
P0005	3	?섏옄 洹몃┛ E	2024-09-12 20:24:55.566457	2024-09-24 23:22:32.268381	N	\N	10000.00
P0027	3	?꾩옄?덉씤吏 1	2024-09-13 00:00:00	2024-09-24 23:22:49.311843	N	\N	10000.00
P0038	3	?좎븘???먯쟾嫄?2	2024-09-13 00:00:00	2024-09-24 23:22:55.671951	N	\N	10000.00
P0039	3	諛붾뵒濡쒖뀡 1	2024-09-13 00:00:00	2024-09-24 23:22:56.243315	N	\N	10000.00
P0040	3	諛붾뵒濡쒖뀡 2	2024-09-13 00:00:00	2024-09-24 23:22:56.753191	N	\N	10000.00
P0006	3	?섏옄 釉붾옓 F	2024-09-12 20:39:38.894799	2024-09-24 23:22:33.055883	N	\N	10000.00
P0064	3	?뚯쟾 ?섏옄 2	2024-09-13 00:00:00	2024-09-24 23:23:13.852637	N	\N	10000.00
P0041	3	?꾩옄梨?由щ뜑湲?1	2024-09-13 00:00:00	2024-09-24 23:22:57.285207	N	\N	10000.00
P0096	3	諛붾뵒 ?ㅽ겕??2	2024-09-13 00:00:00	2024-09-24 23:22:12.484713	Y	2024-09-24 23:22:12.483587	10000.00
A0001	425	洹몃쫯 ?명듃	2024-09-19 14:17:55.785101	2024-09-24 23:22:20.283588	N	\N	141411.00
A0002	413	?붽굅?몃낵	2024-09-19 14:23:16.366078	2024-09-24 23:22:24.231231	N	\N	10000.00
A0004 	3	?섏??명듃	2024-09-19 14:30:58.826527	2024-09-24 23:22:25.665122	N	\N	10000.00
P0009	3	洹몃쫯 ?명듃 1	2024-09-13 00:00:00	2024-09-24 23:22:34.133949	N	\N	10000.00
P0010	3	洹몃쫯 ?명듃 2	2024-09-13 00:00:00	2024-09-24 23:22:34.643995	N	\N	10000.00
P0012	49	?꾨씪?댄뙩 2	2024-09-13 00:00:00	2024-09-24 23:22:35.932017	N	\N	10000.00
P0013	50	蹂쇳렂 1	2024-09-13 00:00:00	2024-09-24 23:22:36.473634	N	\N	10000.00
P0014	50	蹂쇳렂 2	2024-09-13 00:00:00	2024-09-24 23:22:37.28258	N	\N	10000.00
P0015	3	?붽? 釉붾줉 1	2024-09-13 00:00:00	2024-09-24 23:22:37.970674	N	\N	10000.00
P0016	424	?붽? 釉붾줉 2	2024-09-13 00:00:00	2024-09-24 23:22:40.911959	N	\N	10000.00
P0017	3	李⑤웾??誘몃땲 泥?냼湲?1	2024-09-13 00:00:00	2024-09-24 23:22:41.570421	N	\N	10000.00
P0018	3	李⑤웾??誘몃땲 泥?냼湲?2	2024-09-13 00:00:00	2024-09-24 23:22:42.232305	N	\N	10000.00
P0047	3	LED 議곕챸 1	2024-09-13 00:00:00	2024-09-24 23:23:00.443805	N	\N	10000.00
P0048	3	LED 議곕챸 2	2024-09-13 00:00:00	2024-09-24 23:23:01.041378	N	\N	10000.00
P0067	3	踰쎄구???쒓퀎 1	2024-09-13 00:00:00	2024-09-24 23:23:14.359033	N	\N	10000.00
P0068	3	踰쎄구???쒓퀎 2	2024-09-13 00:00:00	2024-09-24 23:23:14.953127	N	\N	10000.00
P0085	3	誘몄슜媛??1	2024-09-13 00:00:00	2024-09-24 23:23:22.664728	N	\N	10000.00
A0003	3	?뚯뒪?蹂?2024-09-19 14:28:53.864566	2024-09-24 23:22:24.951983	N	\N	10000.00
P0002	424	罹좏븨???섏옄	2024-09-12 20:10:34.422431	2024-09-24 23:22:30.443256	N	\N	10000.00
P0003	3	?섏옄 洹몃젅??C	2024-09-12 20:19:56.261717	2024-09-24 23:22:31.039798	N	\N	10000.00
P0004	44	寃뚯씠諛??명듃遺?A	2024-09-12 20:20:18.969973	2024-09-24 23:22:31.67175	N	\N	10000.00
P0007	3	?명븳 ?섏옄	2024-09-13 00:21:00.176732	2024-09-24 23:22:33.590956	N	\N	10000.00
P1123	448	?고븘	2024-09-24 16:40:01.363703	\N	N	\N	34141412412.00
P0011	49	?꾨씪?댄뙩 1	2024-09-13 00:00:00	2024-09-24 23:22:35.363823	N	\N	10000.00
P0028	3	?꾩옄?덉씤吏 2	2024-09-13 00:00:00	2024-09-24 23:22:49.943797	N	\N	10000.00
P0029	3	?대????좏뭾湲?1	2024-09-13 00:00:00	2024-09-24 23:22:50.574253	N	\N	10000.00
P0030	3	?대????좏뭾湲?2	2024-09-13 00:00:00	2024-09-24 23:22:51.201482	N	\N	10000.00
P0031	3	?ㅻ궡 ?먯쟾嫄?1	2024-09-13 00:00:00	2024-09-24 23:22:51.765748	N	\N	10000.00
P0032	3	?ㅻ궡 ?먯쟾嫄?2	2024-09-13 00:00:00	2024-09-24 23:22:52.342246	N	\N	10000.00
P0033	3	李⑤웾??怨듦린泥?젙湲?1	2024-09-13 00:00:00	2024-09-24 23:22:52.942765	N	\N	10000.00
P24622	430	洹몃쫯 ?명듃	2024-09-24 18:30:41.636773	\N	N	\N	5234.00
P0034	3	李⑤웾??怨듦린泥?젙湲?2	2024-09-13 00:00:00	2024-09-24 23:22:53.500542	N	\N	10000.00
P0035	3	?곸긽 ?쒓퀎 1	2024-09-13 00:00:00	2024-09-24 23:22:54.049957	N	\N	10000.00
P0036	3	?곸긽 ?쒓퀎 2	2024-09-13 00:00:00	2024-09-24 23:22:54.58482	N	\N	10000.00
P0037	3	?좎븘???먯쟾嫄?1	2024-09-13 00:00:00	2024-09-24 23:22:55.131734	N	\N	10000.00
P0042	3	?꾩옄梨?由щ뜑湲?2	2024-09-13 00:00:00	2024-09-24 23:22:57.803012	N	\N	10000.00
P0043	3	?붾텇 1	2024-09-13 00:00:00	2024-09-24 23:22:58.341981	N	\N	10000.00
P0044	3	?붾텇 2	2024-09-13 00:00:00	2024-09-24 23:22:58.852579	N	\N	10000.00
P0045	3	?ㅽ룷痢????1	2024-09-13 00:00:00	2024-09-24 23:22:59.361259	N	\N	10000.00
P0046	3	?ㅽ룷痢????2	2024-09-13 00:00:00	2024-09-24 23:22:59.960451	N	\N	10000.00
A0232	48	?곷컲	2024-09-24 11:51:37.635069	2024-09-25 08:40:18.430393	Y	2024-09-25 08:40:18.430393	112124.00
A1201	48	洹몃쫯 ?명듃	2024-09-24 12:18:30.517981	2024-09-25 09:38:46.970269	Y	2024-09-25 09:38:46.965912	2341.00
A23234	431	洹몃쫯 ?명듃	2024-09-24 18:31:19.958232	2024-09-25 09:38:54.8506	N	\N	325253.00
P0090	3	?ㅻ쭏???⑦봽 2	2024-09-13 00:00:00	\N	N	\N	10000.00
P0093	3	?ㅼ뼱?쒕씪?댁뼱 1	2024-09-13 00:00:00	\N	N	\N	10000.00
P0094	3	?ㅼ뼱?쒕씪?댁뼱 2	2024-09-13 00:00:00	\N	N	\N	10000.00
P0097	3	?섎궔??1	2024-09-13 00:00:00	\N	N	\N	10000.00
P0098	3	?섎궔??2	2024-09-13 00:00:00	\N	N	\N	10000.00
P0099	3	?ㅻ툙 1	2024-09-13 00:00:00	\N	N	\N	10000.00
P0100	3	?ㅻ툙 2	2024-09-13 00:00:00	2024-09-24 18:12:38.856257	N	\N	10000.00
A00012	392	2222	2024-09-24 17:20:08.558716	2024-09-24 23:22:23.394717	N	\N	2222.00
P0069	3	?덊듃?덉씠???명듃 1	2024-09-13 00:00:00	2024-09-24 23:23:15.471427	N	\N	10000.00
P0070	3	?덊듃?덉씠???명듃 2	2024-09-13 00:00:00	2024-09-24 23:23:16.040702	N	\N	10000.00
P0073	3	?ㅻ쭏?몄썙移?1	2024-09-13 00:00:00	2024-09-24 23:23:16.552436	N	\N	10000.00
P0074	3	?ㅻ쭏?몄썙移?2	2024-09-13 00:00:00	2024-09-24 23:23:17.032168	N	\N	10000.00
P0075	3	?꾩옄 ???1	2024-09-13 00:00:00	2024-09-24 23:23:17.518693	N	\N	10000.00
P0076	3	?꾩옄 ???2	2024-09-13 00:00:00	2024-09-24 23:23:18.053855	N	\N	10000.00
P0077	3	?좎셿??移⑤? 1	2024-09-13 00:00:00	2024-09-24 23:23:18.562249	N	\N	10000.00
P0078	3	?좎셿??移⑤? 2	2024-09-13 00:00:00	2024-09-24 23:23:19.012178	N	\N	10000.00
P0079	3	?깆궛 ?ㅽ떛 1	2024-09-13 00:00:00	2024-09-24 23:23:19.520237	N	\N	10000.00
P0080	3	?깆궛 ?ㅽ떛 2	2024-09-13 00:00:00	2024-09-24 23:23:19.996511	N	\N	10000.00
P0081	3	罹좏븨 ?섏옄 1	2024-09-13 00:00:00	2024-09-24 23:23:20.513243	N	\N	10000.00
P0082	3	罹좏븨 ?섏옄 2	2024-09-13 00:00:00	2024-09-24 23:23:20.964481	N	\N	10000.00
P0083	3	?뚮씪由ъ? ?ㅽ듃 1	2024-09-13 00:00:00	2024-09-24 23:23:21.505204	N	\N	10000.00
P0084	3	?뚮씪由ъ? ?ㅽ듃 2	2024-09-13 00:00:00	2024-09-24 23:23:22.069659	N	\N	10000.00
P0089	3	?ㅻ쭏???⑦봽 1	2024-09-13 00:00:00	2024-09-24 23:23:24.650642	N	\N	10000.00
\.


--
-- Name: m_category_category_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_category_category_no_seq', 606, true);


--
-- Name: m_customer_customer_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_customer_customer_no_seq', 149, true);


--
-- Name: m_order_d_order_d_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_order_d_order_d_no_seq', 313, true);


--
-- Name: m_order_h_order_h_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_order_h_order_h_no_seq', 27, true);


--
-- Name: m_price_price_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_price_price_no_seq', 274, true);


--
-- Name: m_category m_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_category
    ADD CONSTRAINT m_category_pkey PRIMARY KEY (category_no);


--
-- Name: m_customer m_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_customer
    ADD CONSTRAINT m_customer_pkey PRIMARY KEY (customer_no);


--
-- Name: m_employee m_employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_employee
    ADD CONSTRAINT m_employee_pkey PRIMARY KEY (employee_id);


--
-- Name: m_order_d m_order_d_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_d
    ADD CONSTRAINT m_order_d_pkey PRIMARY KEY (order_d_no);


--
-- Name: m_order_h m_order_h_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_h
    ADD CONSTRAINT m_order_h_pkey PRIMARY KEY (order_h_no);


--
-- Name: m_price m_price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_price
    ADD CONSTRAINT m_price_pkey PRIMARY KEY (price_no);


--
-- Name: m_product m_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_product
    ADD CONSTRAINT m_product_pkey PRIMARY KEY (product_cd);


--
-- Name: m_product fk_category_no; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_product
    ADD CONSTRAINT fk_category_no FOREIGN KEY (category_no) REFERENCES public.m_category(category_no);


--
-- Name: m_price fk_customer_no; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_price
    ADD CONSTRAINT fk_customer_no FOREIGN KEY (customer_no) REFERENCES public.m_customer(customer_no);


--
-- Name: m_order_h fk_customer_no; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_h
    ADD CONSTRAINT fk_customer_no FOREIGN KEY (customer_no) REFERENCES public.m_customer(customer_no);


--
-- Name: m_order_h fk_employee_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_h
    ADD CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES public.m_employee(employee_id);


--
-- Name: m_order_d fk_order_h_no; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_d
    ADD CONSTRAINT fk_order_h_no FOREIGN KEY (order_h_no) REFERENCES public.m_order_h(order_h_no);


--
-- Name: m_category fk_parent_category_no; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_category
    ADD CONSTRAINT fk_parent_category_no FOREIGN KEY (parent_category_no) REFERENCES public.m_category(category_no);


--
-- Name: m_price fk_product_cd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_price
    ADD CONSTRAINT fk_product_cd FOREIGN KEY (product_cd) REFERENCES public.m_product(product_cd);


--
-- Name: m_order_d fk_product_cd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_order_d
    ADD CONSTRAINT fk_product_cd FOREIGN KEY (product_cd) REFERENCES public.m_product(product_cd);


--
-- PostgreSQL database dump complete
--

