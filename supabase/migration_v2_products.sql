-- ============================================================
-- Mobella v2.0 — Yeni Ürünler Migration
-- Supabase SQL Editor'da çalıştır
-- ============================================================

INSERT INTO experiences (
  code, slug, name_tr, name_en, tagline_tr, tagline_en,
  description_tr, description_en,
  duration_days, duration_nights, min_group_size, max_group_size,
  difficulty, season_tr, season_en, base_price, theme_color,
  cover_image_url,
  included_tr, included_en, not_included_tr, not_included_en,
  program_tr, program_en,
  is_active, sort_order
) VALUES

-- ============================================================
-- MOB-NAT-02B: Muğla Doğası
-- ============================================================
('MOB-NAT-02B', 'mugla-doga',
  'Muğla Doğası: Akyaka & Datça', 'Muğla Nature: Akyaka & Datça',
  'Azmak''ta kano, Datça''da bademlik ve gün batımı — 2 günde Ege''nin özü.', 'Canoeing on the Azmak, almond groves in Datça and sunset — the essence of the Aegean in 2 days.',
  'Akyaka''nın eşsiz Azmak Nehri''nde kano, Sakar Geçidi''nde doğa yürüyüşü ve Datça''nın sessiz bademlik bahçeleri. İzmir''den kolayca ulaşılabilen, bozulmamış Ege doğasının içinde 2 günlük bir kaçış.',
  'Canoeing on Akyaka''s unique Azmak River, a nature walk at the Sakar Pass, and the quiet almond groves of Datça. A 2-day escape into untouched Aegean nature, easily reached from İzmir.',
  2, 1, 4, 10, 'easy', 'Mart–Kasım', 'March–November',
  5500, '#16A34A',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  ARRAY['İzmir–Akyaka–Datça gidiş-dönüş ulaşım', '1 gece butik konaklama', '3 öğün yemek', 'Kano kiralama (1.5 saat)', 'Doğa rehberi', 'Sigorta'],
  ARRAY['İzmir–Akyaka–Datça return transport', '1 night boutique accommodation', '3 meals', 'Canoe rental (1.5 hrs)', 'Nature guide', 'Insurance'],
  ARRAY['Öğle/akşam yemeklerinin bir kısmı', 'Kişisel harcamalar', 'Alkollü içecekler'],
  ARRAY['Some lunches/dinners', 'Personal expenses', 'Alcoholic beverages'],
  '[
    {"day": "Gün 1 — Cumartesi", "items": ["09:00 İzmir''den hareket", "11:30 Akyaka varış, Azmak Nehri kano (1.5 saat)", "13:30 Sahil kenarında öğle yemeği (dahil)", "15:00 Sakar Geçidi doğa yürüyüşü", "18:30 Datça''ya varış, konaklama", "20:00 Yerel restoranda akşam yemeği (dahil değil)"]},
    {"day": "Gün 2 — Pazar", "items": ["09:00 Kahvaltı (dahil)", "10:00 Datça bademlik turu ve yerel üreticiler", "12:00 Datça körfezinde serbest zaman ve yüzme", "13:30 Öğle yemeği (dahil)", "15:00 Gün batımı noktası", "16:30 İzmir''e dönüş", "20:30 İzmir varış"]}
  ]'::jsonb,
  '[
    {"day": "Day 1 — Saturday", "items": ["09:00 Depart from İzmir", "11:30 Arrive in Akyaka, canoeing on Azmak River (1.5 hrs)", "13:30 Lunch by the riverside (included)", "15:00 Nature walk at Sakar Pass", "18:30 Arrive in Datça, accommodation", "20:00 Dinner at a local restaurant (not included)"]},
    {"day": "Day 2 — Sunday", "items": ["09:00 Breakfast (included)", "10:00 Datça almond grove tour and local producers", "12:00 Free time and swimming in Datça bay", "13:30 Lunch (included)", "15:00 Sunset viewpoint", "16:30 Return to İzmir", "20:30 Arrive in İzmir"]}
  ]'::jsonb,
  true, 5),

