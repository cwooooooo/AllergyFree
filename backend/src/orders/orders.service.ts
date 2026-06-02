import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(private dbService: DatabaseService) {}

  async createOrder(userId: number, items: { barcode: string; quantity: number }[]) {
    const isSqlite = this.dbService.getIsSqlite();

    // 1. Get products and calculate total price
    let totalPrice = 0;
    const itemsWithDetails = [];

    for (const item of items) {
      const productSql = isSqlite
        ? 'SELECT id, price FROM products WHERE barcode = ? LIMIT 1'
        : 'SELECT id, price FROM products WHERE barcode = $1 LIMIT 1';
      
      const products = await this.dbService.query<any>(productSql, [item.barcode]);
      if (products.length === 0) {
        throw new NotFoundException(`Barcode ${item.barcode}에 해당하는 상품을 찾을 수 없습니다.`);
      }
      
      const product = products[0];
      totalPrice += item.quantity * product.price;
      itemsWithDetails.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // 2. Insert into orders table
    const orderSql = isSqlite
      ? 'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)'
      : 'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id';
    
    let orderId: number;

    if (isSqlite) {
      await this.dbService.query<any>(orderSql, [userId, totalPrice, 'completed']);
      // In SQLite, we can get last_insert_rowid()
      const lastIdResult = await this.dbService.query<any>('SELECT last_insert_rowid() as id');
      orderId = lastIdResult[0].id;
    } else {
      const result = await this.dbService.query<any>(orderSql, [userId, totalPrice, 'completed']);
      orderId = result[0].id;
    }

    // 3. Insert order items
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

  async getMyOrders(userId: number) {
    const isSqlite = this.dbService.getIsSqlite();

    const ordersSql = isSqlite
      ? 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
    
    const orders = await this.dbService.query<any>(ordersSql, [userId]);

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
      
      const items = await this.dbService.query<any>(itemsSql, [order.id]);
      
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
}
