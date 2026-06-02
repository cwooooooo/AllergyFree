-- ==========================================
-- AllergyFree App - Database Seeding (Auto-Generated Real Products)
-- ==========================================

-- 1. categories
INSERT INTO categories (name) VALUES 
('간식'),
('음료'),
('유제품'),
('베이커리');

-- 2. allergens
INSERT INTO allergens (name, display_name, severity) VALUES
('egg', '난류(계란)', 3),
('milk', '우유', 3),
('buckwheat', '메밀', 3),
('peanut', '땅콩', 3),
('soybean', '대두', 3),
('wheat', '밀', 3),
('shrimp', '새우', 3),
('crab', '게', 3),
('squid', '오징어', 3),
('mackerel', '고등어', 3),
('shellfish', '조개류 (굴, 전복, 홍합 등)', 3),
('beef', '쇠고기', 3),
('pork', '돼지고기', 3),
('chicken', '닭고기', 3),
('walnut', '호두', 3),
('pine_nut', '잣', 3),
('peach', '복숭아', 3),
('tomato', '토마토', 3),
('kiwi', '키위', 3),
('sulfites', '아황산류 (보존제)', 3),
('nuts', '견과류', 2),
('seafood', '해산물', 2)
ON CONFLICT (name) DO NOTHING;

-- 2-1. allergen_alias seed data
INSERT INTO allergen_alias (allergen_id, keyword) VALUES
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), '난류'),
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), '계란'),
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), '달걀'),
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), 'egg'),
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), '조류'),
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), '난황'),
((SELECT id FROM allergens WHERE name = 'egg' LIMIT 1), '난백'),

((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '우유'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '탈지분유'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '전지분유'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '유당'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '밀크'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), 'milk'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '락토'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '유청'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '카제인'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '유크림'),
((SELECT id FROM allergens WHERE name = 'milk' LIMIT 1), '버터'),

((SELECT id FROM allergens WHERE name = 'buckwheat' LIMIT 1), '메밀'),
((SELECT id FROM allergens WHERE name = 'buckwheat' LIMIT 1), 'buckwheat'),

((SELECT id FROM allergens WHERE name = 'peanut' LIMIT 1), '땅콩'),
((SELECT id FROM allergens WHERE name = 'peanut' LIMIT 1), 'peanut'),
((SELECT id FROM allergens WHERE name = 'peanut' LIMIT 1), '땅콩버터'),

((SELECT id FROM allergens WHERE name = 'soybean' LIMIT 1), '대두'),
((SELECT id FROM allergens WHERE name = 'soybean' LIMIT 1), '소이'),
((SELECT id FROM allergens WHERE name = 'soybean' LIMIT 1), '콩'),
((SELECT id FROM allergens WHERE name = 'soybean' LIMIT 1), 'soybean'),
((SELECT id FROM allergens WHERE name = 'soybean' LIMIT 1), '레시틴'),
((SELECT id FROM allergens WHERE name = 'soybean' LIMIT 1), '두유'),

((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '밀'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '밀가루'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '소맥'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), 'wheat'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '글루텐'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '호밀'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '호밀가루'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '귀리'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '귀리액'),
((SELECT id FROM allergens WHERE name = 'wheat' LIMIT 1), '보리'),

((SELECT id FROM allergens WHERE name = 'shrimp' LIMIT 1), '새우'),
((SELECT id FROM allergens WHERE name = 'shrimp' LIMIT 1), 'shrimp'),

((SELECT id FROM allergens WHERE name = 'crab' LIMIT 1), '게'),
((SELECT id FROM allergens WHERE name = 'crab' LIMIT 1), '꽃게'),
((SELECT id FROM allergens WHERE name = 'crab' LIMIT 1), 'crab'),

((SELECT id FROM allergens WHERE name = 'squid' LIMIT 1), '오징어'),
((SELECT id FROM allergens WHERE name = 'squid' LIMIT 1), 'squid'),

((SELECT id FROM allergens WHERE name = 'mackerel' LIMIT 1), '고등어'),
((SELECT id FROM allergens WHERE name = 'mackerel' LIMIT 1), 'mackerel'),

((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '조개'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '굴'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '전복'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '홍합'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), 'shellfish'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '바지락'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '꼬막'),
((SELECT id FROM allergens WHERE name = 'shellfish' LIMIT 1), '조개류'),