-- ============================================================
-- MOB-NAT-02C: Antalya Yaylaları
-- ============================================================
('MOB-NAT-02C', 'antalya-doga',
  'Antalya Yaylaları: Köprülü Kanyon & Termessos', 'Antalya Highlands: Köprülü Canyon & Termessos',
  'Kanyon''da rafting, antik kentte yürüyüş, yaylada doğa — 3 günde Antalya''nın vahşi yüzü.', 'Rafting in the canyon, hiking in an ancient city, nature on the highlands — the wild face of Antalya in 3 days.',
  'Türkiye''nin en güzel raftng rotalarından Köprülü Kanyon, UNESCO listesine aday Termessos antik kenti ve Düzlerçamı''nın serin yaylalarında doğa yürüyüşü. Üç günde üç farklı Antalya.',
  'Köprülü Canyon, one of Turkey''s finest rafting routes, the ancient city of Termessos and a nature hike in the cool highlands of Düzlerçamı. Three different faces of Antalya in three days.',
  3, 2, 4, 10, 'medium', 'Mart–Kasım', 'March–November',
  9000, '#7C3AED',
  'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=80',
  ARRAY['İzmir–Antalya gidiş-dönüş ulaşım', '2 gece konaklama', '6 öğün yemek', 'Rafting ekipmanı', 'Termessos müze girişi', 'Dağ rehberi', 'Sigorta'],
  ARRAY['İzmir–Antalya return transport', '2 nights accommodation', '6 meals', 'Rafting equipment', 'Termessos museum entry', 'Mountain guide', 'Insurance'],
  ARRAY['Kişisel harcamalar', 'Alkollü içecekler', 'Ekstra aktiviteler'],
  ARRAY['Personal expenses', 'Alcoholic beverages', 'Extra activities'],
  '[
    {"day": "Gün 1", "items": ["07:00 İzmir''den hareket", "11:30 Köprülü Kanyon varış, ekipman giyme", "12:30 Öğle yemeği (dahil)", "14:00 Rafting (3–4 saat, orta seviye)", "18:00 Konaklama", "20:00 Akşam yemeği (dahil)"]},
    {"day": "Gün 2", "items": ["08:00 Kahvaltı (dahil)", "09:30 Termessos antik kenti yürüyüşü (5 km, +350m)", "13:00 Öğle yemeği (dahil)", "15:00 Düzlerçamı doğa parkında yürüyüş", "18:30 Konaklama", "20:00 Akşam yemeği (dahil)"]},
    {"day": "Gün 3", "items": ["08:00 Kahvaltı (dahil)", "09:30 Serbest gezi veya ek aktivite", "12:00 Öğle yemeği (dahil)", "13:30 İzmir''e dönüş", "19:00 İzmir varış"]}
  ]'::jsonb,
  '[
    {"day": "Day 1", "items": ["07:00 Depart from İzmir", "11:30 Arrive at Köprülü Canyon, gear up", "12:30 Lunch (included)", "14:00 Rafting (3–4 hrs, intermediate)", "18:00 Accommodation", "20:00 Dinner (included)"]},
    {"day": "Day 2", "items": ["08:00 Breakfast (included)", "09:30 Termessos ancient city walk (5 km, +350m)", "13:00 Lunch (included)", "15:00 Nature walk in Düzlerçamı national park", "18:30 Accommodation", "20:00 Dinner (included)"]},
    {"day": "Day 3", "items": ["08:00 Breakfast (included)", "09:30 Free time or optional activity", "12:00 Lunch (included)", "13:30 Return to İzmir", "19:00 Arrive in İzmir"]}
  ]'::jsonb,
  true, 6),

