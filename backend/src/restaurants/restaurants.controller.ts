import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '../auth/auth.guard';

interface PlaceInfo {
  id: string;
  place_name: string;
  category_name: string;
  x: string;
  y: string;
  address_name: string;
  place_url: string;
}

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @UseGuards(AuthGuard)
  @Post('analyze-safe')
  async analyzeSafeRestaurants(
    @Request() req: any,
    @Body('places') places: PlaceInfo[]
  ) {
    const userId = req.user.sub;
    if (!places || !Array.isArray(places)) {
      return [];
    }
    return this.restaurantsService.analyzeNearbyRestaurants(userId, places);
  }

  @UseGuards(AuthGuard)
  @Get(':id/menu')
  async getRestaurantMenu(
    @Request() req: any,
    @Param('id') placeId: string,
    @Query('category') category?: string
  ) {
    const userId = req.user.sub;
    return this.restaurantsService.getRestaurantMenu(placeId, userId, category);
  }
}

