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
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- Users can view their own bookings
CREATE POLICY "Users read own bookings" ON bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

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
-- SEED — 9 New Products (v2.0)
-- ============================================================

INSERT INTO experiences (
  code, slug, name_tr, name_en, tagline_tr, tagline_en,
  description_tr, description_en,
  duration_days, duration_nights, min_group_size, max_group_size,
  difficulty, season_tr, season_en, base_price, theme_color,
  cover_image_url, included_tr, included_en, not_included_tr, not_included_en,
  program_tr, program_en, is_active, sort_order
) VALUES
('MOB-NAT-02B','mugla-doga','Muğla Doğası: Akyaka & Datça','Muğla Nature: Akyaka & Datça','Azmak''ta kano, Datça''da bademlik ve gün batımı — 2 günde Ege''nin özü.','Canoeing on the Azmak, almond groves in Datça and sunset — the essence of the Aegean in 2 days.','Akyaka''nın Azmak Nehri''nde kano, Sakar Geçidi''nde doğa yürüyüşü ve Datça''nın sessiz bademlik bahçeleri.','Canoeing on the Azmak River, a nature walk at Sakar Pass, and the quiet almond groves of Datça.',2,1,4,10,'easy','Mart–Kasım','March–November',5500,'#16A34A','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',ARRAY['İzmir–Akyaka–Datça gidiş-dönüş ulaşım','1 gece butik konaklama','3 öğün yemek','Kano kiralama (1.5 saat)','Doğa rehberi','Sigorta'],ARRAY['İzmir–Akyaka–Datça return transport','1 night boutique accommodation','3 meals','Canoe rental (1.5 hrs)','Nature guide','Insurance'],ARRAY['Öğle/akşam yemeklerinin bir kısmı','Kişisel harcamalar','Alkollü içecekler'],ARRAY['Some meals','Personal expenses','Alcoholic beverages'],'[{"day":"Gün 1 — Cumartesi","items":["09:00 İzmir''den hareket","11:30 Akyaka varış, Azmak Nehri kano (1.5 saat)","13:30 Sahil kenarında öğle yemeği (dahil)","15:00 Sakar Geçidi doğa yürüyüşü","18:30 Datça''ya varış, konaklama"]},{"day":"Gün 2 — Pazar","items":["09:00 Kahvaltı (dahil)","10:00 Datça bademlik turu","12:00 Körfezde serbest yüzme","13:30 Öğle yemeği (dahil)","15:00 Gün batımı noktası","16:30 İzmir''e dönüş"]}]'::jsonb,'[{"day":"Day 1","items":["09:00 Depart İzmir","11:30 Akyaka, Azmak River canoe (1.5 hrs)","13:30 Lunch (included)","15:00 Sakar Pass walk","18:30 Datça, accommodation"]},{"day":"Day 2","items":["09:00 Breakfast","10:00 Almond grove tour","12:00 Free swim","13:30 Lunch (included)","16:30 Return to İzmir"]}]'::jsonb,true,5),

('MOB-NAT-02C','antalya-doga','Antalya Yaylaları: Köprülü Kanyon & Termessos','Antalya Highlands: Köprülü Canyon & Termessos','Kanyon''da rafting, antik kentte yürüyüş, yaylada doğa — 3 günde Antalya''nın vahşi yüzü.','Rafting in the canyon, hiking in an ancient city, nature on the highlands — the wild face of Antalya in 3 days.','Türkiye''nin en güzel rafting rotalarından Köprülü Kanyon, Termessos antik kenti ve Düzlerçamı''nın serin yaylalarında doğa yürüyüşü.','Köprülü Canyon, the ancient city of Termessos and a nature hike in the cool highlands of Düzlerçamı.',3,2,4,10,'medium','Mart–Kasım','March–November',9000,'#7C3AED','https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=80',ARRAY['İzmir–Antalya gidiş-dönüş ulaşım','2 gece konaklama','6 öğün yemek','Rafting ekipmanı','Termessos müze girişi','Dağ rehberi','Sigorta'],ARRAY['İzmir–Antalya return transport','2 nights accommodation','6 meals','Rafting equipment','Termessos museum entry','Mountain guide','Insurance'],ARRAY['Kişisel harcamalar','Alkollü içecekler','Ekstra aktiviteler'],ARRAY['Personal expenses','Alcoholic beverages','Extra activities'],'[{"day":"Gün 1","items":["07:00 İzmir''den hareket","12:00 Köprülü Kanyon rafting (3–4 saat)","18:00 Konaklama"]},{"day":"Gün 2","items":["09:30 Termessos antik kenti (5 km yürüyüş)","15:00 Düzlerçamı doğa parkı","18:30 Konaklama"]},{"day":"Gün 3","items":["09:00 Serbest gezi","13:30 İzmir''e dönüş"]}]'::jsonb,'[{"day":"Day 1","items":["07:00 Depart İzmir","12:00 Köprülü Canyon rafting (3–4 hrs)","18:00 Accommodation"]},{"day":"Day 2","items":["09:30 Termessos ancient city (5 km walk)","15:00 Düzlerçamı nature park","18:30 Accommodation"]},{"day":"Day 3","items":["09:00 Free time","13:30 Return to İzmir"]}]'::jsonb,true,6),