-- ============================================================
-- MOB-LYC-03B: Büyük Likya Turu
-- ============================================================
('MOB-LYC-03B', 'buyuk-likya',
  'Büyük Likya Turu', 'Grand Lycia Tour',
  'Fethiye''den Kaş''a 6 gün, 6 farklı manzara, 2000 yıllık patika.', 'From Fethiye to Kaş: 6 days, 6 different landscapes, a 2000-year-old trail.',
  'Batı Likya''nın "best of" rotası. Bagaj transferi sayesinde sadece günlük çantayla yürütülen bu turda UNESCO''nun Letoon''u, Patara plajı, Kekova batık şehri ve Kaş''ın marinası sizi bekliyor.',
  'Western Lycia''s best-of route. With luggage transfer you walk with just a daypack. UNESCO''s Letoon, Patara beach, the sunken city of Kekova and Kaş marina all await.',
  6, 5, 6, 10, 'hard', 'Mart–Mayıs, Eyl–Kas', 'Mar–May, Sep–Nov',
  22000, '#0A4D68',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  ARRAY['İzmir–Fethiye otobüs', '5 gece konaklama (pansiyon, eko-otel, köy evi, otel)', '14 öğün yemek', 'Sertifikalı TR/EN rehber', 'Günlük bagaj transferi', 'Sigorta', 'Letoon + Patara müze girişleri', 'Kekova tekne turu', 'Antalya–İzmir uçak bileti', 'Mobella sırt çantası + şapka + Likya patch'],
  ARRAY['İzmir–Fethiye coach', '5 nights accommodation (mixed: guesthouse, eco-hotel, village house, hotel)', '14 meals', 'Certified TR/EN guide', 'Daily luggage transfer', 'Insurance', 'Letoon + Patara museum entries', 'Kekova boat trip', 'Antalya–İzmir flight', 'Mobella backpack + hat + Lycia patch'],
  ARRAY['Ek yemekler', 'Alkollü içecekler (Kaş akşam yemeği hariç)', 'Bahşişler', 'Kişisel harcamalar'],
  ARRAY['Extra meals', 'Alcoholic drinks (except Kaş dinner)', 'Tips', 'Personal expenses'],
  '[
    {"day": "Gün 1 — Fethiye & Kayaköy", "items": ["06:30 İzmir''den hareket", "11:30 Fethiye''de öğle yemeği", "13:00 Kayaköy antik köy turu (5 km ısınma yürüyüşü)", "17:00 Ölüdeniz''e transfer, konaklama", "20:00 Akşam yemeği ve brifing (dahil)"]},
    {"day": "Gün 2 — Ölüdeniz → Kabak (16 km)", "items": ["08:00 Kahvaltı", "09:00 Yürüyüş başlangıcı (uçurum üstü kıyı patikası)", "13:00 Öğle molası", "17:00 Kabak Koyu, yüzme", "19:00 Eko-pansiyon, organik akşam yemeği (dahil)"]},
    {"day": "Gün 3 — Kabak → Sidyma (15 km)", "items": ["08:00 Kahvaltı", "09:00 Dağ köyleri ve antik kalıntılar arasında yürüyüş", "13:00 Köy yemeği (dahil)", "17:00 Sidyma antik kenti", "18:30 Köy evi konaklama, ev yemeği (dahil)"]},
    {"day": "Gün 4 — Sidyma → Patara (14 km)", "items": ["08:00 Kahvaltı", "09:00 Letoon UNESCO arkeolojik alanı", "13:00 Picnic öğle yemeği (dahil)", "16:00 Patara antik kenti", "17:30 Patara plajı (18 km, Türkiye''nin en uzun plajı)", "19:00 Patara''da konaklama, akşam yemeği (dahil)"]},
    {"day": "Gün 5 — Patara → Kaş (12 km)", "items": ["08:00 Kahvaltı", "09:00 Kalkan''a yürüyüş (kıyı manzarası)", "14:00 Kalkan''da öğle yemeği (dahil)", "16:00 Kaş''a transfer", "20:00 Kaş''ta akşam yemeği (kısmen dahil — ana yemek + yerel şarap)"]},
    {"day": "Gün 6 — Kekova Finali", "items": ["08:00 Kahvaltı", "09:00 Kekova günübirlik tekne turu (batık şehir, Üçağız)", "13:00 Tekne üstü öğle yemeği (dahil)", "15:00 Kaş''a dönüş, kapanış seremonisi ve fotoğraf", "16:30 Antalya havalimanına transfer", "19:30 Antalya–İzmir uçuşu", "21:00 İzmir varış"]}
  ]'::jsonb,
  '[
    {"day": "Day 1 — Fethiye & Kayaköy", "items": ["06:30 Depart from İzmir", "11:30 Lunch in Fethiye", "13:00 Kayaköy ancient village tour (5 km warm-up)", "17:00 Transfer to Ölüdeniz, accommodation", "20:00 Dinner and briefing (included)"]},
    {"day": "Day 2 — Ölüdeniz → Kabak (16 km)", "items": ["08:00 Breakfast", "09:00 Walk begins (clifftop coastal path)", "13:00 Lunch stop", "17:00 Kabak Bay, swimming", "19:00 Eco-guesthouse, organic dinner (included)"]},
    {"day": "Day 3 — Kabak → Sidyma (15 km)", "items": ["08:00 Breakfast", "09:00 Mountain villages and ancient ruins", "13:00 Village lunch (included)", "17:00 Ancient city of Sidyma", "18:30 Village house accommodation, home-cooked dinner (included)"]},
    {"day": "Day 4 — Sidyma → Patara (14 km)", "items": ["08:00 Breakfast", "09:00 Letoon UNESCO site", "13:00 Picnic lunch (included)", "16:00 Ancient city of Patara", "17:30 Patara beach (18 km, Turkey''s longest)", "19:00 Hotel in Patara, dinner (included)"]},
    {"day": "Day 5 — Patara → Kaş (12 km)", "items": ["08:00 Breakfast", "09:00 Walk to Kalkan (coastal views)", "14:00 Lunch in Kalkan (included)", "16:00 Transfer to Kaş", "20:00 Dinner in Kaş (partly included — main course + local wine)"]},
    {"day": "Day 6 — Kekova Finale", "items": ["08:00 Breakfast", "09:00 Kekova day boat trip (sunken city, Üçağız)", "13:00 Lunch on board (included)", "15:00 Return to Kaş, closing ceremony", "16:30 Transfer to Antalya airport", "19:30 Antalya–İzmir flight", "21:00 Arrive in İzmir"]}
  ]'::jsonb,
  true, 7),

