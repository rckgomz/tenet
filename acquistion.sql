--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: address_type_enum; Type: TYPE; Schema: public; Owner: tenet
--

CREATE TYPE public.address_type_enum AS ENUM (
    'primary',
    'secondary',
    'mailing',
    'sessional'
);


ALTER TYPE public.address_type_enum OWNER TO tenet;

--
-- Name: email_type_enum; Type: TYPE; Schema: public; Owner: tenet
--

CREATE TYPE public.email_type_enum AS ENUM (
    'primary',
    'secondary',
    'business'
);


ALTER TYPE public.email_type_enum OWNER TO tenet;

--
-- Name: loan_application_status_enum; Type: TYPE; Schema: public; Owner: tenet
--

CREATE TYPE public.loan_application_status_enum AS ENUM (
    'openned',
    'closed',
    'submitted',
    'approved',
    'rejected',
    'processing'
);


ALTER TYPE public.loan_application_status_enum OWNER TO tenet;

--
-- Name: phone_number_number_type_enum; Type: TYPE; Schema: public; Owner: tenet
--

CREATE TYPE public.phone_number_number_type_enum AS ENUM (
    'mobile',
    'home',
    'business'
);


ALTER TYPE public.phone_number_number_type_enum OWNER TO tenet;

--
-- Name: phone_number_type_enum; Type: TYPE; Schema: public; Owner: tenet
--

CREATE TYPE public.phone_number_type_enum AS ENUM (
    'primary',
    'secondary',
    'sessional'
);


ALTER TYPE public.phone_number_type_enum OWNER TO tenet;

--
-- Name: product_type_enum; Type: TYPE; Schema: public; Owner: tenet
--

CREATE TYPE public.product_type_enum AS ENUM (
    'car',
    'other'
);


ALTER TYPE public.product_type_enum OWNER TO tenet;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: address; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.address (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    type public.address_type_enum DEFAULT 'primary'::public.address_type_enum NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    state character varying(2) NOT NULL,
    zip_code character varying(10) NOT NULL,
    person_id uuid
);


ALTER TABLE public.address OWNER TO tenet;

--
-- Name: applicant; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.applicant (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    monthly_debt numeric NOT NULL,
    monthly_income numeric NOT NULL,
    person_snapshot json NOT NULL,
    person_id uuid,
    loan_application_id uuid
);


ALTER TABLE public.applicant OWNER TO tenet;

--
-- Name: email; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.email (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    type public.email_type_enum DEFAULT 'primary'::public.email_type_enum NOT NULL,
    value text NOT NULL,
    person_id uuid
);


ALTER TABLE public.email OWNER TO tenet;

--
-- Name: loan_application; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.loan_application (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    term_in_months integer NOT NULL,
    status public.loan_application_status_enum DEFAULT 'openned'::public.loan_application_status_enum NOT NULL,
    amount numeric NOT NULL,
    item_value numeric NOT NULL,
    product_id uuid,
    loan_offer_id uuid
);


ALTER TABLE public.loan_application OWNER TO tenet;

--
-- Name: loan_offer; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.loan_offer (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    apr numeric NOT NULL,
    monthly_payment numeric NOT NULL,
    accepted boolean NOT NULL,
    applicant_facts jsonb NOT NULL,
    reason jsonb NOT NULL
);


ALTER TABLE public.loan_offer OWNER TO tenet;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO tenet;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: tenet
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO tenet;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tenet
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: person; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.person (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    ssn character varying(9),
    date_of_birth date
);


ALTER TABLE public.person OWNER TO tenet;

--
-- Name: phone_number; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.phone_number (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    type public.phone_number_type_enum DEFAULT 'primary'::public.phone_number_type_enum NOT NULL,
    number_type public.phone_number_number_type_enum DEFAULT 'mobile'::public.phone_number_number_type_enum NOT NULL,
    value text NOT NULL,
    person_id uuid
);


ALTER TABLE public.phone_number OWNER TO tenet;