('MOB-LYC-03B','buyuk-likya','Büyük Likya Turu','Grand Lycia Tour','Fethiye''den Kaş''a 6 gün, 6 farklı manzara, 2000 yıllık patika.','From Fethiye to Kaş: 6 days, 6 different landscapes, a 2000-year-old trail.','Batı Likya''nın "best of" rotası. Bagaj transferi sayesinde sadece günlük çantayla yürütülen bu turda UNESCO''nun Letoon''u, Patara plajı ve Kekova batık şehri sizi bekliyor.','Western Lycia''s best-of route. With luggage transfer you walk with just a daypack. UNESCO''s Letoon, Patara beach and the sunken city of Kekova await.',6,5,6,10,'hard','Mart–Mayıs, Eyl–Kas','Mar–May, Sep–Nov',22000,'#0A4D68','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',ARRAY['İzmir–Fethiye otobüs','5 gece konaklama (karma)','14 öğün yemek','Sertifikalı TR/EN rehber','Günlük bagaj transferi','Sigorta','Letoon + Patara girişleri','Kekova tekne turu','Antalya–İzmir uçak','Mobella sırt çantası + şapka + Likya patch'],ARRAY['İzmir–Fethiye coach','5 nights accommodation','14 meals','Certified TR/EN guide','Daily luggage transfer','Insurance','Letoon + Patara entries','Kekova boat trip','Antalya–İzmir flight','Mobella backpack + hat + Lycia patch'],ARRAY['Ek yemekler','Alkollü içecekler (Kaş akşam hariç)','Bahşişler','Kişisel harcamalar'],ARRAY['Extra meals','Alcoholic drinks (except Kaş dinner)','Tips','Personal expenses'],'[{"day":"Gün 1 — Kayaköy","items":["06:30 İzmir''den hareket","13:00 Kayaköy antik köy turu (5 km ısınma)","17:00 Ölüdeniz konaklama, brifing"]},{"day":"Gün 2 — Ölüdeniz→Kabak 16km","items":["09:00 Uçurum üstü kıyı patikası","17:00 Kabak Koyu, eko-pansiyon"]},{"day":"Gün 3 — Kabak→Sidyma 15km","items":["Dağ köyleri ve antik kalıntılar","Köy evi konaklama"]},{"day":"Gün 4 — Sidyma→Patara 14km","items":["Letoon UNESCO","Patara antik kenti ve 18km plaj"]},{"day":"Gün 5 — Patara→Kaş 12km","items":["Kalkan kıyı yürüyüşü","Kaş marina akşam yemeği"]},{"day":"Gün 6 — Kekova Finali","items":["Kekova batık şehir tekne turu","Kapanış seremonisi","Antalya→İzmir uçuş"]}]'::jsonb,'[{"day":"Day 1","items":["Kayaköy walk (5km warm-up)","Ölüdeniz guesthouse"]},{"day":"Day 2","items":["Ölüdeniz→Kabak 16km clifftop trail"]},{"day":"Day 3","items":["Kabak→Sidyma 15km, village house"]},{"day":"Day 4","items":["Letoon UNESCO, Patara 14km, beach"]},{"day":"Day 5","items":["Patara→Kaş 12km, marina dinner"]},{"day":"Day 6","items":["Kekova sunken city boat tour","Antalya→İzmir flight"]}]'::jsonb,true,7),