-- ============================================================
-- MOB-URL-05: Urla Gurme Rotası
-- ============================================================
('MOB-URL-05', 'urla-gurme',
  'Urla Gurme Rotası', 'Urla Gourmet Route',
  'Bağ yolu, zeytinyağı atölyesi ve üretici sofrası — İzmir''in 40 dakika batısında farm-to-table bir gün.', 'Vineyard trail, olive oil workshop and a producer''s table — a farm-to-table day 40 minutes west of İzmir.',
  'Urla''nın organik bağ yollarında butik şarap tadımı, zeytinyağı üretim atölyesi ve mevsim sebzeleriyle hazırlanmış uzun bir üretici öğle yemeği. Şehirden kopmadan gurme bir kaçış.',
  'Boutique wine tasting on Urla''s organic vineyard trails, an olive oil production workshop, and a long producer''s lunch prepared with seasonal vegetables. A gourmet escape without leaving the city behind.',
  1, 0, 6, 12, 'easy', 'Mart–Kasım', 'March–November',
  2200, '#7C3AED',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80',
  ARRAY['İzmir–Urla gidiş-dönüş ulaşım', 'Tüm tadımlar (şarap + zeytinyağı)', 'Üretici sofrasında öğle yemeği', 'Gurme rehberi', 'Sigorta'],
  ARRAY['İzmir–Urla return transport', 'All tastings (wine + olive oil)', 'Producer''s lunch', 'Gourmet guide', 'Insurance'],
  ARRAY['Ekstra şarap şişeleri', 'Kişisel alışveriş', 'Yemek atölyesi (opsiyonel ek)'],
  ARRAY['Extra wine bottles', 'Personal shopping', 'Cooking workshop (optional add-on)'],
  '[
    {"day": "Günübirlik Program", "items": ["09:00 İzmir''den hareket, Urla bağ yoluna varış", "10:00 Butik bağ turu ve şarap tadımı (üretici eşliğinde)", "11:30 Zeytinyağı atölyesi ve tadım", "13:00 Üretici sofrasında uzun öğle yemeği (mevsim sebzeleri, enginar, yerel mezeler — dahil)", "15:00 Urla Sanat Sokağı ve yerel üreticiler", "16:30 İsteğe bağlı Ege otları yemek atölyesi", "18:00 İzmir''e dönüş"]}
  ]'::jsonb,
  '[
    {"day": "Day-Trip Programme", "items": ["09:00 Depart from İzmir, arrive at the vineyard trail", "10:00 Boutique vineyard tour and wine tasting (with the producer)", "11:30 Olive oil workshop and tasting", "13:00 Long lunch at the producer''s table (seasonal vegetables, artichokes, local meze — included)", "15:00 Urla Arts Street and local producers", "16:30 Optional Aegean herbs cooking workshop", "18:00 Return to İzmir"]}
  ]'::jsonb,
  true, 8),