--
-- Name: product; Type: TABLE; Schema: public; Owner: tenet
--

CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    version integer NOT NULL,
    name text NOT NULL,
    type public.product_type_enum DEFAULT 'car'::public.product_type_enum NOT NULL,
    term_in_months integer DEFAULT 72 NOT NULL
);


ALTER TABLE public.product OWNER TO tenet;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: email PK_1e7ed8734ee054ef18002e29b1c; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY (id);


--
-- Name: person PK_5fdaf670315c4b7e70cce85daa3; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY (id);


--
-- Name: loan_offer PK_6a57f20b55378194073699c662a; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.loan_offer
    ADD CONSTRAINT "PK_6a57f20b55378194073699c662a" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: loan_application PK_a8e4b60ea8218fb408a4c4ab2c4; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.loan_application
    ADD CONSTRAINT "PK_a8e4b60ea8218fb408a4c4ab2c4" PRIMARY KEY (id);


--
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- Name: phone_number PK_c16f58426537a660b3f2a26e983; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.phone_number
    ADD CONSTRAINT "PK_c16f58426537a660b3f2a26e983" PRIMARY KEY (id);


--
-- Name: address PK_d92de1f82754668b5f5f5dd4fd5; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY (id);


--
-- Name: applicant PK_f4a6e907b8b17f293eb073fc5ea; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.applicant
    ADD CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY (id);


--
-- Name: loan_application REL_1b96ea8670bf322a3363a0713e; Type: CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.loan_application
    ADD CONSTRAINT "REL_1b96ea8670bf322a3363a0713e" UNIQUE (loan_offer_id);


--
-- Name: IDX_481f645da1ee8d1585cec94180; Type: INDEX; Schema: public; Owner: tenet
--

CREATE UNIQUE INDEX "IDX_481f645da1ee8d1585cec94180" ON public.phone_number USING btree (person_id, value);


--
-- Name: IDX_8ab345ad0e2f3c808a504f495a; Type: INDEX; Schema: public; Owner: tenet
--

CREATE UNIQUE INDEX "IDX_8ab345ad0e2f3c808a504f495a" ON public.email USING btree (person_id, value);


--
-- Name: IDX_f2aac17bf584f55d998bef39c3; Type: INDEX; Schema: public; Owner: tenet
--

CREATE UNIQUE INDEX "IDX_f2aac17bf584f55d998bef39c3" ON public.person USING btree (ssn);


--
-- Name: loan_application FK_1b96ea8670bf322a3363a0713ea; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.loan_application
    ADD CONSTRAINT "FK_1b96ea8670bf322a3363a0713ea" FOREIGN KEY (loan_offer_id) REFERENCES public.loan_offer(id);


--
-- Name: phone_number FK_4d4780c2f9317a82c40ff325942; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.phone_number
    ADD CONSTRAINT "FK_4d4780c2f9317a82c40ff325942" FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: applicant FK_4e56b17c80c81894b2618fedef7; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.applicant
    ADD CONSTRAINT "FK_4e56b17c80c81894b2618fedef7" FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: email FK_b01d6da324899002409e6721a1c; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT "FK_b01d6da324899002409e6721a1c" FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: address FK_b370008f75f439dbba95cf6d5e8; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "FK_b370008f75f439dbba95cf6d5e8" FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: applicant FK_fa964e8bd79ed5452c245abb708; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.applicant
    ADD CONSTRAINT "FK_fa964e8bd79ed5452c245abb708" FOREIGN KEY (loan_application_id) REFERENCES public.loan_application(id);


--
-- Name: loan_application FK_fc25d0dbd914ad1e8ddca5a8fc3; Type: FK CONSTRAINT; Schema: public; Owner: tenet
--

ALTER TABLE ONLY public.loan_application
    ADD CONSTRAINT "FK_fc25d0dbd914ad1e8ddca5a8fc3" FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- PostgreSQL database dump complete
--

