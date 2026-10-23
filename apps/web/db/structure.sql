--
-- PostgreSQL database dump
--


-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: movementsmobile; Type: TABLE; Schema: public; Owner: stablesl
--

CREATE TABLE public.movementsmobile (
    id integer NOT NULL,
    "timestamp" bigint,
    amount real NOT NULL,
    "newBalance" real NOT NULL,
    "salesOrderId" integer,
    "purchaseOrderId" integer,
    other character varying(1024)
);


ALTER TABLE public.movementsmobile OWNER TO stablesl;

--
-- Name: movementsmobile_id_seq; Type: SEQUENCE; Schema: public; Owner: stablesl
--

ALTER TABLE public.movementsmobile ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movementsmobile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: purchaseorder; Type: TABLE; Schema: public; Owner: stablesl
--

CREATE TABLE public.purchaseorder (
    id integer NOT NULL,
    "quoteId" integer NOT NULL,
    token character varying(32) NOT NULL,
    state character varying(32) NOT NULL,
    seconds integer NOT NULL,
    "amountSle" real NOT NULL,
    "amountCrypto" real NOT NULL,
    "receiverPhone" character varying(15) NOT NULL,
    "receiverName" character varying(80) NOT NULL,
    "transactionUrl" character varying(1024),
    "timestampTx" bigint,
    "timestampExpired" bigint,
    "timestampSms" bigint,
    "messageSms" character varying(1024),
    crypto character varying(20) DEFAULT 'usdt'::character varying NOT NULL
);


ALTER TABLE public.purchaseorder OWNER TO stablesl;

--
-- Name: purchaseorder_id_seq; Type: SEQUENCE; Schema: public; Owner: stablesl
--

ALTER TABLE public.purchaseorder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.purchaseorder_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: purchasequote; Type: TABLE; Schema: public; Owner: stablesl
--

CREATE TABLE public.purchasequote (
    id integer NOT NULL,
    "senderPhone" character varying(15) NOT NULL,
    "senderName" character varying(80) NOT NULL,
    "senderWallet" character varying(50) NOT NULL,
    "cryptoPriceInSle" real NOT NULL,
    maximum real NOT NULL,
    minimum real NOT NULL,
    "timestamp" bigint NOT NULL,
    token character varying(32) NOT NULL,
    crypto character varying(20) DEFAULT 'usdt'::character varying NOT NULL
);


ALTER TABLE public.purchasequote OWNER TO stablesl;

--
-- Name: purchasequote_id_seq; Type: SEQUENCE; Schema: public; Owner: stablesl
--

ALTER TABLE public.purchasequote ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.purchasequote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: salesorder; Type: TABLE; Schema: public; Owner: stablesl
--

CREATE TABLE public.salesorder (
    id integer NOT NULL,
    "quoteId" integer NOT NULL,
    token character varying(32) NOT NULL,
    state character varying(32) NOT NULL,
    seconds integer NOT NULL,
    "amountSle" real NOT NULL,
    crypto character varying(20) DEFAULT 'usdt'::character varying NOT NULL,
    "amountCrypto" real NOT NULL,
    "cryptoBalance" real NOT NULL,
    "senderPhone" character varying(15) NOT NULL,
    "senderName" character varying(80) NOT NULL,
    "transactionUrl" character varying(1024),
    "timestampTx" bigint,
    "timestampExpired" bigint,
    "timestampUssd" bigint,
    "numberUssd" character varying(1024),
    "receiverPhone" character varying(15) NOT NULL,
    "receiverName" character varying(80) NOT NULL,
    "messageUssd" character varying(1024)
);


ALTER TABLE public.salesorder OWNER TO stablesl;

--
-- Name: salesorder_id_seq; Type: SEQUENCE; Schema: public; Owner: stablesl
--

ALTER TABLE public.salesorder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.salesorder_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: salesquote; Type: TABLE; Schema: public; Owner: stablesl
--

CREATE TABLE public.salesquote (
    id integer NOT NULL,
    "receiverPhone" character varying(15) NOT NULL,
    "receiverName" character varying(80) NOT NULL,
    "receiverWallet" character varying(50) NOT NULL,
    crypto character varying(20) DEFAULT 'usdt'::character varying NOT NULL,
    "cryptoPriceInSle" real NOT NULL,
    maximum real NOT NULL,
    minimum real NOT NULL,
    "timestamp" bigint NOT NULL,
    token character varying(32) NOT NULL,
    "senderPhone" character varying(15) NOT NULL,
    "senderName" character varying(80) NOT NULL,
    "cryptoBalance" real
);