-- ============================================================
-- MOB-WND-06: Alaçatı Rüzgar Kampı
-- ============================================================
('MOB-WND-06', 'alacati-ruzgar-kampi',
  'Alaçatı Rüzgar Kampı', 'Alaçatı Wind Camp',
  'Dünyanın en iyi sörf koylarından birinde VDWS sertifikalı, 3 veya 6 günlük yoğunlaştırılmış rüzgar sörfü kampı.', 'VDWS-certified intensive windsurf camp — 3 or 6 days — in one of the world''s best kitesurfing bays.',
  'Alaçatı koyu, sığ ve düz suyuyla dünyaca bilinen bir rüzgar sörfü merkezi. Bu kampı Çeşme paketinden farklı kılan tek odağı: VDWS uyumlu kademeli ders programı, teori, su saati ve video analiz. 3 günde temel, 6 günde sertifika.',
  'Alaçatı bay is a world-renowned windsurf hub with shallow, flat water. What makes this camp different: a single focus — VDWS-compliant progressive lessons, theory, water time and video analysis. Basics in 3 days, certification in 6.',
  3, 2, 6, 12, 'easy', 'Mayıs–Ekim', 'May–October',
  9500, '#0EA5E9',
  'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1200&q=80',
  ARRAY['VDWS sertifikalı eğitim', 'Tüm ekipman (board, yelken, wetsuit)', '2 gece konaklama (3 gün)', 'Kahvaltı', 'Sigorta', 'Katılım/seviye sertifikası'],
  ARRAY['VDWS-certified instruction', 'All equipment (board, rig, wetsuit)', '2 nights accommodation (3-day camp)', 'Breakfast', 'Insurance', 'Participation/level certificate'],
  ARRAY['Öğle/akşam yemekleri (öneri listesi verilir)', 'Ekipman hasar depozitosu', 'Kişisel harcamalar'],
  ARRAY['Lunch/dinner (recommendation list provided)', 'Equipment damage deposit', 'Personal expenses'],
  '[
    {"day": "Her Gün (3 Günlük Format)", "items": ["08:00 Kahvaltı", "09:00 Sabah teori dersi (1 saat)", "10:00 İlk su seansı (2 saat, eğitmen eşliğinde)", "12:30 Öğle arası", "14:00 İkinci su seansı (1.5 saat, serbest pratik)", "16:30 Video analizi ve geri bildirim", "Akşam Alaçatı sokaklarında serbest zaman"]}
  ]'::jsonb,
  '[
    {"day": "Each Day (3-Day Format)", "items": ["08:00 Breakfast", "09:00 Morning theory class (1 hr)", "10:00 First water session (2 hrs, with instructor)", "12:30 Lunch break", "14:00 Second water session (1.5 hrs, free practice)", "16:30 Video analysis and feedback", "Evening free time in Alaçatı streets"]}
  ]'::jsonb,
  true, 9),

-- ============================================================
-- MOB-VOL-07: Alanya Plaj Voleybolu Kampı (İmza Deneyimi)
-- ============================================================
('MOB-VOL-07', 'alanya-voleybol',
  'Alanya Plaj Voleybolu Kampı', 'Alanya Beach Volleyball Camp',
  'Akdeniz''in geniş kumsallarında antrenörlü teknik kamp, mini turnuva ve FIVB formatına yakın rekabetçi oyun.', 'Technical camp with coaches on the Mediterranean''s wide beaches, mini tournament and competitive play close to FIVB format.',
  'Alanya''nın uzun Akdeniz kumsallarında yapılandırılmış plaj voleybolu kampı. Her seviyeye uygun antrenör eşliğinde teknik çalışma, taktik drilller ve final turnuvası. Türkiye''nin Avrupa plaj voleybolu devrelerindeki boşluğunu doldurmaya aday imza ürünümüz.',
  'A structured beach volleyball camp on Alanya''s long Mediterranean beaches. Technical work with a coach suited to all levels, tactical drills and a final tournament. Our signature product aimed at filling Turkey''s gap in European beach volleyball circuits.',
  4, 3, 8, 16, 'easy', 'Mayıs–Ekim', 'May–October',
  12000, '#F59E0B',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&q=80',
  ARRAY['Antrenör kadrosu', 'Kort/saha kullanımı', '3 gece konaklama', 'Kahvaltı', 'Turnuva organizasyonu', 'Sigorta'],
  ARRAY['Coaching team', 'Court/field usage', '3 nights accommodation', 'Breakfast', 'Tournament organisation', 'Insurance'],
  ARRAY['Ulaşım (opsiyonel ek)', 'Öğle/akşam yemekleri', 'Alkollü içecekler', 'Kişisel harcamalar'],
  ARRAY['Transport (optional add-on)', 'Lunch/dinner', 'Alcoholic beverages', 'Personal expenses'],
  '[
    {"day": "Gün 1 — Varış & Tanışma", "items": ["Varış, konaklama yerleşimi", "Tanışma antrenmanı ve seviye belirleme oyunu", "Akşam karşılama buluşması"]},
    {"day": "Gün 2 — Teknik", "items": ["08:00 Kahvaltı", "09:00 Sabah teknik çalışma (servis, pas, manchet) — 2 saat", "11:30 Taktik ikili oyun", "Öğleden sonra serbest yüzme ve plaj", "Akşam serbest"]},
    {"day": "Gün 3 — Taktik & Turnuva 1. Tur", "items": ["08:00 Kahvaltı", "09:00 Blok, savunma ve rotasyon çalışması", "11:30 Mini turnuva 1. tur maçları", "Öğleden sonra dinlenme ve serbest"]},
    {"day": "Gün 4 — Final Turnuvası & Dönüş", "items": ["08:00 Kahvaltı", "09:30 Final turnuvası maçları", "12:00 Ödül töreni ve grup fotoğrafı", "Dönüş"]}
  ]'::jsonb,
  '[
    {"day": "Day 1 — Arrival & Introductions", "items": ["Arrival, check-in", "Introductory training and level-assessment game", "Evening welcome gathering"]},
    {"day": "Day 2 — Technical Skills", "items": ["08:00 Breakfast", "09:00 Morning technical session (serve, set, dig) — 2 hrs", "11:30 Tactical doubles play", "Afternoon free swimming and beach", "Evening free"]},
    {"day": "Day 3 — Tactics & Tournament Round 1", "items": ["08:00 Breakfast", "09:00 Block, defence and rotation work", "11:30 Mini tournament round 1 matches", "Afternoon rest and free time"]},
    {"day": "Day 4 — Final Tournament & Departure", "items": ["08:00 Breakfast", "09:30 Final tournament matches", "12:00 Award ceremony and group photo", "Departure"]}
  ]'::jsonb,
  true, 10),

