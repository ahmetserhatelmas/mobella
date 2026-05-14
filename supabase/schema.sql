-- Mobella Experience Travels — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- EXPERIENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR NOT NULL UNIQUE,
  slug VARCHAR NOT NULL UNIQUE,
  name_tr VARCHAR NOT NULL,
  name_en VARCHAR NOT NULL,
  tagline_tr TEXT,
  tagline_en TEXT,
  description_tr TEXT,
  description_en TEXT,
  duration_days INTEGER NOT NULL DEFAULT 1,
  duration_nights INTEGER NOT NULL DEFAULT 0,
  min_group_size INTEGER DEFAULT 1,
  max_group_size INTEGER,
  difficulty VARCHAR CHECK (difficulty IN ('easy', 'medium', 'hard')),
  season_tr VARCHAR,
  season_en VARCHAR,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  theme_color VARCHAR DEFAULT '#0A4D68',
  cover_image_url TEXT,
  gallery_urls TEXT[],
  included_tr TEXT[],
  included_en TEXT[],
  not_included_tr TEXT[],
  not_included_en TEXT[],
  program_tr JSONB,
  program_en JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- EXPERIENCE DATES
-- ============================================================
CREATE TABLE IF NOT EXISTS experience_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 12,
  booked_count INTEGER NOT NULL DEFAULT 0,
  price_per_person DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref VARCHAR UNIQUE NOT NULL,
  experience_date_id UUID NOT NULL REFERENCES experience_dates(id),
  experience_id UUID NOT NULL REFERENCES experiences(id),
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR NOT NULL,
  num_persons INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR NOT NULL,
  customer_initial VARCHAR,
  experience_id UUID REFERENCES experiences(id),
  experience_name_tr VARCHAR,
  experience_name_en VARCHAR,
  content_tr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- NEWSLETTER
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  kvkk_consent BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- FAQ
-- ============================================================
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id),  -- NULL = global
  question_tr TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_tr TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for experiences, dates, testimonials, faq
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (is_active = true);
CREATE POLICY "Public read dates" ON experience_dates FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);

-- Public insert for bookings, newsletter, contact
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Service role has full access (for admin panel)
CREATE POLICY "Service full access experiences" ON experiences USING (auth.role() = 'service_role');
CREATE POLICY "Service full access dates" ON experience_dates USING (auth.role() = 'service_role');
CREATE POLICY "Service full access bookings" ON bookings USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA — 4 Core Experiences
-- ============================================================

INSERT INTO experiences (code, slug, name_tr, name_en, tagline_tr, tagline_en, description_tr, description_en, duration_days, duration_nights, min_group_size, max_group_size, difficulty, season_tr, season_en, base_price, theme_color, cover_image_url, included_tr, included_en, not_included_tr, not_included_en, sort_order) VALUES

('MOB-CES-01', 'cesme-ruzgar-raket',
  'Çeşme Rüzgar & Raket', 'Çeşme Wind & Racket',
  'İki günde sörf, voleybol ve Alaçatı.', 'Two days of surfing, volleyball and Alaçatı.',
  'Çeşme''nin meltem rüzgarını ve sahil kültürünü birleştiren hafta sonu kaçışı. Cumartesi sabah rüzgar sörfü dersi, öğleden sonra plaj voleybolu turnuvası, gece Alaçatı sokakları. Pazar serbest pratik ve dönüş.',
  'A weekend escape combining Çeşme''s Meltemi wind and beach culture. Saturday morning windsurfing lesson, afternoon beach volleyball tournament, evening in Alaçatı. Sunday free practice and return.',
  2, 1, 6, 12, 'easy', 'Mayıs–Ekim', 'May–October',
  4500, '#0EA5E9',
  'https://images.unsplash.com/photo-1530991472021-5e9989ab0e87?w=1200&q=80',
  ARRAY['İzmir–Çeşme gidiş-dönüş ulaşım', '1 gece butik otel (3★)', '4 öğün yemek', 'Sörf eğitimi ve tüm ekipman', 'Voleybol kliniği ve antrenör', 'Sigorta', 'Mobella temsilci eşlik'],
  ARRAY['İzmir–Çeşme round-trip transport', '1 night boutique hotel (3★)', '4 meals', 'Surf instruction and all equipment', 'Volleyball clinic and coach', 'Insurance', 'Mobella representative'],
  ARRAY['Cumartesi akşam yemeği', 'Kişisel harcamalar', 'Alkollü içecekler'],
  ARRAY['Saturday dinner', 'Personal expenses', 'Alcoholic beverages'],
  1),

