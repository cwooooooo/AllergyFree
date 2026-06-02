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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let OrdersService = class OrdersService {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async createOrder(userId, items) {
        const isSqlite = this.dbService.getIsSqlite();
        let totalPrice = 0;
        const itemsWithDetails = [];
        for (const item of items) {
            const productSql = isSqlite
                ? 'SELECT id, price FROM products WHERE barcode = ? LIMIT 1'
                : 'SELECT id, price FROM products WHERE barcode = $1 LIMIT 1';
            const products = await this.dbService.query(productSql, [item.barcode]);
            if (products.length === 0) {
                throw new common_1.NotFoundException(`Barcode ${item.barcode}에 해당하는 상품을 찾을 수 없습니다.`);
            }
            const product = products[0];
            totalPrice += item.quantity * product.price;
            itemsWithDetails.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            });
        }
        const orderSql = isSqlite
            ? 'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)'
            : 'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id';
        let orderId;
        if (isSqlite) {
            await this.dbService.query(orderSql, [userId, totalPrice, 'completed']);
            const lastIdResult = await this.dbService.query('SELECT last_insert_rowid() as id');
            orderId = lastIdResult[0].id;
        }
        else {
            const result = await this.dbService.query(orderSql, [userId, totalPrice, 'completed']);
            orderId = result[0].id;
        }
        for (const detail of itemsWithDetails) {
            const itemSql = isSqlite
                ? 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
                : 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)';
            await this.dbService.query(itemSql, [orderId, detail.productId, detail.quantity, detail.price]);
        }
        return {
            success: true,
            orderId,
            totalPrice,
            status: 'completed'
        };
    }
    async getMyOrders(userId) {
        const isSqlite = this.dbService.getIsSqlite();
        const ordersSql = isSqlite
            ? 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
            : 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
        const orders = await this.dbService.query(ordersSql, [userId]);
        const result = [];
        for (const order of orders) {
            const itemsSql = isSqlite
                ? `SELECT oi.quantity, oi.price, p.name, p.brand, p.image_url, p.barcode
           FROM order_items oi
           LEFT JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`
                : `SELECT oi.quantity, oi.price, p.name, p.brand, p.image_url, p.barcode
           FROM order_items oi
           LEFT JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`;
            const items = await this.dbService.query(itemsSql, [order.id]);
            result.push({
                id: order.id,
                totalPrice: order.total_price,
                status: order.status,
                createdAt: order.created_at,
                items: items.map(item => ({
                    name: item.name,
                    brand: item.brand,
                    imageUrl: item.image_url,
                    barcode: item.barcode,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
        }
        return result;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map