-- ============================================================
-- MOB-ADV-08: Fethiye & Babadağ Macera
-- ============================================================
('MOB-ADV-08', 'fethiye-babadag',
  'Fethiye & Babadağ Macera', 'Fethiye & Babadağ Adventure',
  '1700 metre yükseklikten Ölüdeniz lagününe iniş — tandem paraşütle dünyanın en iyi kalkış noktalarından biri.', 'A descent from 1,700 metres directly onto Ölüdeniz lagoon — one of the world''s best tandem paragliding launch sites.',
  'Fethiye''nin doğal güzellikleri, Kayaköy''ün tarihi ve Babadağ''dan (1970m+) Ölüdeniz plajına tandem yamacı paraşüt atışı bir arada. Üç günde adrenalin ve huzur bir arada.',
  'The natural beauty of Fethiye, the history of Kayaköy, and a tandem paragliding flight from Babadağ (1,970m+) directly onto Ölüdeniz beach — all in one. Three days of adrenaline and serenity combined.',
  3, 2, 6, 10, 'medium', 'Nisan–Ekim', 'April–October',
  14000, '#0EA5E9',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80',
  ARRAY['Ulaşım', '2 gece konaklama', 'Sertifikalı tandem paraşüt uçuşu', 'Doğa rehberi', 'Sigorta', '2 kahvaltı ve seçili yemekler'],
  ARRAY['Transport', '2 nights accommodation', 'Certified tandem paragliding flight', 'Nature guide', 'Insurance', '2 breakfasts and selected meals'],
  ARRAY['Uçuş foto/video paketi', 'Ek uçuşlar', 'Bazı yemekler', 'Kişisel harcamalar'],
  ARRAY['Flight photo/video package', 'Extra flights', 'Some meals', 'Personal expenses'],
  '[
    {"day": "Gün 1 — Fethiye Keşfi", "items": ["Fethiye''ye varış", "Kayaköy terk edilmiş antik köy turu", "Ölüdeniz bölgesinde hafif doğa yürüyüşü", "Ölüdeniz''de konaklama, akşam yemeği"]},
    {"day": "Gün 2 — Babadağ Atlayışı", "items": ["08:30 Kahvaltı", "10:00 Babadağ''a çıkış (1970m, minibüs ile)", "11:00 Sertifikalı tandem paraşüt uçuşu (Ölüdeniz iniş)", "13:00 Öğle yemeği", "Öğleden sonra Ölüdeniz lagünü ve mavi lagün yüzmesi", "Akşam Fethiye marina"]},
    {"day": "Gün 3 — Kelebekler Vadisi", "items": ["09:00 Kahvaltı", "10:00 Kelebekler Vadisi tekne turu ve yüzme (2 saat)", "13:00 Öğle yemeği", "14:30 İzmir''e dönüş"]}
  ]'::jsonb,
  '[
    {"day": "Day 1 — Fethiye Discovery", "items": ["Arrive in Fethiye", "Kayaköy abandoned ancient village tour", "Light nature walk around Ölüdeniz", "Accommodation in Ölüdeniz, dinner"]},
    {"day": "Day 2 — Babadağ Launch", "items": ["08:30 Breakfast", "10:00 Ascent to Babadağ (1970m, by minibus)", "11:00 Certified tandem paragliding flight (landing on Ölüdeniz beach)", "13:00 Lunch", "Afternoon swimming at Ölüdeniz lagoon and blue lagoon", "Evening at Fethiye marina"]},
    {"day": "Day 3 — Butterfly Valley", "items": ["09:00 Breakfast", "10:00 Butterfly Valley boat trip and swimming (2 hrs)", "13:00 Lunch", "14:30 Return to İzmir"]}
  ]'::jsonb,
  true, 11),