('MOB-URL-05','urla-gurme','Urla Gurme Rotası','Urla Gourmet Route','Bağ yolu, zeytinyağı atölyesi ve üretici sofrası — İzmir''in 40 dakika batısında farm-to-table bir gün.','Vineyard trail, olive oil workshop and a producer''s table — a farm-to-table day 40 minutes west of İzmir.','Urla''nın organik bağ yollarında butik şarap tadımı, zeytinyağı üretim atölyesi ve mevsim sebzeleriyle hazırlanmış uzun bir üretici öğle yemeği.','Boutique wine tasting on Urla''s organic vineyard trails, an olive oil production workshop, and a long producer''s lunch.',1,0,6,12,'easy','Mart–Kasım','March–November',2200,'#7C3AED','https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80',ARRAY['İzmir–Urla gidiş-dönüş ulaşım','Tüm tadımlar (şarap + zeytinyağı)','Üretici sofrasında öğle yemeği','Gurme rehberi','Sigorta'],ARRAY['İzmir–Urla return transport','All tastings (wine + olive oil)','Producer''s lunch','Gourmet guide','Insurance'],ARRAY['Ekstra şarap şişeleri','Kişisel alışveriş','Yemek atölyesi (opsiyonel ek)'],ARRAY['Extra wine bottles','Personal shopping','Cooking workshop (optional)'],'[{"day":"Günübirlik Program","items":["09:00 İzmir''den hareket","10:00 Bağ turu + şarap tadımı","11:30 Zeytinyağı atölyesi","13:00 Üretici sofrasında uzun öğle (dahil)","15:00 Urla Sanat Sokağı","18:00 İzmir''e dönüş"]}]'::jsonb,'[{"day":"Day-Trip Programme","items":["09:00 Depart İzmir","10:00 Vineyard tour + wine tasting","11:30 Olive oil workshop","13:00 Producer''s lunch (included)","15:00 Urla Arts Street","18:00 Return to İzmir"]}]'::jsonb,true,8),

('MOB-WND-06','alacati-ruzgar-kampi','Alaçatı Rüzgar Kampı','Alaçatı Wind Camp','Dünyanın en iyi sörf koylarından birinde VDWS sertifikalı 3 veya 6 günlük yoğunlaştırılmış rüzgar sörfü kampı.','VDWS-certified intensive windsurf camp — 3 or 6 days — in one of the world''s best windsurfing bays.','Alaçatı koyu sığ ve düz suyuyla dünyaca bilinen bir rüzgar sörfü merkezi. VDWS uyumlu kademeli ders programı, teori, su saati ve video analiz. 3 günde temel, 6 günde sertifika.','Alaçatı bay is a world-renowned windsurf hub. VDWS-compliant progressive lessons, theory, water time and video analysis. Basics in 3 days, certification in 6.',3,2,6,12,'easy','Mayıs–Ekim','May–October',9500,'#0EA5E9','https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',ARRAY['VDWS sertifikalı eğitim','Tüm ekipman (board, yelken, wetsuit)','2 gece konaklama','Kahvaltı','Sigorta','Katılım/seviye sertifikası'],ARRAY['VDWS-certified instruction','All equipment (board, rig, wetsuit)','2 nights accommodation','Breakfast','Insurance','Participation/level certificate'],ARRAY['Öğle/akşam yemekleri','Ekipman hasar depozitosu','Kişisel harcamalar'],ARRAY['Lunch/dinner','Equipment damage deposit','Personal expenses'],'[{"day":"Her Gün (3 Günlük Format)","items":["08:00 Kahvaltı","09:00 Sabah teori dersi","10:00 İlk su seansı (2 saat)","12:30 Öğle arası","14:00 İkinci su seansı (serbest pratik)","16:30 Video analizi","Akşam Alaçatı sokaklarında serbest"]}]'::jsonb,'[{"day":"Each Day (3-Day Format)","items":["08:00 Breakfast","09:00 Morning theory","10:00 First water session (2 hrs)","12:30 Lunch break","14:00 Second session (free practice)","16:30 Video analysis","Evening free in Alaçatı"]}]'::jsonb,true,9),

