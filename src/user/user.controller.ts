import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service'; // Import AuthService
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.userService.register(body.username, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('finduser')
  async finduser(@Body() body: { username: string }) {
    return this.userService.findUser(body.username);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