ALTER TABLE public.salesquote OWNER TO stablesl;

--
-- Name: salesquote_id_seq; Type: SEQUENCE; Schema: public; Owner: stablesl
--

ALTER TABLE public.salesquote ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.salesquote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: smslog; Type: TABLE; Schema: public; Owner: stablesl
--

CREATE TABLE public.smslog (
    id integer NOT NULL,
    "timestamp" bigint,
    ip character varying(16),
    "phoneNumber" character varying(15),
    message character varying(1024)
);


ALTER TABLE public.smslog OWNER TO stablesl;

--
-- Name: smslog_id_seq; Type: SEQUENCE; Schema: public; Owner: stablesl
--

ALTER TABLE public.smslog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.smslog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: movementsmobile; Type: TABLE DATA; Schema: public; Owner: stablesl
--

-- data omitted (structure only): public.movementsmobile


--
-- Data for Name: purchaseorder; Type: TABLE DATA; Schema: public; Owner: stablesl
--

-- data omitted (structure only): public.purchaseorder


--
-- Data for Name: purchasequote; Type: TABLE DATA; Schema: public; Owner: stablesl
--

-- data omitted (structure only): public.purchasequote


--
-- Data for Name: salesorder; Type: TABLE DATA; Schema: public; Owner: stablesl
--

-- data omitted (structure only): public.salesorder


--
-- Data for Name: salesquote; Type: TABLE DATA; Schema: public; Owner: stablesl
--

-- data omitted (structure only): public.salesquote


--
-- Data for Name: smslog; Type: TABLE DATA; Schema: public; Owner: stablesl
--

-- data omitted (structure only): public.smslog


--
-- Name: movementsmobile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stablesl
--

SELECT pg_catalog.setval('public.movementsmobile_id_seq', 2, true);


--
-- Name: purchaseorder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stablesl
--

SELECT pg_catalog.setval('public.purchaseorder_id_seq', 236, true);


--
-- Name: purchasequote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stablesl
--

SELECT pg_catalog.setval('public.purchasequote_id_seq', 4945, true);


--
-- Name: salesorder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stablesl
--

SELECT pg_catalog.setval('public.salesorder_id_seq', 32, true);


--
-- Name: salesquote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stablesl
--

SELECT pg_catalog.setval('public.salesquote_id_seq', 365, true);


--
-- Name: smslog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: stablesl
--

SELECT pg_catalog.setval('public.smslog_id_seq', 734, true);


--
-- Name: movementsmobile movementsmobile_pkey; Type: CONSTRAINT; Schema: public; Owner: stablesl
--

ALTER TABLE ONLY public.movementsmobile
    ADD CONSTRAINT movementsmobile_pkey PRIMARY KEY (id);


--
-- Name: purchaseorder purchaseorder_pkey; Type: CONSTRAINT; Schema: public; Owner: stablesl
--

ALTER TABLE ONLY public.purchaseorder
    ADD CONSTRAINT purchaseorder_pkey PRIMARY KEY (id);


--
-- Name: purchasequote purchasequote_pkey; Type: CONSTRAINT; Schema: public; Owner: stablesl
--

ALTER TABLE ONLY public.purchasequote
    ADD CONSTRAINT purchasequote_pkey PRIMARY KEY (id);


--
-- Name: salesorder salesorder_pkey; Type: CONSTRAINT; Schema: public; Owner: stablesl
--

ALTER TABLE ONLY public.salesorder
    ADD CONSTRAINT salesorder_pkey PRIMARY KEY (id);


--
-- Name: salesquote salesquote_pkey; Type: CONSTRAINT; Schema: public; Owner: stablesl
--

ALTER TABLE ONLY public.salesquote
    ADD CONSTRAINT salesquote_pkey PRIMARY KEY (id);


--
-- Name: smslog smslog_pkey; Type: CONSTRAINT; Schema: public; Owner: stablesl
--

ALTER TABLE ONLY public.smslog
    ADD CONSTRAINT smslog_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