('MOB-VOL-07','alanya-voleybol','Alanya Plaj Voleybolu Kampı','Alanya Beach Volleyball Camp','Akdeniz''in geniş kumsallarında antrenörlü teknik kamp ve final turnuvası.','Technical camp with coaches on the Mediterranean''s wide beaches and a final tournament.','Alanya''nın uzun Akdeniz kumsallarında yapılandırılmış plaj voleybolu kampı. Her seviyeye uygun antrenör eşliğinde teknik çalışma, taktik drilller ve final turnuvası.','A structured beach volleyball camp on Alanya''s long Mediterranean beaches — technical work with coaches, tactical drills and a final tournament.',4,3,8,16,'easy','Mayıs–Ekim','May–October',12000,'#F59E0B','https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&q=80',ARRAY['Antrenör kadrosu','Kort/saha kullanımı','3 gece konaklama','Kahvaltı','Turnuva organizasyonu','Sigorta'],ARRAY['Coaching team','Court usage','3 nights accommodation','Breakfast','Tournament organisation','Insurance'],ARRAY['Ulaşım (opsiyonel ek)','Öğle/akşam yemekleri','Alkollü içecekler','Kişisel harcamalar'],ARRAY['Transport (optional)','Lunch/dinner','Alcoholic beverages','Personal expenses'],'[{"day":"Gün 1","items":["Varış, tanışma antrenmanı, seviye belirleme"]},{"day":"Gün 2","items":["Servis, pas, manchet teknik çalışma","İkili oyun"]},{"day":"Gün 3","items":["Blok, savunma, rotasyon","Mini turnuva 1. tur"]},{"day":"Gün 4","items":["Final turnuvası","Ödül töreni","Dönüş"]}]'::jsonb,'[{"day":"Day 1","items":["Arrival, intro training, level assessment"]},{"day":"Day 2","items":["Serve, set, dig technical work","Doubles play"]},{"day":"Day 3","items":["Block, defence, rotation","Tournament round 1"]},{"day":"Day 4","items":["Final tournament","Award ceremony","Departure"]}]'::jsonb,true,10),

('MOB-ADV-08','fethiye-babadag','Fethiye & Babadağ Macera','Fethiye & Babadağ Adventure','1700 metre yükseklikten Ölüdeniz lagününe iniş — tandem paraşütle dünyanın en iyi kalkış noktalarından biri.','A descent from 1,700 metres directly onto Ölüdeniz lagoon — one of the world''s best tandem paragliding sites.','Fethiye''nin doğal güzellikleri, Kayaköy''ün tarihi ve Babadağ''dan tandem yamacı paraşüt atışı bir arada. Üç günde adrenalin ve huzur.','The natural beauty of Fethiye, the history of Kayaköy, and a tandem paragliding flight from Babadağ — three days of adrenaline and serenity.',3,2,6,10,'medium','Nisan–Ekim','April–October',14000,'#0EA5E9','https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80',ARRAY['Ulaşım','2 gece konaklama','Sertifikalı tandem paraşüt uçuşu','Doğa rehberi','Sigorta','2 kahvaltı ve seçili yemekler'],ARRAY['Transport','2 nights accommodation','Certified tandem paragliding flight','Nature guide','Insurance','2 breakfasts and selected meals'],ARRAY['Uçuş foto/video paketi','Ek uçuşlar','Bazı yemekler','Kişisel harcamalar'],ARRAY['Flight photo/video package','Extra flights','Some meals','Personal expenses'],'[{"day":"Gün 1","items":["Fethiye varış","Kayaköy antik köy turu","Ölüdeniz''de hafif doğa yürüyüşü","Konaklama ve akşam yemeği"]},{"day":"Gün 2","items":["Babadağ''a çıkış (1970m)","Tandem paraşüt uçuşu — Ölüdeniz iniş","Ölüdeniz lagünü ve mavi lagün yüzmesi","Fethiye marina"]},{"day":"Gün 3","items":["Kelebekler Vadisi tekne turu ve yüzme (2 saat)","Öğle yemeği","İzmir''e dönüş"]}]'::jsonb,'[{"day":"Day 1","items":["Arrive Fethiye","Kayaköy abandoned village tour","Light walk around Ölüdeniz","Accommodation, dinner"]},{"day":"Day 2","items":["Ascent to Babadağ (1970m)","Tandem paragliding — landing on Ölüdeniz beach","Lagoon and blue lagoon swimming","Fethiye marina"]},{"day":"Day 3","items":["Butterfly Valley boat trip & swim (2 hrs)","Lunch","Return to İzmir"]}]'::jsonb,true,11),