-- ============================================================
-- MOB-CAP-09: Kapadokya Ekim Özel (İmza Deneyimi)
-- ============================================================
('MOB-CAP-09', 'kapadokya-ozel',
  'Kapadokya Ekim Özel', 'Cappadocia October Special',
  'Peribacaları, yeraltı şehirleri ve vadi mağarasında açık hava elektronik müzik gecesi — yılda bir, sadece Ekim.', 'Fairy chimneys, underground cities and an open-air electronic music night in a valley cave — once a year, October only.',
  'Kapadokya''nın yeraltı şehirleri, peribacaları ve vadi yürüyüşlerini, açık hava elektronik müzik gecesiyle taçlandıran yılda bir düzenlenen imza etkinliği. Ekim''in serin havası ve hasat mevsimi bu deneyimi biricik kılar.',
  'An annual signature event combining Cappadocia''s underground cities, fairy chimneys and valley walks with an open-air electronic music night. October''s cool air and harvest season make this experience one of a kind.',
  3, 2, 10, 20, 'easy', 'Sadece Ekim', 'October Only',
  11500, '#8B5CF6',
  'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1200&q=80',
  ARRAY['Ulaşım', '2 gece mağara otel', 'Rehberli bölge turları', 'Etkinlik girişi (açık hava gece)', 'Sigorta'],
  ARRAY['Transport', '2 nights cave hotel', 'Guided regional tours', 'Event entrance (open-air night)', 'Insurance'],
  ARRAY['Balon turu (opsiyonel ek)', 'İçecekler', 'Yemeklerin bir kısmı', 'Kişisel harcamalar'],
  ARRAY['Balloon tour (optional add-on)', 'Drinks', 'Some meals', 'Personal expenses'],
  '[
    {"day": "Gün 1 — Varış & Göreme", "items": ["Kapadokya''ya varış", "Göreme Açık Hava Müzesi", "Peribacaları ve güneş batımı noktası", "Mağara otel konaklama", "Akşam yemeği"]},
    {"day": "Gün 2 — Yeraltı & Açık Hava Gece", "items": ["08:30 Kahvaltı", "09:30 Derinkuyu veya Kaymaklı yeraltı şehri turu", "Öğleden sonra Kızılçukur/Güvercinlik Vadisi yürüyüşü", "Akşam vadi/mağara mekanında açık hava elektronik müzik gecesi (dahil)"]},
    {"day": "Gün 3 — Şafak & Dönüş", "items": ["İsteğe bağlı sıcak hava balonu (opsiyonel, ek ücret)", "Güvercinlik Vadisi sabah yürüyüşü", "Yerel kahvaltı", "Dönüş"]}
  ]'::jsonb,
  '[
    {"day": "Day 1 — Arrival & Göreme", "items": ["Arrive in Cappadocia", "Göreme Open-Air Museum", "Fairy chimneys and sunset viewpoint", "Cave hotel accommodation", "Dinner"]},
    {"day": "Day 2 — Underground & Open-Air Night", "items": ["08:30 Breakfast", "09:30 Derinkuyu or Kaymaklı underground city tour", "Afternoon Kızılçukur/Güvercinlik Valley walk", "Evening open-air electronic music night at a valley/cave venue (included)"]},
    {"day": "Day 3 — Dawn & Return", "items": ["Optional hot-air balloon at sunrise (extra fee)", "Morning walk in Güvercinlik Valley", "Local breakfast", "Return"]}
  ]'::jsonb,
  true, 12),

