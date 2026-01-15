import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('ping')
  @Roles('admin')
  ping(@CurrentUser() user: any) {
    return {
      message: '🎉 Admin access granted!',
      user: {
        id: user.userId,
        email: user.email,
        roles: user.roles,
      },
      timestamp: new Date(),
    };
  }

  @Get('dashboard')
  @Roles('admin', 'moderator')
  dashboard(@CurrentUser() user: any) {
    return {
      message: 'Welcome to admin dashboard',
      user: user.email,
      roles: user.roles,
    };
  }
}