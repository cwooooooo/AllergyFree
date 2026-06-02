import { DatabaseService } from '../database/database.service';
export declare class OrdersService {
    private dbService;
    constructor(dbService: DatabaseService);
    createOrder(userId: number, items: {
        barcode: string;
        quantity: number;
    }[]): Promise<{
        success: boolean;
        orderId: number;
        totalPrice: number;
        status: string;
    }>;
    getMyOrders(userId: number): Promise<{
        id: any;
        totalPrice: any;
        status: any;
        createdAt: any;
        items: {
            name: any;
            brand: any;
            imageUrl: any;
            barcode: any;
            quantity: any;
            price: any;
        }[];
    }[]>;
}