((SELECT id FROM allergens WHERE name = 'beef' LIMIT 1), '쇠고기'),
((SELECT id FROM allergens WHERE name = 'beef' LIMIT 1), '소고기'),
((SELECT id FROM allergens WHERE name = 'beef' LIMIT 1), 'beef'),

((SELECT id FROM allergens WHERE name = 'pork' LIMIT 1), '돼지고기'),
((SELECT id FROM allergens WHERE name = 'pork' LIMIT 1), '돈육'),
((SELECT id FROM allergens WHERE name = 'pork' LIMIT 1), 'pork'),

((SELECT id FROM allergens WHERE name = 'chicken' LIMIT 1), '닭고기'),
((SELECT id FROM allergens WHERE name = 'chicken' LIMIT 1), '계육'),
((SELECT id FROM allergens WHERE name = 'chicken' LIMIT 1), 'chicken'),

((SELECT id FROM allergens WHERE name = 'walnut' LIMIT 1), '호두'),
((SELECT id FROM allergens WHERE name = 'walnut' LIMIT 1), 'walnut'),

((SELECT id FROM allergens WHERE name = 'pine_nut' LIMIT 1), '잣'),
((SELECT id FROM allergens WHERE name = 'pine_nut' LIMIT 1), 'pine_nut'),

((SELECT id FROM allergens WHERE name = 'peach' LIMIT 1), '복숭아'),
((SELECT id FROM allergens WHERE name = 'peach' LIMIT 1), 'peach'),

((SELECT id FROM allergens WHERE name = 'tomato' LIMIT 1), '토마토'),
((SELECT id FROM allergens WHERE name = 'tomato' LIMIT 1), 'tomato'),

((SELECT id FROM allergens WHERE name = 'kiwi' LIMIT 1), '키위'),
((SELECT id FROM allergens WHERE name = 'kiwi' LIMIT 1), 'kiwi'),

((SELECT id FROM allergens WHERE name = 'sulfites' LIMIT 1), '아황산'),
((SELECT id FROM allergens WHERE name = 'sulfites' LIMIT 1), 'sulfite'),

((SELECT id FROM allergens WHERE name = 'nuts' LIMIT 1), '견과'),
((SELECT id FROM allergens WHERE name = 'nuts' LIMIT 1), '견과류'),
((SELECT id FROM allergens WHERE name = 'nuts' LIMIT 1), '넛'),
((SELECT id FROM allergens WHERE name = 'nuts' LIMIT 1), '캐슈넛'),

((SELECT id FROM allergens WHERE name = 'seafood' LIMIT 1), '해산물'),
((SELECT id FROM allergens WHERE name = 'seafood' LIMIT 1), '어패류')
ON CONFLICT (allergen_id, keyword) DO NOTHING;

-- 3. users (robot user: robot@allergyfree.com / password: password123)
INSERT INTO users (email, username, password, name, phone, birthdate, gender, recipient_name, address, detail_address, zipcode, contact_phone) VALUES
('robot@allergyfree.com', 'robot', '$2b$10$9GyLXZOJljE.fzm2jcTBveGTluyGSlBt6ubC4D92t8pIQ7bX2Zcda', 'robot', '010-1234-5678', '1995-09-09', 'male', 'robot', '서울시 강남구 테헤란로 123', '삼원타워 5층', '06123', '010-1234-5678')
ON CONFLICT (email) DO NOTHING;

-- 4. user_allergies (robot user has allergies to milk and peanut)
INSERT INTO user_allergies (user_id, allergen_id)
SELECT u.id, a.id
FROM users u, allergens a
WHERE u.email = 'robot@allergyfree.com' 
  AND a.name IN ('milk', 'peanut')
ON CONFLICT (user_id, allergen_id) DO NOTHING;

