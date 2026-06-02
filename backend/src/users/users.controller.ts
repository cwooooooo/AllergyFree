import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    const userId = req.user.sub;
    return this.usersService.getProfile(userId);
  }

  @UseGuards(AuthGuard)
  @Put('allergies')
  async updateAllergies(@Request() req: any, @Body() body: { allergies: string[] }) {
    const userId = req.user.sub;
    return this.usersService.updateAllergies(userId, body.allergies);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user.sub;
    return this.usersService.updateProfile(userId, body);
  }
}
