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
    private readonly menuIngredientMap;
    constructor(dbService: DatabaseService);
    getUserAllergyKeywords(userId: number): Promise<{
        name: string;
        keyword: string;
    }[]>;
    analyzeNearbyRestaurants(userId: number, places: PlaceInfo[]): Promise<{
        safety: string;
        safeMenus: never[];
        unsafeMenus: never[];
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
    getRestaurantMenu(placeId: string, userId: number): Promise<{
        id: string;
        safety: string;
        safeMenus: any[];
        unsafeMenus: any[];
        hasMenuData: boolean;
        message: string;
    }>;
    private analyzeByFallback;
}
export {};
