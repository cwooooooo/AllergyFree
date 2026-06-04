import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProductsService {
  constructor(private dbService: DatabaseService) {}

  async findAll() {
    const isSqlite = this.dbService.getIsSqlite();
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const products = await this.dbService.query<any>(sql);
    
    const results = [];
    for (const product of products) {
      const allergensSql = `
        SELECT a.id, a.name, a.display_name
        FROM product_allergens pa
        JOIN allergens a ON pa.allergen_id = a.id
        WHERE pa.product_id = $1
      `;
      const allergens = await this.dbService.query<any>(
        isSqlite ? allergensSql.replace('$1', '?') : allergensSql,
        [product.id]
      );
      results.push({
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
        price: product.price,
        alternative_group: product.alternative_group,
        category_name: product.category_name,
        category_id: product.category_id,
        image_url: product.image_url,
        ingredients_text: product.ingredients_text,
        source: product.source,
        allergens: allergens.map(a => ({
          id: a.id,
          name: a.name,
          display_name: a.display_name
        }))
      });
    }
    return results;
  }

  async findByBarcode(barcode: string) {
    const isSqlite = this.dbService.getIsSqlite();

    let row: any = null;
    let isC005 = false;

    // 1. Check Food Safety Korea I2570 OpenAPI
    try {
      const foodSafetyUrl = `https://openapi.foodsafetykorea.go.kr/api/a221b8145b894fa99895/I2570/json/1/1/BRCD_NO=${barcode}`;
      const foodSafetyRes = await fetch(foodSafetyUrl);
      if (foodSafetyRes.ok) {
        const foodSafetyJson = (await foodSafetyRes.json()) as any;
        const resultObj = foodSafetyJson['I2570'];
        if (resultObj && resultObj.total_count !== '0' && resultObj.row && resultObj.row.length > 0) {
          row = resultObj.row[0];
        }
      }
    } catch (e) {
      console.error('I2570 query failed:', e);
    }

    // 2. If I2570 has no data, query C005 OpenAPI
    if (!row) {
      try {
        const c005Url = `https://openapi.foodsafetykorea.go.kr/api/a221b8145b894fa99895/C005/json/1/5/BAR_CD=${barcode}`;
        const c005Res = await fetch(c005Url);
        if (c005Res.ok) {
          const c005Json = (await c005Res.json()) as any;
          const resultObj = c005Json['C005'];
          if (resultObj && resultObj.total_count !== '0' && resultObj.row && resultObj.row.length > 0) {
            row = resultObj.row[0];
            isC005 = true;
          }
        }
      } catch (e) {
        console.error('C005 query failed:', e);
      }
    }

    // 3. Fallback to Local DB if not found in any OpenAPI (keeps seeded database items functional)
    if (!row) {
      const productSql = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.barcode = $1 LIMIT 1
      `;
      const products = await this.dbService.query<any>(
        isSqlite ? productSql.replace('$1', '?') : productSql,
        [barcode]
      );

      if (products.length > 0) {
        const product = products[0];
        const allergensSql = `
          SELECT a.id, a.name, a.display_name
          FROM product_allergens pa
          JOIN allergens a ON pa.allergen_id = a.id
          WHERE pa.product_id = $1
        `;
        const allergens = await this.dbService.query<any>(
          isSqlite ? allergensSql.replace('$1', '?') : allergensSql,
          [product.id]
        );

        return {
          id: product.id,
          barcode: product.barcode,
          name: product.name,
          brand: product.brand,
          price: product.price,
          alternative_group: product.alternative_group,
          category_name: product.category_name,
          category_id: product.category_id,
          image_url: product.image_url,
          ingredients_text: product.ingredients_text,
          source: product.source,
          allergens: allergens.map(a => ({
            id: a.id,
            name: a.name,
            display_name: a.display_name
          }))
        };
      } else {
        throw new NotFoundException('잘못된 상품입니다.');
      }
    }

    // 4. If found in OpenAPI, fetch details using CertImgListServiceV3 with prdlstReportNo
    const prdlstReportNo = row.PRDLST_REPORT_NO;
    const fallbackName = isC005 ? (row.PRDLST_NM || '알수없음') : (row.PRDT_NM || '알수없음');
    const fallbackBrand = isC005 ? (row.BSSH_NM || '알수없음') : (row.CMPNY_NM || '알수없음');
    const prdkind = isC005 ? (row.PRDLST_DCNM || '기타') : (row.PRDLST_NM || '기타');

    let rawmtrl = '정보 없음';
    let allergy = '알수없음';
    let imgurl1 = '';
    let prdlstNm = fallbackName;
    let seller = fallbackBrand;

    if (prdlstReportNo) {
      try {
        const certImgUrl = `https://apis.data.go.kr/B553748/CertImgListServiceV3/getCertImgListServiceV3?ServiceKey=0817e17df09377b55068ee9c36f6dc7409d0589faabeb08355fe600c12208174&prdlstReportNo=${prdlstReportNo}`;
        const certImgRes = await fetch(certImgUrl);
        if (certImgRes.ok) {
          const xml = await certImgRes.text();

          const extractTag = (tag: string): string => {
            const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
            return match ? match[1].trim() : '';
          };

          const certNm = extractTag('prdlstNm');
          if (certNm && certNm !== '알수없음') prdlstNm = certNm;

          const certRaw = extractTag('rawmtrl');
          if (certRaw && certRaw !== '알수없음') rawmtrl = certRaw;

          const certAllergy = extractTag('allergy');
          if (certAllergy && certAllergy !== '알수없음') allergy = certAllergy;

          const certImg = extractTag('imgurl1');
          if (certImg && certImg !== '알수없음') imgurl1 = certImg;

          const certSeller = extractTag('seller');
          if (certSeller && certSeller !== '알수없음') seller = certSeller;
        }
      } catch (e) {
        console.error('CertImg API call failed:', e);
      }
    }

    // Detect allergens
    const detectedAllergens: any[] = [];
    const textToSearch = `${rawmtrl} ${allergy}`.toLowerCase();

    // Fetch all allergen aliases from database
    const aliasesSql = `
      SELECT aa.keyword, a.id as allergen_id, a.name, a.display_name
      FROM allergen_alias aa
      JOIN allergens a ON aa.allergen_id = a.id
    `;
    const aliases = await this.dbService.query<any>(aliasesSql);

    const matchedAllergenIds = new Set<number>();
    for (const alias of aliases) {
      if (textToSearch.includes(alias.keyword.toLowerCase())) {
        if (!matchedAllergenIds.has(alias.allergen_id)) {
          matchedAllergenIds.add(alias.allergen_id);
          detectedAllergens.push({
            id: alias.allergen_id,
            name: alias.name,
            display_name: alias.display_name,
          });
        }
      }
    }

    return {
      id: null,
      barcode: barcode,
      name: prdlstNm,
      brand: seller,
      price: null,
      alternative_group: null,
      category_name: this.mapExternalCategory(prdkind),
      category_id: this.mapCategoryNameToId(this.mapExternalCategory(prdkind)),
      image_url: imgurl1 || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      ingredients_text: rawmtrl,
      allergy_text: allergy,
      is_external: true,
      source: 'external',
      allergens: detectedAllergens,
    };
  }

  async findById(id: number) {
    const isSqlite = this.dbService.getIsSqlite();
    const productSql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 LIMIT 1
    `;
    const products = await this.dbService.query<any>(
      isSqlite ? productSql.replace('$1', '?') : productSql,
      [id]
    );
    if (products.length === 0) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
    const product = products[0];
    const allergensSql = `
      SELECT a.id, a.name, a.display_name
      FROM product_allergens pa
      JOIN allergens a ON pa.allergen_id = a.id
      WHERE pa.product_id = $1
    `;
    const allergens = await this.dbService.query<any>(
      isSqlite ? allergensSql.replace('$1', '?') : allergensSql,
      [product.id]
    );

    // Get sibling options
    const baseName = this.extractBaseName(product.name);
    const siblingsSql = `
      SELECT p.id, p.name, p.price, p.barcode
      FROM products p
      WHERE p.category_id = $1
    `;
    const siblings = await this.dbService.query<any>(
      isSqlite ? siblingsSql.replace('$1', '?') : siblingsSql,
      [product.category_id]
    );

    const options = siblings
      .filter(s => this.extractBaseName(s.name) === baseName)
      .map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        barcode: s.barcode
      }));

    return {
      id: product.id,
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      price: product.price,
      alternative_group: product.alternative_group,
      category_name: product.category_name,
      category_id: product.category_id,
      image_url: product.image_url,
      ingredients_text: product.ingredients_text,
      source: product.source,
      allergens: allergens.map(a => ({
        id: a.id,
        name: a.name,
        display_name: a.display_name
      })),
      options
    };
  }

  async findAlternatives(productId: number, userId?: number) {
    const isSqlite = this.dbService.getIsSqlite();
    const productSql = `SELECT alternative_group, category_id FROM products WHERE id = $1 LIMIT 1`;
    const products = await this.dbService.query<any>(
      isSqlite ? productSql.replace('$1', '?') : productSql,
      [productId]
    );
    if (products.length === 0) {
      return [];
    }
    const group = products[0].alternative_group;
    const categoryId = products[0].category_id;
    if (!group && !categoryId) {
      return [];
    }

    let sql = '';
    let params: any[] = [];
    if (isSqlite) {
      if (userId) {
        sql = `
          SELECT p.*, c.name as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (
              (? IS NOT NULL AND p.alternative_group = ?)
              OR p.category_id = ?
            )
            AND p.id != ?
            AND NOT EXISTS (
              SELECT 1
              FROM product_allergens pa
              JOIN user_allergies ua ON pa.allergen_id = ua.allergen_id
              WHERE pa.product_id = p.id
                AND ua.user_id = ?
            )
          ORDER BY 
            CASE WHEN (? IS NOT NULL AND p.alternative_group = ?) THEN 1 ELSE 2 END ASC,
            p.id DESC
        `;
        params = [group, group, categoryId, productId, userId, group, group];
      } else {
        sql = `
          SELECT p.*, c.name as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (
              (? IS NOT NULL AND p.alternative_group = ?)
              OR p.category_id = ?
            )
            AND p.id != ?
          ORDER BY 
            CASE WHEN (? IS NOT NULL AND p.alternative_group = ?) THEN 1 ELSE 2 END ASC,
            p.id DESC
        `;
        params = [group, group, categoryId, productId, group, group];
      }
    } else {
      if (userId) {
        sql = `
          SELECT p.*, c.name as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (
              ($1 IS NOT NULL AND p.alternative_group = $1)
              OR p.category_id = $2
            )
            AND p.id != $3
            AND NOT EXISTS (
              SELECT 1
              FROM product_allergens pa
              JOIN user_allergies ua ON pa.allergen_id = ua.allergen_id
              WHERE pa.product_id = p.id
                AND ua.user_id = $4
            )
          ORDER BY 
            CASE WHEN ($1 IS NOT NULL AND p.alternative_group = $1) THEN 1 ELSE 2 END ASC,
            p.id DESC
        `;
        params = [group, categoryId, productId, userId];
      } else {
        sql = `
          SELECT p.*, c.name as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (
              ($1 IS NOT NULL AND p.alternative_group = $1)
              OR p.category_id = $2
            )
            AND p.id != $3
          ORDER BY 
            CASE WHEN ($1 IS NOT NULL AND p.alternative_group = $1) THEN 1 ELSE 2 END ASC,
            p.id DESC
        `;
        params = [group, categoryId, productId];
      }
    }

    const rows = await this.dbService.query<any>(sql, params);
    
    const results = [];
    for (const product of rows) {
      const allergensSql = `
        SELECT a.id, a.name, a.display_name
        FROM product_allergens pa
        JOIN allergens a ON pa.allergen_id = a.id
        WHERE pa.product_id = $1
      `;
      const allergens = await this.dbService.query<any>(
        isSqlite ? allergensSql.replace('$1', '?') : allergensSql,
        [product.id]
      );
      results.push({
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
        price: product.price,
        alternative_group: product.alternative_group,
        category_name: product.category_name,
        category_id: product.category_id,
        image_url: product.image_url,
        ingredients_text: product.ingredients_text,
        source: product.source,
        allergens: allergens.map(a => ({
          id: a.id,
          name: a.name,
          display_name: a.display_name
        }))
      });
    }
    return results;
  }

  async searchRecommendations(queryStr: string, userId?: number) {
    const isSqlite = this.dbService.getIsSqlite();
    
    // 1. Try to find category matching the query
    let categoryId: number | null = null;
    const catSql = `SELECT id FROM categories WHERE name LIKE $1 LIMIT 1`;
    const cats = await this.dbService.query<any>(
      isSqlite ? catSql.replace('$1', '?') : catSql,
      [`%${queryStr}%`]
    );
    if (cats.length > 0) {
      categoryId = cats[0].id;
    } else {
      // 2. Try to find the category of products matching the name/brand
      const prodCatSql = `
        SELECT category_id, COUNT(*) as cnt
        FROM products
        WHERE name LIKE $1 OR brand LIKE $1
        GROUP BY category_id
        ORDER BY cnt DESC LIMIT 1
      `;
      const prodCats = await this.dbService.query<any>(
        isSqlite ? prodCatSql.replace('$1', '?') : prodCatSql,
        [`%${queryStr}%`]
      );
      if (prodCats.length > 0 && prodCats[0].category_id) {
        categoryId = prodCats[0].category_id;
      }
    }

    if (!categoryId) {
      return [];
    }

    let sql = '';
    let params: any[] = [];
    if (userId) {
      sql = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = $1
          AND NOT EXISTS (
            SELECT 1
            FROM product_allergens pa
            JOIN user_allergies ua ON pa.allergen_id = ua.allergen_id
            WHERE pa.product_id = p.id
              AND ua.user_id = $2
          )
      `;
      params = [categoryId, userId];
    } else {
      sql = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = $1
      `;
      params = [categoryId];
    }

    if (isSqlite) {
      sql = sql.replace(/\$1/g, '?').replace(/\$2/g, '?');
    }

    const rows = await this.dbService.query<any>(sql, params);
    
    const results = [];
    for (const product of rows) {
      const allergensSql = `
        SELECT a.id, a.name, a.display_name
        FROM product_allergens pa
        JOIN allergens a ON pa.allergen_id = a.id
        WHERE pa.product_id = $1
      `;
      const allergens = await this.dbService.query<any>(
        isSqlite ? allergensSql.replace('$1', '?') : allergensSql,
        [product.id]
      );
      results.push({
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
        price: product.price,
        alternative_group: product.alternative_group,
        category_name: product.category_name,
        category_id: product.category_id,
        image_url: product.image_url,
        ingredients_text: product.ingredients_text,
        source: product.source,
        allergens: allergens.map(a => ({
          id: a.id,
          name: a.name,
          display_name: a.display_name
        }))
      });
    }
    return results;
  }

  private mapExternalCategory(prdkind: string): string {
    const kind = prdkind.toLowerCase();
    
    // 1. Check Dairy keywords
    if (
      kind.includes('우유') || 
      kind.includes('유제품') || 
      kind.includes('치즈') || 
      kind.includes('버터') || 
      kind.includes('크림') || 
      kind.includes('요구르트') || 
      kind.includes('발효유') || 
      kind.includes('분유') || 
      kind.includes('유음료') || 
      kind.includes('아이스크림')
    ) {
      return '유제품';
    }
    
    // 2. Check Bakery keywords
    if (
      kind.includes('빵') || 
      kind.includes('케이크') || 
      kind.includes('도넛') || 
      kind.includes('식빵') || 
      kind.includes('베이커리') ||
      kind.includes('파이') ||
      kind.includes('쿠키') ||
      kind.includes('타르트')
    ) {
      return '베이커리';
    }
    
    // 3. Check Beverage keywords
    if (
      kind.includes('음료') || 
      kind.includes('차') || 
      kind.includes('주스') || 
      kind.includes('두유') || 
      kind.includes('커피') || 
      kind.includes('워터') || 
      kind.includes('탄산') || 
      kind.includes('액상') ||
      kind.includes('에이드') ||
      kind.includes('밀크') ||
      kind.includes('milk')
    ) {
      return '음료';
    }
    
    // 4. Check Snack keywords
    if (
      kind.includes('과자') || 
      kind.includes('초콜릿') || 
      kind.includes('캔디') || 
      kind.includes('젤리') || 
      kind.includes('껌') || 
      kind.includes('잼') || 
      kind.includes('스낵') || 
      kind.includes('칩') || 
      kind.includes('양갱') || 
      kind.includes('비스킷') || 
      kind.includes('크래커') ||
      kind.includes('초코')
    ) {
      return '간식';
    }
    
    // Fallback to '간식' as default if unknown
    return '간식';
  }

  private mapCategoryNameToId(name: string): number {
    switch (name) {
      case '간식': return 1;
      case '음료': return 2;
      case '유제품': return 3;
      case '베이커리': return 4;
      default: return 1;
    }
  }

  private extractBaseName(name: string): string {
    return name
      // 1. Remove Unicode replacement character and corrupted parenthesized prefix (e.g. ())
      .replace(/[\uFFFD]/g, '')
      .replace(/\([^)]\)/g, '')
      .replace(/^㈜\S*\s*/gi, '')
      .replace(/^\(주\)\s*/gi, '')
      .replace(/^주\)\s*/gi, '')
      .replace(/^\(주\)\S+\s*/gi, '')
      .replace(/^\S+\)\s*/gi, '')
      .replace(/^\S+_\s*/gi, '')
      .replace(/^(서울우유|매일유업|남양유업|빙그레|동원|풀무원|삼립식품|삼립|샤니|오리온|롯데제과|롯데|농심|해태제과|해태|크라운제과|크라운|오뚜기|동아오츠카|삼육식품|삼육)\s*/gi, '')
      // 2. Remove capacity and unit metrics
      .replace(/\d+(\.\d+)?\s*(ml|g|l|ea|개|입|번들|봉|팩|p)\b/gi, '')
      .replace(/\b\d+(\.\d+)?\s*(밀리리터|그램|리터|개)\b/g, '')
      .replace(/\s*x\s*\d+\s*(ea|개|입)?/gi, '')
      .replace(/\s*\*\s*\d+/g, '')
      .replace(/\d+입/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
