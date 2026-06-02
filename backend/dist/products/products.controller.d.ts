import { ProductsService } from './products.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class ProductsController {
    private productsService;
    private jwtService;
    private configService;
    constructor(productsService: ProductsService, jwtService: JwtService, configService: ConfigService);
    getAllProducts(): Promise<{
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
    getSearchRecommendations(query: string, req: any): Promise<{
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
    getProductById(id: string): Promise<{
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
    getAlternatives(id: string, req: any): Promise<{
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
    getProduct(barcode: string): Promise<{
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
    private getUserIdFromRequest;
}
