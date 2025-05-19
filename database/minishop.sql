--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-15 06:16:08

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
-- TOC entry 224 (class 1259 OID 16501)
-- Name: admin_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_logs (
    id integer NOT NULL,
    action text,
    product_id integer,
    admin_username text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_logs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16500)
-- Name: admin_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 223
-- Name: admin_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_logs_id_seq OWNED BY public.admin_logs.id;


--
-- TOC entry 220 (class 1259 OID 16479)
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16478)
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 219
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- TOC entry 218 (class 1259 OID 16460)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_name character varying(100),
    email character varying(100),
    address text,
    items jsonb,
    total_amount numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone text,
    subtotal numeric(10,2),
    tax numeric(10,2),
    shipping numeric(10,2),
    status character varying(20) DEFAULT 'Pending'::character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16459)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 217
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 222 (class 1259 OID 16490)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric(10,2) NOT NULL,
    category text,
    image_url text,
    description text,
    stock integer DEFAULT 0
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16489)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 226 (class 1259 OID 16512)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer,
    user_name character varying(100) NOT NULL,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16511)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 225
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 4768 (class 2604 OID 16504)
-- Name: admin_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_logs_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 16482)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 16463)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 16493)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 16515)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4937 (class 0 OID 16501)
-- Dependencies: 224
-- Data for Name: admin_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_logs (id, action, product_id, admin_username, "timestamp") FROM stdin;
1	add	2	admin	2025-05-13 19:08:14.108407
2	add	3	admin	2025-05-13 21:38:57.786758
3	add	4	admin	2025-05-13 22:20:02.823063
4	add	5	admin	2025-05-14 03:52:24.52032
5	delete	4	admin	2025-05-14 03:52:53.564693
6	add	6	admin	2025-05-14 04:56:24.881343
7	add	7	admin	2025-05-14 05:49:17.991731
8	delete	2	admin	2025-05-14 05:49:42.637237
9	add	8	admin	2025-05-15 03:17:20.13828
10	add	9	admin	2025-05-15 03:28:40.379404
11	add	10	admin	2025-05-15 03:32:06.797744
12	add	11	admin	2025-05-15 03:41:18.304812
13	add	12	admin	2025-05-15 03:42:26.60671
14	delete	9	admin	2025-05-15 03:43:28.863833
15	add	13	admin	2025-05-15 03:50:17.922061
16	delete	12	admin	2025-05-15 03:51:36.939074
\.


--
-- TOC entry 4933 (class 0 OID 16479)
-- Dependencies: 220
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, username, password) FROM stdin;
3	admin	$2b$12$XqP4smKA56pYijWv1Byqseg1.QLNPlaZ7BAOOFdMKsD8ym92t3fJG
\.


--
-- TOC entry 4931 (class 0 OID 16460)
-- Dependencies: 218
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_name, email, address, items, total_amount, created_at, phone, subtotal, tax, shipping, status) FROM stdin;
1	qqqqq	qqq@gmail.com	qqq, qqq, qq 12345	[{"name": "Smartwatch", "price": 199.99, "quantity": 1}]	225.99	2025-05-08 05:39:43.243276	\N	\N	\N	\N	Pending
2	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Laptop", "price": 999.99, "quantity": 1}]	1089.99	2025-05-08 06:28:51.130462	\N	\N	\N	\N	Pending
3	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Smartphone", "price": 699.99, "quantity": 1}]	765.99	2025-05-08 06:39:26.722705	\N	\N	\N	\N	Pending
4	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Laptop", "price": 999.99, "quantity": 1}]	1089.99	2025-05-08 06:53:07.831121	\N	\N	\N	\N	Pending
5	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Smartphone", "price": 699.99, "quantity": 1}]	765.99	2025-05-08 07:00:42.63232	\N	\N	\N	\N	Pending
6	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Smartphone", "price": 699.99, "quantity": 1}]	765.99	2025-05-08 07:55:11.060251	\N	\N	\N	\N	Pending
7	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Smartphone", "price": 699.99, "quantity": 1}]	765.99	2025-05-08 08:04:31.113566	\N	\N	\N	\N	Pending
8	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Laptop", "price": 999.99, "quantity": 1}]	1089.99	2025-05-08 08:53:05.427412	\N	\N	\N	\N	Pending
9	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Laptop", "price": 999.99, "quantity": 1}]	1089.99	2025-05-08 17:19:53.023791	\N	\N	\N	\N	Pending
10	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-13 20:39:46.942755	\N	\N	\N	\N	Pending
11	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-13 22:21:06.660646	\N	\N	\N	\N	Pending
12	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-13 22:29:22.216508	\N	\N	\N	\N	Pending
13	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-13 22:30:06.174564	\N	\N	\N	\N	Pending
14	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-13 22:37:54.65477	\N	\N	\N	\N	Pending
15	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-13 22:44:31.606956	\N	\N	\N	\N	Pending
16	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "fashion watch ", "price": 20, "quantity": 2}]	53.55	2025-05-14 02:59:44.574056	\N	\N	\N	\N	Pending
17	Md M Islam	diptonyc@gmail.com	3949 24TH ST, Long Island City, NY 11101	[{"name": "Smartphone", "price": 999.99, "quantity": 1}]	1098.74	2025-05-14 03:23:43.012622	\N	\N	\N	\N	Pending
\.


