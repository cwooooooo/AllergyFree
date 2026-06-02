import { DatabaseService } from '../database/database.service';
export declare class ProductsService {
    private dbService;
    constructor(dbService: DatabaseService);
    findAll(): Promise<{
        id: any;
        barcode: any;
        name: any;
        brand: any;
        price: any;
        alternative_group: any;
        category_name: any;
        category_id: any;
        image_url: any;
        ingredients_text: any;
        source: any;
        allergens: {
            id: any;
            name: any;
            display_name: any;
        }[];
    }[]>;
    findByBarcode(barcode: string): Promise<{
        id: any;
        barcode: any;
        name: any;
        brand: any;
        price: any;
        alternative_group: any;
        category_name: any;
        category_id: any;
        image_url: any;
        ingredients_text: any;
        source: any;
        allergens: {
            id: any;
            name: any;
            display_name: any;
        }[];
        allergy_text?: undefined;
        is_external?: undefined;
    } | {
        id: null;
        barcode: string;
        name: any;
        brand: any;
        price: null;
        alternative_group: null;
        category_name: string;
        category_id: number;
        image_url: string;
        ingredients_text: string;
        allergy_text: string;
        is_external: boolean;
        source: string;
        allergens: any[];
    }>;
    findById(id: number): Promise<{
        id: any;
        barcode: any;
        name: any;
        brand: any;
        price: any;
        alternative_group: any;
        category_name: any;
        category_id: any;
        image_url: any;
        ingredients_text: any;
        source: any;
        allergens: {
            id: any;
            name: any;
            display_name: any;
        }[];
        options: {
            id: any;
            name: any;
            price: any;
            barcode: any;
        }[];
    }>;
    findAlternatives(productId: number, userId?: number): Promise<{
        id: any;
        barcode: any;
        name: any;
        brand: any;
        price: any;
        alternative_group: any;
        category_name: any;
        category_id: any;
        image_url: any;
        ingredients_text: any;
        source: any;
        allergens: {
            id: any;
            name: any;
            display_name: any;
        }[];
    }[]>;
    searchRecommendations(queryStr: string, userId?: number): Promise<{
        id: any;
        barcode: any;
        name: any;
        brand: any;
        price: any;
        alternative_group: any;
        category_name: any;
        category_id: any;
        image_url: any;
        ingredients_text: any;
        source: any;
        allergens: {
            id: any;
            name: any;
            display_name: any;
        }[];
    }[]>;
    private mapExternalCategory;
    private mapCategoryNameToId;
    private extractBaseName;
}