-- 5. products
INSERT INTO products (barcode, name, brand, price, alternative_group, category_id, image_url, ingredients_text, source) VALUES
('8801117265007', '오리온_예감 치즈그라탕 200g', '(주)오리온', 4500, 'milk_group', (SELECT id FROM categories WHERE name = '유제품' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1976/1976048700593/1976048700593-1.jpg', '감자분말(미국산58%,폴란드산42%/감자,유화제,산도조절제),식물성유지1[팜올레인유 말레이시아산,가공유지(팜스테아린에스테르화유 말에이시아산)],전분가공품1 미국산, 백설탕, 식물성유지2,치즈그라탕시즈닝[감미료아스파탐(페닐알라닌함유)], 전분가공품2,알파옥수수분말,감자맛분말,유단백혼합분말,산도조절제,찐감자맛분말,유미분,전지분유,식염,치즈분말,혼합제제(젖산분말,젖산칼슘,이산화규소),효소제', 'seed'),
('8801117272807', '주)오리온 예감치즈그라탕 120G', '(주)오리온', 2500, 'milk_group', (SELECT id FROM categories WHERE name = '유제품' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1976/1976048700593/1976048700593-1.jpg', '감자분말(미국산58%,폴란드산42%/감자,유화제,산도조절제),식물성유지1[팜올레인유 말레이시아산,가공유지(팜스테아린에스테르화유 말에이시아산)],전분가공품1 미국산, 백설탕, 식물성유지2,치즈그라탕시즈닝[감미료아스파탐(페닐알라닌함유)], 전분가공품2,알파옥수수분말,감자맛분말,유단백혼합분말,산도조절제,찐감자맛분말,유미분,전지분유,식염,치즈분말,혼합제제(젖산분말,젖산칼슘,이산화규소),효소제', 'shop'),
('8804888008101', '코주부 이춘복치즈육포기획 40g*3', '(주)코주부비앤에프', 3500, 'milk_group', (SELECT id FROM categories WHERE name = '유제품' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/2013/201304331027/201304331027-1.jpg', '돈육30.1%(국내산),우육30.1%(외국산:호주산,미국산,뉴질랜드산 등),연성가공치즈 30.1%[자연치즈70%(뉴질랜드산),정제수,카제인나트륨,식물성유지(팜유:말레이시아산),산도조절제,합성향료(로마노치즈향),착색료(베타카로틴)],혼합간장[탈지대두,소맥],정백당,D-솔비톨,정제염,비프분말-디[L-글루타신만나트륨(향미증진제)},마늘분말,피클링설트(정제염,아질산나트륨(발색제),탄산나트륨],에르쏘르빈산나트륨(산화방지제),솔빈산칼륨(합성보존료),대두단백,카라멜색소', 'shop'),
('8801111914871', '크라운제과 미니쉘 딸기요거트 38G', '(주)크라운제과', 3500, 'milk_group', (SELECT id FROM categories WHERE name = '유제품' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1997/1997044311946/1997044311946-1.jpg', '로우슈가밀크초콜릿[싱가포르산:말티톨,탈지분유,코코아매스,식물성유지,코코아버터,합성착향료(바닐린)],딸기크림C[백설탕,식물성유지1,식물성유지2,유당,혼합탈지분유,동결건조딸기분말,합성착향료(딸기향)]동결건조딸기그래뉼,유화제,우유,대두함유 말티톨20.2%,동결건조딸기분말1.5%,동결건조딸기그래뉼0.7%,코코아원료15.6%', 'shop'),
('8801068073577', '㈜삼립식품 시크릿)미니생크림파운드', '(주)삼립식품', 1500, 'milk_group', (SELECT id FROM categories WHERE name = '유제품' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1995/199503380155901/199503380155901-1.jpg', '밀가루(밀/미국산),백설탕,계란/국산,대두유[대두유/수입산(대두),d-토코페롤(혼합형),규소수지],가공유크림(우유),물엿,아몬드슬라이스,호두,혼합제제[유화제,과당,주정],호박씨,합성팽창제[산도조절제,밀가루,유채유],아몬드분말,정제소금,합성착향료(밀크향),잔탄검', 'shop'),
('8801016350767', '옛날꿀호떡', '(주)샤니', 4500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1971/1971027500396/1971027500396-1.jpg', '밀가루{밀(미국산,캐나다산),밀(호주산,미국산)},꿀호떡크림[기타설탕,백설탕,변성전분,벌꿀/국산,기타전분(옥수수/수입산)],백설탕,미가린[팜유,대두유,팜스테아린,코코넛오일,유지방무수],효모,정제소금,곡류가공품,혼합제제[산도조절제,전분],유화제,곡류가공품(대두),합성착향료(로스티드콘향:땅콩)', 'seed'),
('8801016311041', '땅콩호떡 200G', '(주)샤니', 1500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1971/197102750031681/197102750031681-1.jpg', '밀가루(밀/미국산,호주산),꿀호떡크림(당류가공품)[흑설탕,백설탕,변성전분,벌꿀,기타전분],백설탕,마가린/인도네시아산,땅콩/중국산,효모,정제소금,혼합제제[산도조절제,전분],유화제,기타가공품,곡류가공품(대두),합성착향료(로스티드콘향:피넛버터/영국산)', 'shop'),
('8801016346173', '브데)땅콩호떡', '(주)샤니', 3500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1971/197102750031681/197102750031681-1.jpg', '밀가루(밀/미국산,호주산),꿀호떡크림(당류가공품)[흑설탕,백설탕,변성전분,벌꿀,기타전분],백설탕,마가린/인도네시아산,땅콩/중국산,효모,정제소금,혼합제제[산도조절제,전분],유화제,기타가공품,곡류가공품(대두),합성착향료(로스티드콘향:피넛버터/영국산)', 'shop'),
('8804845202115', '오성제과 우리밀약과(미니) 200g', '오성제과', 3500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1999/1999049309348/1999049309348-1.jpg', '우리밀(국산)47.5%, 식용유(옥배유/외국산:브라질,미국,러시아 등), 물엿, 설탕, 재제소금(국내산), 탄산수소나트륨(팽창제), 계피가루, 바닐라향분말', 'shop'),
('8801068019766', '삼립)미니약과170g', '(주)삼립식품', 4500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1995/199503380153757/199503380153757-1.jpg', '밀가루(밀/미국산),물엿,백설탕,채종유/호주상,D-소르비톨액,유화제,정제소금,산도조절제[바닐린,말토덱스트린],계피분말', 'shop'),
('8801068050714', '(주)삼립식품 미니약과 960G', '(주)삼립식품', 1500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1995/199503380153757/199503380153757-1.jpg', '밀가루(밀/미국산),물엿,백설탕,채종유/호주상,D-소르비톨액,유화제,정제소금,산도조절제[바닐린,말토덱스트린],계피분말', 'shop'),
('8801068263725', '미니약과', '(주)삼립식품', 4500, 'bread_group', (SELECT id FROM categories WHERE name = '베이커리' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1995/199503380153757/199503380153757-1.jpg', '밀가루(밀/미국산),물엿,백설탕,채종유/호주상,D-소르비톨액,유화제,정제소금,산도조절제[바닐린,말토덱스트린],계피분말', 'shop'),
('8801097235014', '동아오츠카 나랑드사이다500ML - PET BOTTLE', '동아오츠카(주)', 2500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1973/1973028800636/1973028800636-1.jpg', '정제수, 탄산가스, 구연산, 난소화성말토덱스트린, 레몬농축과즙, 염화칼륨, 탄산수소나트륨, 젖산칼슘, 합성착향료, 합성감미료', 'seed'),
('8801056061647', '롯데칠성음료(주) 롯데 칠성사이다 355G x 4EA', '롯데칠성음료(주)', 4500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1984/1984022101049/1984022101049-1.jpg', '정제수,액상과당,백설탕,이산화탄소,구연산,레몬라임향', 'shop'),
('8801056061807', '롯데칠성음료(주) 칠성 사이다 1800G x 1EA', '롯데칠성음료(주)', 3500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1993/1993024205347/1993024205347-1.jpg', '정제수,액상과당,백설탕,이산화탄소,구연산,레몬라임향', 'shop'),
('8801121104057', '뼈로가는칼슘두유 190ML', '매일유업(주)', 1500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1981/1981022700732/1981022700732-1.jpg', '두유액94%(대두고형분 8%이상,외국산(미국,캐나다,호주 등)),정백당,식물성유지(태국산),칼슘혼합제제1.1%(제삼인산칼슘,아라비아검,유화제),현미물엿,글리세린지방산에스테르,정제수,식염(국산),합성착향료(땅콩향),비타민D3 혼합제제(비타민D3,에틸셀룰로오스,말토덱스트린,토코페롤)', 'shop'),
('8801136361018', '삼육두유 195ML', '삼육식품', 4500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1985/198504490011/198504490011-1.jpg', '두유액94.5%(대두고형분7.0%이상, 대두-수입산), 액상과당, 옥배유(수입산), 채종유, 탄산칼슘, 정제소금, 잔탄검, 글리세린지방산에스테르, 드라이비타민D₃(비타민D₃, 아라비아검, 전분, MCT유, 자당, 비타민E, 이산화규소), 티제이-2000(식물성유지, 글리세린지방산에스테르, 레시틴, 탄산마그네슘), 정제수', 'shop'),
('88001630', '삼육두유 200ML', '삼육식품', 1500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1985/198504490011/198504490011-1.jpg', '두유액94.5%(대두고형분7.0%이상, 대두-수입산), 액상과당, 옥배유(수입산), 채종유, 탄산칼슘, 정제소금, 잔탄검, 글리세린지방산에스테르, 드라이비타민D₃(비타민D₃, 아라비아검, 전분, MCT유, 자당, 비타민E, 이산화규소), 티제이-2000(식물성유지, 글리세린지방산에스테르, 레시틴, 탄산마그네슘), 정제수', 'shop'),
('8801136302097', '삼육두유1000ml', '삼육식품', 2500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1985/198504490011/198504490011-1.jpg', '두유액94.5%(대두고형분7.0%이상, 대두-수입산), 액상과당, 옥배유(수입산), 채종유, 탄산칼슘, 정제소금, 잔탄검, 글리세린지방산에스테르, 드라이비타민D₃(비타민D₃, 아라비아검, 전분, MCT유, 자당, 비타민E, 이산화규소), 티제이-2000(식물성유지, 글리세린지방산에스테르, 레시틴, 탄산마그네슘), 정제수', 'shop'),
('8801136361049', '삼육두유 파우치 195*5', '삼육식품', 2500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1985/198504490011/198504490011-1.jpg', '두유액94.5%(대두고형분7.0%이상, 대두-수입산), 액상과당, 옥배유(수입산), 채종유, 탄산칼슘, 정제소금, 잔탄검, 글리세린지방산에스테르, 드라이비타민D₃(비타민D₃, 아라비아검, 전분, MCT유, 자당, 비타민E, 이산화규소), 티제이-2000(식물성유지, 글리세린지방산에스테르, 레시틴, 탄산마그네슘), 정제수', 'shop'),
('8801136401448', '삼육식품 삼육두유(병) 선물용', '삼육식품', 4500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1985/198504490011/198504490011-1.jpg', '두유액94.5%(대두고형분7.0%이상, 대두-수입산), 액상과당, 옥배유(수입산), 채종유, 탄산칼슘, 정제소금, 잔탄검, 글리세린지방산에스테르, 드라이비타민D₃(비타민D₃, 아라비아검, 전분, MCT유, 자당, 비타민E, 이산화규소), 티제이-2000(식물성유지, 글리세린지방산에스테르, 레시틴, 탄산마그네슘), 정제수', 'shop'),
('8801136401028', '삼육두유테트라 200ml*24', '삼육식품', 3500, 'drink_group', (SELECT id FROM categories WHERE name = '음료' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1985/198504490011/198504490011-1.jpg', '두유액94.5%(대두고형분7.0%이상, 대두-수입산), 액상과당, 옥배유(수입산), 채종유, 탄산칼슘, 정제소금, 잔탄검, 글리세린지방산에스테르, 드라이비타민D₃(비타민D₃, 아라비아검, 전분, MCT유, 자당, 비타민E, 이산화규소), 티제이-2000(식물성유지, 글리세린지방산에스테르, 레시틴, 탄산마그네슘), 정제수', 'shop'),
('8801043026468', '(주)농심 새우깡미니팩 30G x 4EA', '(주)농심', 3500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1976/19760342001184/19760342001184-1.jpg', '소맥분(밀;미국산), 미강유(태국산), 옥수수전분{옥수수 : 외국산(러시아, 헝가리, 세르비아 등)}, 새우(국산), 맛베이스조미분말{혼합제제(타피오카산화전분, 말토덱스트린), 정백당, 정제염, 건새우분말(중국산), 새우추출물분말(새우;캐나다산)}, 팜유, 새우풍미유, 염미시즈닝', 'seed'),
('8801062383337', '롯데 꼬깔콘 매콤달콤한맛 155G', '롯데제과(주)', 2500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1983/19830308010143/19830308010143-1.jpg', '옥수수(수입산),혼합식용유(해바라기유50%;수입산,팜올레인유49.9%;말레이시아산,오르가녹스,올레오레진로즈마리,토코페롤),매콤달콤한맛씨즈닝(우유,대두,밀,합성감미료:수크랄로스),백설탕,정제소금,산도조절제', 'shop'),
('8801019302473', '에이스샌드', '해태제과식품(주)', 4500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1986/1986056002930/1986056002930-1.jpg', '밀가루(미국산), 쇼트닝[식물성유지(팜유,말레이시아산), 가공유지(에스테르화유 : 팜올레인유, 말레이시아산, 팜유, 말레이시아산)], 혼합식용유[팜올레인유(말레이시아산), 팜유(말레이시아산), 올레오레진로즈메리], 백설탕, 곡류가공품, 분말 · 결정포도당, 기타가공품, 전지분유, 정제소금, 재제소금, 분말유크림, 팽창제,합성착향료(밀크향), 비타민B1염산염, 비타민B2, 혼합제제(효모, 밀가루), 효소제', 'shop'),
('8801062168330', '누드빼빼로 45G', '롯데제과(주)', 1500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1983/1983030801093/1983030801093-1.jpg', '준초콜릿[백설탕,전지분골드Ⅰ(유청분말(프랑스산),유당(미국산),버터유(우유),팜유,유크림),코코아매스(가나산;코코아빈),쇼트닝(부분경화유),혼합식용유(부분경화유),레시틴(대두),합성착향료(바닐라향,바닐린)],밀가루(미국산,캐나다산;밀),옥수수전분,쇼트닝(부분경화유),백설탕,기타가공품,액상과당,식물성유지(부분경화유),맥아엑기스,정제소금,산도조절제,합성착향료(팜브레드향,바닐라향),미강유,복합조미식품', 'shop'),
('8801019304903', '홈런볼초코(행)', '해태제과식품(주)', 3500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1984/1984022100896/1984022100896-1.jpg', '홈런볼초코[백설탕, 혼합식용유{채종유(호주산), 가공유지(팜스테아린경화에스테르화유(말레이시아산), 팜핵경화에스테르화유(말레이시아산))}, 혼합분유(벨기에산), 코코아분말, 땅콩버터], 전란액(국산), 마가린{팜유(말레이시아산), 정제수,우지(호주산), 고올레산해바라기유, 팜스테아린유, 유화제}, 밀가루, 난백액, 찰옥수수알파전분, 기타가공품, 정제소금, 유화제, 산도조절제, 합성향료(바닐라향), 비타민B2', 'shop'),
('8801111614320', '초코파이2입', '(주)크라운제과', 2500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/2006/2006024237642/2006024237642-1.jpg', '소맥분(밀:미국산),백설탕,물엿,쇼트닝[우지(호주산),식물성유지[야자유:외국산(말레이시아,인도네시아,필리핀등)}],식물성유지(말레이시아산),혼합분유(코코아분말:네덜란드산),소르비톨액,코코아분말1(네덜란드산),코코아분말2(싱가포르산),분말·결정포도당,젤라틴,발효주정0.4%,코코아매스(네덜란드산),정제소금,산도조절제,유당,글리세린,기타가공품,유화제,바닐린,합성향료(럼향,꼬낙향,크럼밀크향),혼합제제(카제인나트륨,수산화칼슘,아라비아검),유카추출물', 'shop'),
('8801062268856', '롯데_몽쉘카카오케이크_3600', '롯데제과(주)', 2500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1983/1983030801064/1983030801064-1.jpg', '준초콜릿[식물성유지(싱가포르산),백설탕,혼합분유(수입산),덱스트린,코코아분말(싱가포르산),코코아매스(가나산;코코아빈)],밀가루(미국산),백설탕,쇼트닝Ⅰ(팜스테아린유(말레이시아산:경화유),식물성유지(말레이시아산)],식물성크림(백설탕,식물성유지Ⅰ,전지분골드Ⅰ,유당,식물성유지Ⅱ),쇼트닝Ⅱ(팜부분경화유),전란액,물엿,D-소르비톨액,혼합분유,쇼트닝Ⅲ,가공유,주정0.9%,기타코코아가공품(싱가포르산),기타가공품,코코아분말(싱가포르산,브라질산),코코아매스(가나산;코코아빈),산도조절제,정제소금,일반증류주0.02%,합성착향료(바닐라향,스위트향)', 'shop'),
('8802876203200', '동화씨앤에프 쌀로만든대롱과자 100G', '(주)동화씨앤에프', 4500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1990/19900355116132/19900355116132-1.jpg', '소맥분(미국산,호주산),식물성유지(팜유:말레이시아산),분당,쌀가루(국내산)5%,물엿,함수결정포도당,산도조절제(탄산수소암모늄,탄산수소나트륨),정제소금,젤라틴,합성착향료(크래커향,스모크향),향미증진제', 'shop'),
('8802876203170', '(주)동화씨앤에프 홈플러스(주) 쌀로만든 대롱과자 280G', '(주)동화씨앤에프', 3500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1990/19900355116132/19900355116132-1.jpg', '소맥분(미국산,호주산),식물성유지(팜유:말레이시아산),분당,쌀가루(국내산)5%,물엿,함수결정포도당,산도조절제(탄산수소암모늄,탄산수소나트륨),정제소금,젤라틴,합성착향료(크래커향,스모크향),향미증진제', 'shop'),
('8801268003602', '동아제과 생강맛과자 180G', '동아제과', 4500, 'snack_group', (SELECT id FROM categories WHERE name = '간식' LIMIT 1), 'http://www.haccp.or.kr/fresh/prdimg/1994/1994014402690/1994014402690-1.jpg', '밀가루(외국산:미국,호주산), 미립당, 식물성유지(말레이시아산), 백설탕, 물엿, 생강(국내산), 소금, 이스트, 젤라틴', 'shop')
ON CONFLICT (barcode) DO NOTHING;

-- 6. product_allergens (Denormalized mapping)
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117265007' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117265007' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117265007' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117265007' AND a.name = 'shrimp' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117265007' AND a.name = 'squid' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117265007' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117272807' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117272807' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117272807' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117272807' AND a.name = 'shrimp' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117272807' AND a.name = 'squid' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801117272807' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804888008101' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804888008101' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804888008101' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804888008101' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804888008101' AND a.name = 'pork' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804888008101' AND a.name = 'tomato' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111914871' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111914871' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111914871' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068073577' AND a.name = 'egg' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068073577' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068073577' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068073577' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068073577' AND a.name = 'walnut' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016350767' AND a.name = 'peanut' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016350767' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016350767' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016350767' AND a.name = 'nuts' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016311041' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016311041' AND a.name = 'peanut' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016311041' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016311041' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016311041' AND a.name = 'nuts' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016346173' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016346173' AND a.name = 'peanut' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016346173' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016346173' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801016346173' AND a.name = 'nuts' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8804845202115' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068019766' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068050714' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801068263725' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801121104057' AND a.name = 'peanut' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801121104057' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801136361018' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '88001630' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801136302097' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801136361049' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801136401448' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801136401028' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801043026468' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801043026468' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801043026468' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801043026468' AND a.name = 'shrimp' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062383337' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062383337' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062383337' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019302473' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019302473' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019302473' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062168330' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062168330' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062168330' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019304903' AND a.name = 'egg' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019304903' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019304903' AND a.name = 'peanut' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019304903' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019304903' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801019304903' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111614320' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111614320' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111614320' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111614320' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801111614320' AND a.name = 'pork' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062268856' AND a.name = 'egg' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062268856' AND a.name = 'milk' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062268856' AND a.name = 'soybean' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062268856' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801062268856' AND a.name = 'beef' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8802876203200' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8802876203200' AND a.name = 'pork' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8802876203170' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8802876203170' AND a.name = 'pork' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801268003602' AND a.name = 'wheat' ON CONFLICT (product_id, allergen_id) DO NOTHING;
INSERT INTO product_allergens (product_id, allergen_id) SELECT p.id, a.id FROM products p, allergens a WHERE p.barcode = '8801268003602' AND a.name = 'pork' ON CONFLICT (product_id, allergen_id) DO NOTHING;