('MOB-CAP-09','kapadokya-ozel','Kapadokya Ekim Özel','Cappadocia October Special','Peribacaları, yeraltı şehirleri ve vadi mağarasında açık hava elektronik müzik gecesi — yılda bir, sadece Ekim.','Fairy chimneys, underground cities and an open-air electronic music night in a valley cave — once a year, October only.','Kapadokya''nın yeraltı şehirleri, peribacaları ve vadi yürüyüşlerini açık hava elektronik müzik gecesiyle taçlandıran yılda bir düzenlenen imza etkinliği.','An annual signature event combining Cappadocia''s underground cities, fairy chimneys and valley walks with an open-air electronic music night.',3,2,10,20,'easy','Sadece Ekim','October Only',11500,'#8B5CF6','https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1200&q=80',ARRAY['Ulaşım','2 gece mağara otel','Rehberli bölge turları','Etkinlik girişi (açık hava gece)','Sigorta'],ARRAY['Transport','2 nights cave hotel','Guided regional tours','Event entrance (open-air night)','Insurance'],ARRAY['Balon turu (opsiyonel ek)','İçecekler','Yemeklerin bir kısmı','Kişisel harcamalar'],ARRAY['Balloon tour (optional)','Drinks','Some meals','Personal expenses'],'[{"day":"Gün 1","items":["Kapadokya varış","Göreme Açık Hava Müzesi","Peribacaları gün batımı noktası","Mağara otel"]},{"day":"Gün 2","items":["Derinkuyu/Kaymaklı yeraltı şehri turu","Vadi yürüyüşü","Akşam açık hava elektronik müzik gecesi (dahil)"]},{"day":"Gün 3","items":["İsteğe bağlı sıcak hava balonu","Sabah vadisi yürüyüşü","Yerel kahvaltı","Dönüş"]}]'::jsonb,'[{"day":"Day 1","items":["Arrive Cappadocia","Göreme Open-Air Museum","Fairy chimneys sunset viewpoint","Cave hotel"]},{"day":"Day 2","items":["Underground city tour","Valley walk","Open-air electronic music night (included)"]},{"day":"Day 3","items":["Optional hot-air balloon","Morning valley walk","Local breakfast","Return"]}]'::jsonb,true,12),

('MOB-KAS-10','kas-deniz','Kaş Deniz & Derinlik','Kaş Sea & Depth','Kekova batık şehri üzerinde deniz kanoğu, ardından Akdeniz''in berrak sularında ilk dalış.','Sea kayaking over the sunken city of Kekova, then your first dive in the crystal-clear Mediterranean.','Kaş, Akdeniz''in en iyi dalış noktalarından biri. Üçağız''dan Kekova batık şehri üzerinde rehberli deniz kanoğu ve eğitmenli tanıtım dalışı.','Kaş is one of the Mediterranean''s finest diving spots. Guided sea kayak over the sunken city of Kekova from Üçağız, then an instructor-led introductory dive.',2,1,6,10,'easy','Mayıs–Ekim','May–October',7500,'#0369A1','https://images.unsplash.com/photo-1517699418036-fb5d179fef0c?w=1200&q=80',ARRAY['Kano + rehber (Kekova)','Eğitmenli tanıtım dalışı','1 gece konaklama','Kahvaltı','Sigorta'],ARRAY['Kayak + guide (Kekova)','Instructor-led introductory dive','1 night accommodation','Breakfast','Insurance'],ARRAY['İleri dalış kursu','Bazı yemekler','Kişisel harcamalar','Foto/video paketi'],ARRAY['Advanced dive course','Some meals','Personal expenses','Photo/video package'],'[{"day":"Gün 1 — Kekova","items":["Kaş varış","Üçağız''dan Kekova batık şehri üzerinde deniz kanoğu (3 saat)","Simena kalesi ziyareti","Akşam Kaş marina"]},{"day":"Gün 2 — Dalış","items":["Kahvaltı","Eğitmenli tanıtım dalışı (try-dive, 1.5–2 saat)","Kaş merkezi serbest gezi","Öğle yemeği","İzmir''e dönüş"]}]'::jsonb,'[{"day":"Day 1 — Kekova","items":["Arrive Kaş","Sea kayak over Kekova sunken city (3 hrs)","Simena castle visit","Evening at Kaş marina"]},{"day":"Day 2 — Diving","items":["Breakfast","Intro dive (try-dive, 1.5–2 hrs, no experience needed)","Free time in Kaş","Lunch","Return to İzmir"]}]'::jsonb,true,13);

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
