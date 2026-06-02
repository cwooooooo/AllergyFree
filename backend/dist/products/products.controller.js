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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ProductsController = class ProductsController {
    productsService;
    jwtService;
    configService;
    constructor(productsService, jwtService, configService) {
        this.productsService = productsService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async getAllProducts() {
        return this.productsService.findAll();
    }
    async getSearchRecommendations(query, req) {
        const userId = this.getUserIdFromRequest(req);
        return this.productsService.searchRecommendations(query || '', userId);
    }
    async getProductById(id) {
        return this.productsService.findById(Number(id));
    }
    async getAlternatives(id, req) {
        const userId = this.getUserIdFromRequest(req);
        return this.productsService.findAlternatives(Number(id), userId);
    }
    async getProduct(barcode) {
        return this.productsService.findByBarcode(barcode);
    }
    getUserIdFromRequest(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return undefined;
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token)
            return undefined;
        try {
            const secret = this.configService.get('JWT_SECRET');
            const payload = this.jwtService.verify(token, { secret });
            return payload.sub;
        }
        catch (e) {
            return undefined;
        }
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('search/recommend'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getSearchRecommendations", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)(':id/alternatives'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAlternatives", null);
__decorate([
    (0, common_1.Get)(':barcode'),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map