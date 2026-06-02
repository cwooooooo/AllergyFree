-- ==========================================
-- AllergyFree App - PostgreSQL Schema
-- ==========================================

-- 1. categories (카테고리)
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 2. allergens (알러지 정보)
CREATE TABLE allergens (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,          -- 내부 키 (e.g., milk, peanut)
    display_name VARCHAR(255) NOT NULL,         -- 표시 이름 (e.g., 우유, 땅콩)
    severity INT NOT NULL DEFAULT 1             -- 위험도
);

-- 2-1. allergen_alias (알러지 키워드 확장)
CREATE TABLE allergen_alias (
    id BIGSERIAL PRIMARY KEY,
    allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    UNIQUE (allergen_id, keyword)
);

-- 3. ingredients (성분 정보)
CREATE TABLE ingredients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE           -- 성분명
);

-- 4. users (사용자)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    birthdate VARCHAR(10),
    gender VARCHAR(10),
    recipient_name VARCHAR(255),
    address TEXT,
    detail_address TEXT,
    zipcode VARCHAR(20),
    contact_phone VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 5. products (상품)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    barcode VARCHAR(255) UNIQUE,                -- 바코드 (인덱싱 필요)
    name VARCHAR(255) NOT NULL,                 -- 상품명
    brand VARCHAR(255),                         -- 브랜드
    price INT DEFAULT 0,                        -- 가격 정보
    alternative_group VARCHAR(255),             -- 대체 상품 그룹 (e.g. 'milk')
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL, -- 카테고리 FK
    image_url TEXT,                             -- 이미지 URL
    ingredients_text TEXT,                      -- 원재료 원문
    source VARCHAR(255),                        -- 데이터 출처
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. product_ingredients (상품-성분 다대다 매핑)
CREATE TABLE product_ingredients (
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, ingredient_id)
);

-- 7. ingredient_allergens (성분-알러지 다대다 매핑)
CREATE TABLE ingredient_allergens (
    ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
    allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, allergen_id)
);

-- 8. product_allergens (상품-알러지 역정규화 테이블 ⚡)
-- 빠른 알러지 필터링을 위해 상품과 알러지를 직접 연결 (Denormalized)
CREATE TABLE product_allergens (
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, allergen_id)
);

-- 9. user_allergies (사용자-알러지 설정 매핑)
CREATE TABLE user_allergies (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, allergen_id)
);

-- 10. orders (주문 내역)
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    total_price INT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. order_items (주문 상세 항목)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price INT NOT NULL
);


-- ==========================================
-- 성능 최적화를 위한 인덱스 생성
-- ==========================================

-- 바코드로 상품 검색이 잦으므로 인덱스 생성
CREATE INDEX idx_products_barcode ON products(barcode);

-- 필터링 속도를 높이기 위한 역정규화 테이블 인덱스
CREATE INDEX idx_product_allergens_product_id ON product_allergens(product_id);
CREATE INDEX idx_product_allergens_allergen_id ON product_allergens(allergen_id);

-- 특정 사용자의 알러지 성분 조회 최적화
CREATE INDEX idx_user_allergies_user_id ON user_allergies(user_id);