-- ============================================================
-- MOB-KAS-10: Kaş Deniz & Derinlik
-- ============================================================
('MOB-KAS-10', 'kas-deniz',
  'Kaş Deniz & Derinlik', 'Kaş Sea & Depth',
  'Kekova batık şehri üzerinde deniz kanoğu, ardından Akdeniz''in berrak sularında ilk dalış.', 'Sea kayaking over the sunken city of Kekova, then your first dive in the crystal-clear waters of the Mediterranean.',
  'Kaş, Akdeniz''in en iyi dalış noktalarından biri. Üçağız''dan Kekova batık şehri üzerinde rehberli deniz kanoğuyla başlayan bu 2 günlük tur, Kaş''ın berrak sularında eğitmenli tanıtım dalışıyla taçlanıyor.',
  'Kaş is one of the Mediterranean''s finest diving spots. This 2-day tour starts with a guided sea kayak over the sunken city of Kekova from Üçağız, then culminates with an instructor-led introductory dive in Kaş''s crystal-clear waters.',
  2, 1, 6, 10, 'easy', 'Mayıs–Ekim', 'May–October',
  7500, '#0369A1',
  'https://images.unsplash.com/photo-1517699418036-fb5d179fef0c?w=1200&q=80',
  ARRAY['Kano + rehber (Kekova)', 'Eğitmenli tanıtım dalışı (try-dive)', '1 gece konaklama', 'Kahvaltı', 'Sigorta'],
  ARRAY['Kayak + guide (Kekova)', 'Instructor-led introductory dive', '1 night accommodation', 'Breakfast', 'Insurance'],
  ARRAY['İleri dalış kursu', 'Bazı yemekler', 'Kişisel harcamalar', 'Fotoğraf/video paketi'],
  ARRAY['Advanced dive course', 'Some meals', 'Personal expenses', 'Photo/video package'],
  '[
    {"day": "Gün 1 — Kekova Deniz Kanoğu", "items": ["Kaş''a varış", "Üçağız''dan hareket — Kekova batık şehri üzerinde rehberli deniz kanoğu (3 saat)", "Simena kalesi ziyareti", "Akşam Kaş marina ve yemek"]},
    {"day": "Gün 2 — Dalış Günü", "items": ["08:30 Kahvaltı", "09:30 Eğitmenli tanıtım dalışı (try-dive — 1.5–2 saat, ön deneyim gerekmez)", "Dalış sonrası Kaş merkezi serbest gezi", "13:00 Öğle yemeği", "14:30 İzmir''e dönüş"]}
  ]'::jsonb,
  '[
    {"day": "Day 1 — Kekova Sea Kayak", "items": ["Arrive in Kaş", "Depart from Üçağız — guided sea kayak over Kekova sunken city (3 hrs)", "Visit Simena castle", "Evening at Kaş marina and dinner"]},
    {"day": "Day 2 — Diving Day", "items": ["08:30 Breakfast", "09:30 Instructor-led introductory dive (try-dive — 1.5–2 hrs, no experience needed)", "Post-dive free time in Kaş centre", "13:00 Lunch", "14:30 Return to İzmir"]}
  ]'::jsonb,
  true, 13);

-- ============================================================
-- Örnek tarihler (yeni ürünler için)
-- ============================================================

-- Muğla Doğa
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-20', '2026-06-21', 10, 5500, true FROM experiences WHERE code = 'MOB-NAT-02B';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-11', '2026-07-12', 10, 5500, true FROM experiences WHERE code = 'MOB-NAT-02B';

-- Antalya Doğa
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-04', '2026-07-06', 10, 9000, true FROM experiences WHERE code = 'MOB-NAT-02C';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-08-01', '2026-08-03', 10, 9000, true FROM experiences WHERE code = 'MOB-NAT-02C';

-- Büyük Likya
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-09-11', '2026-09-16', 10, 22000, true FROM experiences WHERE code = 'MOB-LYC-03B';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-10-09', '2026-10-14', 10, 22000, true FROM experiences WHERE code = 'MOB-LYC-03B';

-- Urla Gurme
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-13', '2026-06-13', 12, 2200, true FROM experiences WHERE code = 'MOB-URL-05';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-27', '2026-06-27', 12, 2200, true FROM experiences WHERE code = 'MOB-URL-05';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-18', '2026-07-18', 12, 2200, true FROM experiences WHERE code = 'MOB-URL-05';

-- Alaçatı Rüzgar Kampı
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-26', '2026-06-28', 12, 9500, true FROM experiences WHERE code = 'MOB-WND-06';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-17', '2026-07-19', 12, 9500, true FROM experiences WHERE code = 'MOB-WND-06';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-08-07', '2026-08-09', 12, 9500, true FROM experiences WHERE code = 'MOB-WND-06';

-- Alanya Voleybol
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-23', '2026-07-26', 16, 12000, true FROM experiences WHERE code = 'MOB-VOL-07';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-08-20', '2026-08-23', 16, 12000, true FROM experiences WHERE code = 'MOB-VOL-07';

-- Fethiye & Babadağ
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-19', '2026-06-21', 10, 14000, true FROM experiences WHERE code = 'MOB-ADV-08';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-10', '2026-07-12', 10, 14000, true FROM experiences WHERE code = 'MOB-ADV-08';

-- Kapadokya Ekim Özel (sadece Ekim)
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-10-16', '2026-10-18', 20, 11500, true FROM experiences WHERE code = 'MOB-CAP-09';

-- Kaş Deniz & Derinlik
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-06-27', '2026-06-28', 10, 7500, true FROM experiences WHERE code = 'MOB-KAS-10';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-07-25', '2026-07-26', 10, 7500, true FROM experiences WHERE code = 'MOB-KAS-10';
INSERT INTO experience_dates (experience_id, start_date, end_date, max_capacity, price_per_person, is_active)
SELECT id, '2026-08-22', '2026-08-23', 10, 7500, true FROM experiences WHERE code = 'MOB-KAS-10';
