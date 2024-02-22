import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async GetProfile(@Req() req: Request): Promise<User> {
    return this.userService.getProfile(req.user);
  }
}
