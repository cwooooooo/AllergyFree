import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('shop')
  getShop(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/shop.html'));
  }

  @Get('scan')
  getScan(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/bacode_done.html'));
  }

  @Get('profile')
  getProfile(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/profile.html'));
  }

  @Get('shop_food')
  getShopFood(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/shop_food.html'));
  }

  @Get('cart')
  getCartPage(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/cart.html'));
  }

  @Get('viewed_products')
  getViewedProducts(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/viewed_products.html'));
  }

  @Get('profile_edit')
  getProfileEdit(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/profile_edit.html'));
  }

  @Get('recipe')
  getRecipe(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/recipe.html'));
  }

  @Get('map')
  getMap(@Res() res: any) {
    return res.sendFile(join(process.cwd(), '../pages/map.html'));
  }
}
