# AllergyFree - Full Development Specification & Agent Prompt

## 1. 프로젝트 개요 (Overview)
**AllergyFree**는 식품 알레르기가 있는 사용자들이 안전하게 식품을 구매하고 섭취할 수 있도록 돕는 맞춤형 서비스입니다.
바코드를 스캔해 제품 데이터를 가져오고, 성분 분석을 통해 알레르겐을 탐지하며, 위험한 상품을 필터링해 안전한 대체 식품을 추천합니다.

---

## 2. 기술 스택 (Tech Stack)

### Frontend (웹 및 모바일 환경)
- **HTML5 & CSS3** (퍼블리싱 참고용)
- **Tailwind CSS** (커스텀 테마 적용, Utility-First CSS)
- **React / React Native** (실제 앱/웹 구현 시)
- (모바일 앱 스캐너 구현 시) `react-native-vision-camera`, `vision-camera-code-scanner`
- **아이콘 및 폰트**: Google Material Symbols Outlined, Plus Jakarta Sans, Inter

### Backend
- **Node.js (NestJS)**

### Database
- **PostgreSQL** (메인 데이터베이스)
- **Redis** (캐싱 용도 - Optional)

### External API
- **Open Food Facts** (식품 데이터 조회용)

---

## 3. 프론트엔드 핵심 페이지 및 UI 구조 (Frontend Spec)

제공된 HTML 템플릿을 기반으로 한 핵심 페이지 구조입니다.

### 3.1. 메인 대시보드 (`main.html`)
- **개인화 홈**: 사용자 이름 및 현재 설정된 알레르기 정보 표시.
- **오늘의 추천 메뉴**: 사용자 알레르기에 안전한 식단/메뉴 추천.
- **최근 확인한 안전 식품**: 가로 스크롤(Carousel) 형태의 검증 완료 상품.

### 3.2. 상품 탐색 / 쇼핑 (`shop.html`)
- **맞춤 필터**: 나의 알레르기 성분 제외 필터 및 카테고리 필터.
- **상태별 상품 카드**: `섭취 가능(Green)`, `주의 필요(Yellow)`, `섭취 불가(Red)` 시각화.

### 3.3. 상품 상세 분석 (`shop_food.html`)
- **성분 정밀 분석 (Bento 스타일)**: 전성분, 제조 공정 확인 (교차 오염), 인증 정보(HACCP 등).
- **대체 상품 추천**: 현재 상품을 대체할 수 있는 안전 상품 추천 리스트.

### 3.4. 알레르기 프로필 설정 (`profile.html`)
- **주요 알레르기 성분 선택**: 우유, 땅콩, 밀, 계란 등 주요 알레르겐 다중 선택.
- **커스텀 알레르기 추가**: 직접 검색하여 태그 형태로 추가.

### 3.5. 바코드 스캔 결과 (`bacode_done.html`)
- **스캔 시각화 및 결과**: 스캔 애니메이션 및 "Safe for You" 등의 직관적 결과.
- **성분 매치 및 교차오염 분석**: 위험 요소 개별 확인 및 교차 오염 경고.

---

## 4. 시스템 아키텍처 및 파이프라인 (System Architecture & Pipeline)

### 4.1. System Architecture
```text
[Mobile App / Web UI]
↓
[Backend API]
↓
[PostgreSQL DB] ← → [Redis]
↓
[Open Food Facts API]
```

### 4.2. Core Logic Pipeline
```text
barcode
→ DB lookup
→ (if not exists → external API)
→ ingredient parsing
→ ingredient mapping
→ allergen mapping
→ product_allergens 저장
→ user_allergy 비교
→ 결과 반환
→ 추천 생성
```

---

## 5. 데이터베이스 스키마 (Database Schema - PostgreSQL)

```sql
-- 5.1 products
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  barcode VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  brand VARCHAR(255),
  category_id BIGINT,
  image_url TEXT,
  ingredients_text TEXT,
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.2 ingredients
CREATE TABLE ingredients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- 5.3 product_ingredients
CREATE TABLE product_ingredients (
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, ingredient_id)
);

-- 5.4 allergens
CREATE TABLE allergens (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  severity INT DEFAULT 1
);

-- 5.5 ingredient_allergens
CREATE TABLE ingredient_allergens (
  ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
  allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (ingredient_id, allergen_id)
);

-- 5.6 product_allergens
CREATE TABLE product_allergens (
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, allergen_id)
);

-- 5.7 users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.8 user_allergies
CREATE TABLE user_allergies (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, allergen_id)
);

-- 5.9 categories
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- 5.10 Optional Tables
CREATE TABLE scan_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  product_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_product_allergens_allergen ON product_allergens(allergen_id);
CREATE INDEX idx_user_allergies_user ON user_allergies(user_id);
```

---

## 6. API 설계 (API Design)

### POST /scan
```json
{
  "barcode": "string",
  "user_id": 1
}
```
**Response:**
```json
{
  "product": {},
  "allergy_status": "safe | caution | danger",
  "matched_allergens": []
}
```

### GET /recommendations
```json
{
  "product_id": 1,
  "user_id": 1
}
```

---

## 7. 백엔드 핵심 로직 및 제약사항 (Backend Logic & Constraints)

- **유저 설정**: 복수의 알레르겐 등록 및 `user_allergies` 저장.
- **스캔 플로우**: DB 우선 조회 후, 없을 시 외부 API에서 데이터 패치.
- **성분 분석**: 텍스트 성분을 추출해 매핑 (Ingredient → Allergen).
- **리스크 계산**: 상품 알레르겐과 유저 알레르겐을 비교해 Risk 반환.
- **추천 로직**: 동일 카테고리 내에서 위험 상품 제외 후 안전한 상품 추천.
- **제약사항**: 빠른 필터링 요구, 결측 데이터 처리, 단순 문자열 감지 지양(정확한 매핑 필요).

이 시스템은 단순한 제품 데이터베이스가 아닙니다.
**Ingredient → Allergen → Product → User Risk → Recommendation** 로 이어지는 **추론 시스템(Inference System)** 입니다.

---

## 8. AI 에이전트 개발 지침 (Agent Prompt / Instructions)

- **백엔드/DB**: 위의 DB 스키마와 API 명세를 바탕으로 NestJS 백엔드와 PostgreSQL 데이터베이스를 구성합니다.
- **프론트엔드/UI**: 제공된 HTML/Tailwind CSS 디자인 가이드(main, shop, profile 등)를 준수하여 모바일 우선 반응형 뷰를 구성합니다. 프론트엔드 컴포넌트는 재사용 가능하도록 시맨틱 태그 구조를 유지하세요.