"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RestaurantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let RestaurantsService = RestaurantsService_1 = class RestaurantsService {
    dbService;
    logger = new common_1.Logger(RestaurantsService_1.name);
    fallbackCategoryMap = {
        milk: ['밀크', '카페', '라떼', '파스타', '이탈리안', '양식', '제과', '빵', '베이커리', '치즈', '피자', '아이스크림'],
        wheat: ['중식', '짜장', '짬뽕', '면', '칼국수', '우동', '라멘', '국수', '만두', '파스타', '이탈리안', '양식', '제과', '빵', '베이커리', '피자', '햄버거', '분식'],
        egg: ['제과', '빵', '베이커리', '디저트', '양식', '브런치', '오믈렛', '돈까스', '튀김', '전', '중식'],
        peanut: ['태국', '베트남', '아시아', '동남아', '제과', '빵', '베이커리', '디저트', '카페'],
        nuts: ['제과', '빵', '베이커리', '디저트', '카페', '아이스크림'],
        buckwheat: ['일식', '소바', '막국수', '냉면', '국수'],
        shrimp: ['해물', '횟집', '일식', '아시아', '태국', '중식'],
        crab: ['해물', '게', '꽃게', '아시아', '중식'],
        squid: ['해물', '오징어', '횟집', '중식', '분식'],
        mackerel: ['일식', '생선', '구이', '한식'],
        shellfish: ['해물', '조개', '칼국수', '짬뽕'],
        beef: ['고기', '갈비', '삼겹살', '소고기', '한우', '양식', '스테이크'],
        pork: ['고기', '삼겹살', '돼지', '돈까스', '족발', '보쌈', '중식'],
        chicken: ['치킨', '닭', '삼계탕', '찜닭'],
        walnut: ['제과', '빵', '베이커리', '디저트', '카페'],
        pine_nut: ['한식', '죽', '전통찻집'],
        peach: ['디저트', '카페', '과일'],
        tomato: ['파스타', '이탈리안', '양식', '피자'],
        kiwi: ['디저트', '카페', '과일'],
    };
    constructor(dbService) {
        this.dbService = dbService;
    }
    async getUserAllergyKeywords(userId) {
        const isSqlite = this.dbService.getIsSqlite();
        const sql = `
      SELECT DISTINCT a.name AS allergen_name, COALESCE(aa.keyword, a.display_name) AS keyword
      FROM user_allergies ua
      JOIN allergens a ON ua.allergen_id = a.id
      LEFT JOIN allergen_alias aa ON a.id = aa.allergen_id
      WHERE ua.user_id = $1
    `;
        const rows = await this.dbService.query(isSqlite ? sql.replace('$1', '?') : sql, [userId]);
        return rows.map(r => ({
            name: r.allergen_name,
            keyword: r.keyword,
        }));
    }
    async analyzeNearbyRestaurants(userId, places) {
        const userKeywords = await this.getUserAllergyKeywords(userId);
        if (userKeywords.length === 0) {
            return places.map(place => ({
                ...place,
                safety: 'safe',
                safeMenus: [],
                unsafeMenus: [],
                hasMenuData: false,
                message: '설정된 알레르기가 없어 안전합니다.',
            }));
        }
        const analyzedPlaces = [];
        for (const place of places) {
            try {
                const detailUrl = `https://place.map.kakao.com/main/v/${place.id}`;
                const response = await fetch(detailUrl, { signal: AbortSignal.timeout(2000) });
                if (!response.ok) {
                    throw new Error(`Failed to fetch detail for place ID: ${place.id}`);
                }
                const data = await response.json();
                const menuList = data?.menuInfo?.menuList || [];
                if (menuList.length > 0) {
                    const safeMenus = [];
                    const unsafeMenus = [];
                    for (const item of menuList) {
                        const menuName = item.menu || '';
                        let isItemUnsafe = false;
                        for (const userKw of userKeywords) {
                            if (menuName.toLowerCase().includes(userKw.keyword.toLowerCase())) {
                                isItemUnsafe = true;
                                break;
                            }
                        }
                        if (isItemUnsafe) {
                            unsafeMenus.push(menuName);
                        }
                        else {
                            safeMenus.push(menuName);
                        }
                    }
                    let safety = 'safe';
                    let message = '알레르기 성분이 포함된 메뉴가 없습니다.';
                    if (safeMenus.length === 0) {
                        safety = 'unsafe';
                        message = '섭취 가능한 안전한 메뉴가 없습니다.';
                    }
                    else if (unsafeMenus.length > 0) {
                        safety = 'caution';
                        message = '안전한 메뉴가 있으나, 일부 메뉴에 알레르기 유발성분이 포함되어 있습니다.';
                    }
                    analyzedPlaces.push({
                        ...place,
                        safety,
                        safeMenus,
                        unsafeMenus,
                        hasMenuData: true,
                        message,
                    });
                }
                else {
                    const fallback = this.analyzeByFallback(place.category_name, userKeywords);
                    analyzedPlaces.push({
                        ...place,
                        safety: fallback.safety,
                        safeMenus: [],
                        unsafeMenus: [],
                        hasMenuData: false,
                        message: fallback.message,
                    });
                }
            }
            catch (err) {
                this.logger.error(`Error analyzing place ID ${place.id}: ${err.message}`);
                const fallback = this.analyzeByFallback(place.category_name, userKeywords);
                analyzedPlaces.push({
                    ...place,
                    safety: fallback.safety,
                    safeMenus: [],
                    unsafeMenus: [],
                    hasMenuData: false,
                    message: `식당 정보 조회 중 오류가 발생하여 카테고리 정보로 대체 분석하였습니다. (${fallback.message})`,
                });
            }
        }
        return analyzedPlaces;
    }
    analyzeByFallback(categoryName, userKeywords) {
        const matchedAllergens = [];
        for (const kwInfo of userKeywords) {
            const categoryKeywords = this.fallbackCategoryMap[kwInfo.name] || [];
            const isMatch = categoryKeywords.some(catKw => categoryName.includes(catKw));
            if (isMatch) {
                matchedAllergens.push(kwInfo.keyword);
            }
        }
        if (matchedAllergens.length > 0) {
            return {
                safety: 'caution',
                message: `메뉴 정보가 없으나 업종 분류 상 주의가 필요합니다. (의심 성분: ${matchedAllergens.join(', ')})`,
            };
        }
        return {
            safety: 'safe',
            message: '메뉴 정보가 없으나 업종 분류 상 비교적 안전합니다.',
        };
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = RestaurantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map