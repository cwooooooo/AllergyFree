import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get('search/recommend')
  async getSearchRecommendations(@Query('q') query: string, @Request() req: any) {
    const userId = this.getUserIdFromRequest(req);
    return this.productsService.searchRecommendations(query || '', userId);
  }

  @Get('detail/:id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findById(Number(id));
  }

  @Get(':id/alternatives')
  async getAlternatives(@Param('id') id: string, @Request() req: any) {
    const userId = this.getUserIdFromRequest(req);
    return this.productsService.findAlternatives(Number(id), userId);
  }

  @Get(':barcode')
  async getProduct(@Param('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  private getUserIdFromRequest(req: any): number | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return undefined;
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(token, { secret });
      return payload.sub;
    } catch (e) {
      return undefined;
    }
  }
}
