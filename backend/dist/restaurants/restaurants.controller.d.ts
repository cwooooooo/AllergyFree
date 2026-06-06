import { RestaurantsService } from './restaurants.service';
interface PlaceInfo {
    id: string;
    place_name: string;
    category_name: string;
    x: string;
    y: string;
    address_name: string;
    place_url: string;
}
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    analyzeSafeRestaurants(req: any, places: PlaceInfo[]): Promise<{
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
    getRestaurantMenu(req: any, placeId: string): Promise<{
        id: string;
        safety: string;
        safeMenus: any[];
        unsafeMenus: any[];
        hasMenuData: boolean;
        message: string;
    }>;
}
export {};
