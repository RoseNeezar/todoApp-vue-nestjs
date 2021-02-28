import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/entities/user.entity';
import { GetUser } from 'src/utils/getUser.decor';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/authCredential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{ success: boolean }> {
    return this.authService.signUp(authCredentialDto);
  }
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    return this.authService.signIn(authCredentialDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  currentUser(@GetUser() user: User) {
    return user;
  }
}
