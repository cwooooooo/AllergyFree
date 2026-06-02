import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any, body: {
        items: {
            barcode: string;
            quantity: number;
        }[];
    }): Promise<{
        success: boolean;
        orderId: number;
        totalPrice: number;
        status: string;
    }>;
    getMyOrders(req: any): Promise<{
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
