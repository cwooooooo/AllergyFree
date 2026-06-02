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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let AppController = class AppController {
    getShop(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/shop.html'));
    }
    getScan(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/bacode_done.html'));
    }
    getProfile(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/profile.html'));
    }
    getShopFood(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/shop_food.html'));
    }
    getCartPage(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/cart.html'));
    }
    getViewedProducts(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/viewed_products.html'));
    }
    getProfileEdit(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/profile_edit.html'));
    }
    getRecipe(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/recipe.html'));
    }
    getMap(res) {
        return res.sendFile((0, path_1.join)(process.cwd(), '../pages/map.html'));
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('shop'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getShop", null);
__decorate([
    (0, common_1.Get)('scan'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getScan", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('shop_food'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getShopFood", null);
__decorate([
    (0, common_1.Get)('cart'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCartPage", null);
__decorate([
    (0, common_1.Get)('viewed_products'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getViewedProducts", null);
__decorate([
    (0, common_1.Get)('profile_edit'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProfileEdit", null);
__decorate([
    (0, common_1.Get)('recipe'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRecipe", null);
__decorate([
    (0, common_1.Get)('map'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMap", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map