--
-- TOC entry 4935 (class 0 OID 16490)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, category, image_url, description, stock) FROM stdin;
3	Apple watch	299.99	Watch	images/products/bd2d92a43d2b4cba86bd53f2d1f3ded6.jpg	The Apple Watch is a wearable smartwatch with fitness tracking, health monitoring, and wireless communication capabilities. It integrates with watchOS and other Apple products and services. The Apple Watch can display information, play music, send messages, and make phone calls, all from the user's wrist. \nKey Features:\nFitness Tracking: Monitors activity levels, heart rate, and sleep.\nHealth Monitoring: Tracks various health metrics, including ECG and blood oxygen levels.\nWireless Communication: Makes calls, sends messages, and receives notifications.\niOS Integration: Seamlessly integrates with iPhone and other Apple devices. 	100
5	iPhone 16 Pro	999.99	Smart Phone	images/products/01b38260520945d9a44f89fbd4ea9e0b.jpg	The iPhone 16 Pro features a 6.3-inch Super Retina XDR display, a new A18 Pro chip, and a Pro camera system with upgraded wide and ultra-wide cameras, including a 48MP Ultra Wide camera with quad-pixel sensor. It also includes a 5x telephoto camera for 120mm zoom, and the ability to record 4K 120 fps Dolby Vision video, along with a new Apple Intelligence system. 	100
6	DJI Mavic Air	599.99	Drone	images/products/3c637bd2a3b64921b86700231b1f6930.jpg	DJI Mini 4K Drone Quadcopter Fly More Combo with Camera for Adults, Under 249g, 3-Axis Gimbal Stabilization, 10km Video Transmission, Auto Return, 3 Flight Batteries Bundle with Deco Gear Accessories	100
7	GSWP Minimalist Quartz Wristwatch	19.99	Watch	images/products/4dc00f0fa71e4ca79a60496f211764ee.jpg	Ultra-thin Design: This minimalist wristwatch boasts an ultra-thin profile, ensuring a sleek and sophisticated look that complements any attire. Crafted from high-quality materials, it combines comfort and durability, making it an ideal choice for everyday wear.\nCreative Dot Dial: The watch face features a unique and creative dot design, adding a touch of artistic flair to its minimalist aesthetic. The simple yet stylish dial exudes elegance and ensures clear visibility, allowing you to stay on top of time in style.\nQuartz Movement: Equipped with precise quartz movement, this wristwatch provides reliable and accurate timekeeping. You can trust it to keep you punctual throughout your busy day, ensuring you never miss a beat.\nVersatile Style: With its versatile design, this wristwatch effortlessly transitions from casual to formal settings. Its minimalist style and cool color options make it suitable for both men and women, making it a great choice for any occasion.\nIdeal Gifting Option: Presented in an exquisite gift box, this wristwatch makes for an ideal present for your loved ones. Its elegant design and thoughtful packaging make it a memorable and cherished gift for birthdays, anniversaries, or any special occasion.	100
8	MacBook Pro 	1499.99	Laptop	images/products/0fe40fbc847e43ecbc7f9a99564868f9.jpg	The MacBook Pro is a line of high-end Mac laptops designed for demanding users and professionals. It's known for its powerful performance, sleek design, and advanced features like the Liquid Retina XDR display and high-performance Apple silicon chips.	50
10	Garmin Fenix 8	1199.99	Watch	images/products/558c5e0a12384a32b64b89a40d39a68e.jpg	Garmin Fenix 8 - AMOLED\nDive into adventure with the Garmin fēnix® 8, a premium multisport smartwatch designed for athletes and explorers who love the water. This watch is packed with features to enhance your diving experience, making it the perfect companion for underwater activities.	20
11	Galaxy Watch7	299.99	Watch	images/products/6a807c105ce441e9842a5209b2d7c344.jpg	The new 3nm processor supercharges your daily routine. Quickly switch from checking the weather to tracking your workouts. Plus, it optimizes battery life for long-lasting power, ensuring the Galaxy Watch7 keeps up with you.	100
13	AOHI	119.99	Cell Phone Accessories	images/products/9dd8c5cddd654872960ffe296396f064.jpg	AOHI 240W Laptop Power Bank 27600mAh Portable Fast Charger (99.3wh) The Future Starship 140W PD 3.1 Large Camping Battery Pack for MacBook Pro/Air, iPad Pro, iPhone 16 Pro Max,Galaxy,Steam Deck, Grey	100
\.


--
-- TOC entry 4939 (class 0 OID 16512)
-- Dependencies: 226
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, product_id, user_name, comment, created_at) FROM stdin;
11	11	Alice	Excellent smartwatch! Worth the price	2025-05-15 06:13:47.658569
\.


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 223
-- Name: admin_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_logs_id_seq', 16, true);


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 219
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 4, true);


--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 217
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 17, true);


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 13, true);


--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 225
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 11, true);


--
-- TOC entry 4781 (class 2606 OID 16509)
-- Name: admin_logs admin_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_logs
    ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4775 (class 2606 OID 16486)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 16488)
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- TOC entry 4773 (class 2606 OID 16468)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16497)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4783 (class 2606 OID 16520)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 16521)
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


-- Completed on 2025-05-15 06:16:08

--
-- PostgreSQL database dump complete
--