('MOB-NAT-02A', 'izmir-doga',
  'İzmir Yakını: Bozdağ & Karagöl', 'Izmir Nature: Bozdağ & Karagöl',
  'Kentin gürültüsünden çıkıp 1 günde doğanın içinde.', 'One day out of the city noise, deep in nature.',
  'İzmir çıkışlı, Bozdağ ve Karagöl''ü içeren günübirlik doğa rotası. Hafif yürüyüş, göl kenarında kahvaltı, doğa fotoğrafçılığı ve yerel pazarda alışveriş.',
  'A day trip from İzmir covering Bozdağ and Karagöl. Light trekking, breakfast by the lake, nature photography and local market.',
  1, 0, 4, 10, 'easy', 'Mart–Kasım', 'March–November',
  2000, '#16A34A',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
  ARRAY['Ulaşım', 'Kahvaltı ve öğle yemeği', 'Doğa rehberi'],
  ARRAY['Transport', 'Breakfast and lunch', 'Nature guide'],
  ARRAY['Kişisel harcamalar'],
  ARRAY['Personal expenses'],
  3),

('MOB-LYC-03A', 'hafta-sonu-likyasi',
  'Hafta Sonu Likyası', 'Lycian Weekend',
  'Likya''nın en spektaküler hattında 3 günlük başlangıç paketi.', '3-day starter pack on Lycia''s most spectacular stretch.',
  'Kayaköy''den Kelebekler Vadisi''ne uzanan, Likya Yolu''nun incisi. Şehirli profesyoneller için tasarlanmış, bagaj transferli, sertifikalı rehberli 3 gün.',
  'From Kayaköy to Butterfly Valley — the jewel of the Lycian Way. Designed for urban professionals: 3 days with luggage transfer and certified guide.',
  3, 2, 6, 10, 'medium', 'Mart–Mayıs, Eyl–Kas', 'Mar–May, Sep–Nov',
  8500, '#0A4D68',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  ARRAY['İzmir–Fethiye gidiş-dönüş', '2 gece pansiyon', '6 öğün yemek', 'Sertifikalı dağ rehberi', 'Bagaj transferi', 'Sigorta', 'GPS rota kartı', 'Butterfly Valley tekne'],
  ARRAY['İzmir–Fethiye round-trip', '2 nights guesthouse', '6 meals', 'Certified mountain guide', 'Luggage transfer', 'Insurance', 'GPS route card', 'Butterfly Valley boat'],
  ARRAY['Cuma akşam yemeği', 'Kişisel harcamalar', 'Alkollü içecekler'],
  ARRAY['Friday dinner', 'Personal expenses', 'Alcoholic beverages'],
  2),

('MOB-BLU-04', 'mavi-yesil-tekne',
  'Mavi-Yeşil Tekne Turları', 'Blue-Green Boat Tours',
  'Az bilinen koylar, açık büfe deniz sofrası, gün batımı silueti.', 'Hidden coves, open-buffet seafood, sunset silhouette.',
  'Standart tekne turlarından kalabalık koylardan kaçınarak ayrışan günübirlik veya 2 günlük tekne deneyimi. Yoga, SUP, snorkeling ve gurme öğle yemeği bir arada.',
  'A 1 or 2-day boat experience that stands apart by avoiding crowded bays. Yoga, SUP, snorkeling and a gourmet lunch — all in one.',
  1, 0, 8, 12, 'easy', 'Mayıs–Ekim', 'May–October',
  2500, '#1E3A5F',
  'https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=1200&q=80',
  ARRAY['Profesyonel kaptan ve mürettebat', 'Açık büfe öğle yemeği', 'Çay-kahve-su sınırsız', 'Snorkeling ekipmanı', 'SUP (1 saat ücretsiz)', 'Sigorta'],
  ARRAY['Professional captain and crew', 'Open-buffet lunch', 'Unlimited tea, coffee, water', 'Snorkeling equipment', 'SUP (1 hour free)', 'Insurance'],
  ARRAY['Alkollü içecekler', 'Marina otopark', 'Kişisel harcamalar'],
  ARRAY['Alcoholic beverages', 'Marina parking', 'Personal expenses'],
  4);

-- ============================================================
-- SEED — Experience Dates (sample future dates)
-- ============================================================

INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-07', '2026-06-08', 12, 4500, true FROM experiences WHERE code = 'MOB-CES-01';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-21', '2026-06-22', 12, 4500, true FROM experiences WHERE code = 'MOB-CES-01';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-05', '2026-07-06', 12, 5000, true FROM experiences WHERE code = 'MOB-CES-01';

INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-14', '2026-06-14', 10, 2000, true FROM experiences WHERE code = 'MOB-NAT-02A';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-12', '2026-07-12', 10, 2000, true FROM experiences WHERE code = 'MOB-NAT-02A';

INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-09-18', '2026-09-20', 10, 8500, true FROM experiences WHERE code = 'MOB-LYC-03A';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-10-02', '2026-10-04', 10, 8500, true FROM experiences WHERE code = 'MOB-LYC-03A';

INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-06', '2026-06-06', 12, 2500, true FROM experiences WHERE code = 'MOB-BLU-04';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-20', '2026-06-20', 12, 2500, true FROM experiences WHERE code = 'MOB-BLU-04';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-04', '2026-07-05', 12, 6500, true FROM experiences WHERE code = 'MOB-BLU-04';

-- ============================================================
-- SEED — Testimonials
-- ============================================================

INSERT INTO testimonials (customer_name, customer_initial, experience_name_tr, experience_name_en, content_tr, content_en, rating, is_active)
VALUES
('Selin A.', 'A', 'Çeşme Rüzgar & Raket', 'Çeşme Wind & Racket',
 'Sörf hayatımda ilk kez denedim ve Mobella''nın eğitmeni inanılmaz sabırlıydı. Voleybol turnuvası da beklenmedik kadar eğlenceliydi. Kesinlikle tekrar geleceğim.',
 'I tried surfing for the first time and Mobella''s instructor was incredibly patient. The volleyball tournament was unexpectedly fun. Definitely coming back.',
 5, true),

('Emre K.', 'K', 'Hafta Sonu Likyası', 'Lycian Weekend',
 'Kayaköy''den Kabak''a yürüyüş hayatımda yaptığım en etkileyici şeylerden biriydi. Rehber yerel bilgisiyle rotayı bambaşka kıldı. Bagaj transferi olmadan bu turu hayal bile edemezdim.',
 'The walk from Kayaköy to Kabak was one of the most impressive things I''ve ever done. The guide made the route unique with local knowledge. I can''t imagine this tour without luggage transfer.',
 5, true),

('Ayşe T.', 'T', 'Mavi-Yeşil Tekne Turları', 'Blue-Green Boat Tours',
 'Öğle yemeği inanılmazdı — taze balık ve Ege otları. Kalabalık bir tur olmadığı için hep koy başına erken vardık. Yoga seansı sabahı mükemmel başlattı.',
 'Lunch was incredible — fresh fish and Aegean herbs. Since it wasn''t a crowded tour, we always arrived at each cove early. The yoga session started the morning perfectly.',
 5, true);

-- ============================================================
-- SEED — FAQ (Global)
-- ============================================================

INSERT INTO faq (experience_id, question_tr, question_en, answer_tr, answer_en, sort_order) VALUES
(NULL, 'Fiziksel kondisyon şart mı?', 'Is physical fitness required?',
 'Her ürünün zorluk seviyesi ve fiziksel gereksinimleri ürün sayfasında açıkça belirtilmiştir. Kolay seviyedeki turlar için özel bir kondisyon gerekmez.',
 'Physical requirements are clearly stated on each product page. Easy-level tours require no special fitness.',
 1),
(NULL, 'Rezervasyon nasıl yapılır?', 'How do I make a reservation?',
 'İstediğiniz deneyimin sayfasındaki "Rezerve Et" butonuna tıklayarak formu doldurun. Ekibimiz 24 saat içinde sizi arayarak rezervasyonu onaylayacaktır.',
 'Fill in the form via the "Book Now" button on the experience page. Our team will call you within 24 hours to confirm.',
 2),
(NULL, 'İptal politikası nedir?', 'What is the cancellation policy?',
 'Tura 7 günden fazla kala yapılan iptallerde tam iade yapılır. 3–7 gün arası %50 iade, 3 günden az kala iade yapılmaz.',
 'Full refund for cancellations more than 7 days before the tour. 50% refund between 3–7 days. No refund under 3 days.',
 3),
(NULL, 'Sigortam var mı?', 'Am I insured?',
 'Tüm Mobella turlarına faaliyete özel kaza ve sorumluluk sigortası dahildir.',
 'All Mobella tours include activity-specific accident and liability insurance.',
 4),
(NULL, 'Grup büyüklüğü neden önemli?', 'Why does group size matter?',
 'Maksimum 12 kişilik gruplarımız sayesinde rehber her katılımcıya yeterli ilgi gösterir, konaklama ve restoranlar kalabalık olmaz, doğa alanlarına etki minimuma iner.',
 'With a maximum of 12 participants, the guide can give adequate attention to each person, accommodations and restaurants stay uncrowded, and the impact on natural areas is minimised.',
 5);
