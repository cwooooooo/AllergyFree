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
export declare class RestaurantsService {
    private readonly dbService;
    private readonly logger;
    private readonly fallbackCategoryMap;
    constructor(dbService: DatabaseService);
    getUserAllergyKeywords(userId: number): Promise<{
        name: string;
        keyword: string;
    }[]>;
    analyzeNearbyRestaurants(userId: number, places: PlaceInfo[]): Promise<{
        safety: string;
        safeMenus: string[];
        unsafeMenus: string[];
        hasMenuData: boolean;
        message: string;
        id: string;
        place_name: string;
        category_name: string;
        x: string;
        y: string;
        address_name: string;
        place_url: string;
    }[]>;
    private analyzeByFallback;
}
export {};
