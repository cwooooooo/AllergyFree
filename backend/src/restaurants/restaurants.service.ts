import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

interface PlaceInfo {
  id: string;
  place_name: string;
  category_name: string;
  x: string;
  y: string;
  address_name: string;
  place_url: string;
}

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);

  // Fallback category mapping for allergen check if no menu is found
  private readonly fallbackCategoryMap: Record<string, string[]> = {
    // allergen name -> list of category keywords to flag as warning
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

  // Extended menu-name keyword map: maps allergen name → common dish/ingredient terms
  // found in Korean restaurant menus that imply the presence of the allergen.
  private readonly menuIngredientMap: Record<string, string[]> = {
    // ── 우유(milk) ──
    // 유제품 파생: 치즈·버터·크림·요거트 등
    // 본질적 우유 포함 요리: 피자(치즈 필수), 그라탕, 리조또, 크림파스타 등
    // 빵·디저트류: 대부분 버터/우유 반죽 사용
    milk: [
      // 치즈 종류
      '치즈', '체다', '모짜렐라', '모차렐라', '고르곤졸라', '파마산', '파르메산',
      '리코타', '마스카포네', '브리', '까망베르', '에멘탈', '할루미', '콜비잭',
      // 유제품·소스
      '크림', '버터', '요거트', '요구르트', '아이스크림', '밀크셰이크', '라떼', '카푸치노',
      '화이트소스', '베샤멜', '알프레도', '까르보나라', '카르보나라', '퐁듀',
      // 음료
      '밀크티', '핫초코', '초코', '스무디', '프라푸치노', '쉐이크',
      // 우유가 본질적으로 들어가는 요리
      '피자', '그라탕', '리조또', '크림파스타', '크림우동', '크림떡볶이',
      // 빵·디저트 (대부분 버터/우유 반죽)
      '케이크', '쿠키', '와플', '팬케이크', '크로와상', '크레페', '슈크림', '에클레어',
      '마카롱', '티라미수', '타르트', '브라우니', '마들렌', '파운드케이크',
      '카스테라', '도넛', '머핀', '스콘', '식빵', '빵', '크로켓', '베이글',
      '몽블랑', '무스', '파르페', '젤라또'
    ],

    // ── 밀(wheat) ──
    // 밀가루 반죽이 필수인 모든 요리
    wheat: [
      // 면류
      '파스타', '라면', '우동', '소바', '국수', '칼국수', '냉면', '쫄면', '잔치국수',
      '비빔국수', '막국수', '짜장', '짬뽕', '볶음면', '쌀국수',
      // 빵·도우류
      '피자', '빵', '토스트', '식빵', '베이글', '크로와상', '도우', '바게트', '치아바타',
      '난', '또띠아', '브리또', '타코', '케사디아',
      // 튀김·반죽류
      '튀김', '돈까스', '돈카츠', '카츠', '텐동', '텐푸라', '커틀렛', '크로켓',
      '프라이', '후라이', '전', '부침개', '파전', '빈대떡', '호떡', '붕어빵',
      '핫도그', '콘도그', '꽈배기',
      // 디저트·과자류
      '케이크', '쿠키', '타르트', '와플', '팬케이크', '크레페', '마카롱', '브라우니',
      '도넛', '머핀', '스콘', '파운드케이크', '카스테라', '마들렌',
      // 기타 밀가루 요리
      '만두', '교자', '샌드위치', '햄버거', '버거', '나쵸', '나초', '덮밥', '볶음밥',
      '떡볶이', '라볶이', '오므라이스', '탕수육', '탕수', '군만두',
      '수제비', '칼제비', '크림빵', '소보로', '카레라이스', '그라탕'
    ],

    // ── 계란(egg) ──
    // 직접 계란, 계란이 반죽에 필수인 요리, 소스
    egg: [
      // 직접 계란 요리
      '계란', '달걀', '에그', '오믈렛', '타마고', '스크램블', '에그베네딕트',
      '계란말이', '계란찜', '에그드랍',
      // 소스·가공
      '마요', '마요네즈', '폭탄', '타르타르소스',
      // 빵·디저트 반죽 (계란 필수)
      '케이크', '쿠키', '와플', '팬케이크', '크레페', '크로와상', '슈크림', '에클레어',
      '마카롱', '푸딩', '커스터드', '수플레', '머랭', '티라미수', '브라우니',
      '마들렌', '파운드케이크', '카스테라', '도넛', '머핀', '스콘',
      // 튀김 반죽 (계란물 사용)
      '돈까스', '돈카츠', '카츠', '크로켓', '텐푸라', '커틀렛',
      // 파스타·소스
      '까르보나라', '카르보나라', '프렌치토스트',
      // 기타
      '오므라이스', '부침개', '전', '파전', '빈대떡'
    ],

    // ── 땅콩(peanut) ──
    peanut: [
      '땅콩', '피넛', '피넛버터', '땅콩소스',
      '쌈장', '팟타이', '사테', '공갈빵'
    ],

    // ── 대두(soybean) ──
    // 한식 양념의 근간 (간장·된장·고추장 모두 대두 베이스)
    soybean: [
      '된장', '간장', '두부', '미소', '콩나물', '에다마메', '소이',
      '두유', '콩밥', '비지', '청국장', '쌈장', '고추장', '순두부',
      '마파두부', '유부', '낫또', '나또', '콩국수', '두부김치',
      '콩조림', '소이소스', '데리야끼'
    ],

    // ── 새우(shrimp) ──
    shrimp: [
      '새우', '쉬림프', '에비', '감바스', '깐풍새우', '왕새우', '대하', '중하',
      '새우튀김', '에비텐', '새우볶음', '새우깡', '새우만두', '새우칩',
      '딱새우', '꽃새우', '건새우', '젓갈'
    ],

    // ── 게(crab) ──
    crab: [
      '게', '꽃게', '킹크랩', '대게', '크랩', '홍게', '랍스터', '로브스터',
      '게살', '게장', '간장게장', '양념게장', '크래미'
    ],

    // ── 오징어(squid) ──
    squid: [
      '오징어', '낙지', '문어', '꼴뚜기', '주꾸미', '한치',
      '칼라마리', '타코야끼', '오징어볶음', '오징어튀김', '쭈꾸미',
      '낙지볶음', '문어숙회', '연포탕'
    ],

    // ── 고등어(mackerel) ──
    mackerel: [
      '고등어', '삼치', '꽁치', '청어', '정어리', '전갱이',
      '고등어조림', '고등어구이', '삼치구이'
    ],

    // ── 조개류(shellfish) ──
    shellfish: [
      '조개', '굴', '홍합', '전복', '바지락', '꼬막', '가리비', '소라',
      '모듬해물', '해물', '클램차우더', '조개구이', '조개찜',
      '굴전', '석화', '키조개', '맛조개', '재첩', '다슬기'
    ],

    // ── 쇠고기(beef) ──
    beef: [
      // 부위·브랜드
      '소고기', '쇠고기', '한우', '와규', '안심', '등심', '채끝', '립아이',
      '꽃등심', '살치살', '부채살', '토마호크', '안창살', '갈비살', '차돌',
      // 요리
      '스테이크', '갈비', '불고기', '육회', '로스트비프', '비프',
      '사골', '곰탕', '설렁탕', '갈비탕', '육개장', '소머리국밥',
      '볼로네제', '라구', '미트볼', '미트소스', '소갈비', '등갈비',
      '수육', '장조림', '편육', '갈비찜', '떡갈비'
    ],

    // ── 돼지고기(pork) ──
    pork: [
      // 부위
      '돼지', '삼겹', '삼겹살', '목살', '항정살', '갈매기살', '등갈비',
      '돼지갈비', '앞다리', '뒷다리', '가브리살',
      // 가공육
      '베이컨', '소시지', '햄', '프로슈토', '판체타', '페퍼로니', '살라미',
      '핫도그', '콘도그', '런천미트', '스팸',
      // 요리
      '보쌈', '족발', '돈까스', '돈카츠', '카츠동', '포크', '수육',
      '제육', '두루치기', '주먹밥', '돼지국밥', '순대',
      '부대찌개', '김치찌개', '감자탕', '뼈해장국', '돈코츠',
      '차슈', '챠슈', '돈부리', '토르카츠'
    ],

    // ── 닭고기(chicken) ──
    chicken: [
      // 기본
      '치킨', '닭', '닭갈비', '양념치킨', '후라이드', '간장치킨',
      '치킨너겟', '핫윙', '봉', '텐더', '순살', '닭강정',
      // 요리
      '카라아게', '난반', '삼계탕', '찜닭', '불닭', '핫치킨',
      '닭볶음탕', '닭발', '닭똥집', '닭한마리', '백숙',
      '깐풍기', '유린기', '탕수치킨', '치킨까스',
      // 국물·기타
      '닭곰탕', '닭개장', '치킨윙', '치킨텐더', '치킨스트립',
      '로티세리', '훈제치킨', '치킨버거'
    ],

    // ── 호두(walnut) ──
    walnut: ['호두', '호두파이', '호두과자', '월넛'],

    // ── 잣(pine_nut) ──
    pine_nut: ['잣', '잣죽', '잣소스'],

    // ── 복숭아(peach) ──
    peach: ['복숭아', '피치', '백도', '황도', '천도', '복숭아아이스티'],

    // ── 토마토(tomato) ──
    tomato: [
      '토마토', '살사', '마리나라', '아라비아따', '마르게리따', '뽀모도로',
      '나폴리탄', '케첩', '라구', '볼로네제', '미트소스',
      '미네스트로네', '토마토소스', '브루스케타', '가스파초'
    ],

    // ── 키위(kiwi) ──
    kiwi: ['키위', '골드키위', '그린키위'],

    // ── 견과류(nuts) ──
    nuts: [
      '아몬드', '캐슈넛', '마카다미아', '피스타치오', '헤이즐넛', '피칸',
      '잣', '호두', '밤', '은행', '브라질넛', '견과', '너트', '넛츠',
      '프랄린', '누가', '뚜레쥬르'
    ],

    // ── 해산물(seafood) ──
    seafood: [
      '해물', '해산물', '횟', '회', '스시', '사시미', '물회',
      '해물탕', '매운탕', '회덮밥', '포케', '해물파전', '해물찜',
      '모듬회', '모듬해물', '해물볶음', '해산물파스타', '씨푸드', '해물라면'
    ],

    // ── 아황산류(sulfites) ──
    sulfites: [
      '와인', '레드와인', '화이트와인', '상그리아', '포도주',
      '건과일', '건포도', '말린과일'
    ]
  };

  constructor(private readonly dbService: DatabaseService) {}

  /**
   * Get list of user allergy keywords.
   */
  async getUserAllergyKeywords(userId: number): Promise<{ name: string; keyword: string }[]> {
    const isSqlite = this.dbService.getIsSqlite();
    
    // Select all user allergy names along with their aliases and display names.
    const sql = `
      SELECT DISTINCT a.name AS allergen_name, COALESCE(aa.keyword, a.display_name) AS keyword
      FROM user_allergies ua
      JOIN allergens a ON ua.allergen_id = a.id
      LEFT JOIN allergen_alias aa ON a.id = aa.allergen_id
      WHERE ua.user_id = $1
    `;

    const rows = await this.dbService.query<any>(
      isSqlite ? sql.replace('$1', '?') : sql,
      [userId]
    );

    return rows.map(r => ({
      name: r.allergen_name,
      keyword: r.keyword,
    }));
  }

  /**
   * Analyze Kakao map places by running a quick category fallback check.
   */
  async analyzeNearbyRestaurants(userId: number, places: PlaceInfo[]) {
    // 1. Get user allergens
    const userKeywords = await this.getUserAllergyKeywords(userId);
    
    if (userKeywords.length === 0) {
      // User has no allergies, all safe
      return places.map(place => ({
        ...place,
        safety: 'safe',
        safeMenus: [],
        unsafeMenus: [],
        hasMenuData: false,
        message: '설정된 알레르기가 없어 안전합니다.',
      }));
    }

    // 2. Directly run category fallback for each restaurant to keep search fast
    return places.map(place => {
      const fallback = this.analyzeByFallback(place.category_name, userKeywords);
      return {
        ...place,
        safety: fallback.safety,
        safeMenus: [],
        unsafeMenus: [],
        hasMenuData: false,
        message: fallback.message,
      };
    });
  }

  /**
   * Scrape and analyze a specific restaurant's menu list on-demand using headless Chrome.
   */
  async getRestaurantMenu(placeId: string, userId: number) {
    const userKeywords = await this.getUserAllergyKeywords(userId);
    const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const PORT = 9222;

    const spawn = require('child_process').spawn;
    const http = require('http');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchJson = (url: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        http.get(url, (res: any) => {
          let data = '';
          res.on('data', (chunk: any) => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });
    };

    this.logger.log(`Launching headless Chrome to fetch menu for place ID: ${placeId}...`);
    
    // Spawn headless Chrome
    const chrome = spawn(CHROME_PATH, [
      '--headless',
      '--disable-gpu',
      `--remote-debugging-port=${PORT}`,
      '--no-first-run',
      '--no-default-browser-check'
    ]);

    // Wait for Chrome to boot
    await sleep(1500);

    let menus: { name: string; price: string }[] = [];
    let hasMenuData = false;

    try {
      // Connect to debug port to get WebSocket URL
      const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
      const mainTarget = targets.find((t: any) => t.type === 'page');
      if (!mainTarget) {
        throw new Error('No page target found in Chrome DevTools.');
      }

      const wsUrl = mainTarget.webSocketDebuggerUrl;
      const ws = new (globalThis as any).WebSocket(wsUrl);

      let msgId = 1;
      const send = (method: string, params: any = {}) => {
        return new Promise<any>((resolve) => {
          const currentId = msgId++;
          const onMessage = (event: any) => {
            const res = JSON.parse(event.data);
            if (res.id === currentId) {
              ws.removeEventListener('message', onMessage);
              resolve(res.result);
            }
          };
          ws.addEventListener('message', onMessage);
          ws.send(JSON.stringify({ id: currentId, method, params }));
        });
      };

      await new Promise<void>((resolve) => ws.onopen = () => resolve());

      // Navigate to Place page
      await send('Page.navigate', { url: `https://place.map.kakao.com/${placeId}#menuInfo` });

      // Wait for page rendering
      await sleep(3500);

      // Evaluate menu extraction JS (supports both .list_goods and fallback to old .list_menu)
      const evalResult = await send('Runtime.evaluate', {
        expression: `
          (() => {
            // First check list_goods (detailed text list of menu items)
            const goodsItems = document.querySelectorAll('.list_goods li');
            if (goodsItems && goodsItems.length > 0) {
              return Array.from(goodsItems).map(el => {
                const nameEl = el.querySelector('.tit_item');
                const priceEl = el.querySelector('.desc_item');
                const imgEl = el.querySelector('img');
                let imgUrl = imgEl ? imgEl.src : '';
                if (!imgUrl) {
                  const thumbDiv = el.querySelector('[style*="background-image"]');
                  if (thumbDiv) {
                    const bg = thumbDiv.style.backgroundImage;
                    const match = bg.match(/url\\(['"]?(.*?)['"]?\\)/);
                    if (match) imgUrl = match[1];
                  }
                }
                return {
                  name: nameEl ? nameEl.textContent.trim() : '',
                  price: priceEl ? priceEl.textContent.trim() : '',
                  image: imgUrl
                };
              }).filter(item => item.name);
            }

            // Fallback to list_menu (printed picture menu info)
            const menuItems = document.querySelectorAll('.list_menu li, .menuonly_type, .link_menu');
            return Array.from(menuItems).map(el => {
              const nameEl = el.querySelector('.loss_word, .txt_menu');
              const priceEl = el.querySelector('.price_menu');
              const imgEl = el.querySelector('img');
              let imgUrl = imgEl ? imgEl.src : '';
              if (!imgUrl) {
                const thumbDiv = el.querySelector('[style*="background-image"]');
                if (thumbDiv) {
                  const bg = thumbDiv.style.backgroundImage;
                  const match = bg.match(/url\\(['"]?(.*?)['"]?\\)/);
                  if (match) imgUrl = match[1];
                }
              }
              return {
                name: nameEl ? nameEl.textContent.trim() : el.innerText.split('\\n')[0],
                price: priceEl ? priceEl.textContent.trim() : (el.innerText.split('\\n')[1] || ''),
                image: imgUrl
              };
            }).filter(item => item.name);
          })()
        `,
        returnByValue: true
      });

      const extracted = evalResult?.result?.value;
      if (Array.isArray(extracted) && extracted.length > 0) {
        menus = extracted;
        hasMenuData = true;
      }

      ws.close();
    } catch (err) {
      this.logger.error(`CDP crawling failed for place ID ${placeId}: ${(err as Error).message}`);
    } finally {
      // Clean up Chrome
      chrome.kill();
    }

    if (hasMenuData && menus.length > 0) {
      const safeMenus: any[] = [];
      const unsafeMenus: any[] = [];

      // Collect user allergen names for extended ingredient check
      const userAllergenNames = [...new Set(userKeywords.map(k => k.name))];

      for (const item of menus) {
        const menuName = item.name;
        const menuNameLower = menuName.toLowerCase();
        let isItemUnsafe = false;

        // 1. Check against direct allergen alias keywords (e.g. 우유, 밀가루, 새우)
        for (const userKw of userKeywords) {
          if (menuNameLower.includes(userKw.keyword.toLowerCase())) {
            isItemUnsafe = true;
            break;
          }
        }

        // 2. Check against extended menu ingredient keywords (e.g. 치즈, 크림, 베이컨, 쉬림프)
        if (!isItemUnsafe) {
          for (const allergenName of userAllergenNames) {
            const menuTerms = this.menuIngredientMap[allergenName] || [];
            for (const term of menuTerms) {
              if (menuNameLower.includes(term.toLowerCase())) {
                isItemUnsafe = true;
                break;
              }
            }
            if (isItemUnsafe) break;
          }
        }

        const menuObj = {
          name: menuName,
          price: item.price,
          image: (item as any).image || ''
        };

        if (isItemUnsafe) {
          unsafeMenus.push(menuObj);
        } else {
          safeMenus.push(menuObj);
        }
      }

      let safety = 'safe';
      let message = '알레르기 성분이 포함된 메뉴가 없습니다.';

      if (safeMenus.length === 0) {
        safety = 'unsafe';
        message = '섭취 가능한 안전한 메뉴가 없습니다.';
      } else if (unsafeMenus.length > 0) {
        safety = 'caution';
        message = '안전한 메뉴가 있으나, 일부 메뉴에 알레르기 유발성분이 포함되어 있습니다.';
      }

      return {
        id: placeId,
        safety,
        safeMenus,
        unsafeMenus,
        hasMenuData: true,
        message
      };
    } else {
      return {
        id: placeId,
        safety: 'unknown',
        safeMenus: [],
        unsafeMenus: [],
        hasMenuData: false,
        message: '메뉴 정보가 존재하지 않습니다.'
      };
    }
  }


  /**
   * Fallback check based on category name.
   */
  private analyzeByFallback(categoryName: string, userKeywords: { name: string; keyword: string }[]): { safety: string; message: string } {
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
}
