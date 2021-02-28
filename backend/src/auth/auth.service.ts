import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { getConnection } from 'typeorm';
import { AuthCredentialDto } from './dto/authCredential.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ success: boolean }> {
    return await this.userRepository.signUp(authCredentialDto);
  }
  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createTokens(user);

    return token;
  }
  private createTokens(
    user: User,
  ): { refreshToken: string; accessToken: string } {
    const refreshToken = this.jwtService.sign(
      { userId: user.id, tokenVersion: user.tokenVersion },
      {
        expiresIn: '14d',
      },
    );
    const accessToken = this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: '15min',
      },
    );

    return { refreshToken, accessToken };
  }

  async revokeAccessToken(user: User) {
    try {
      await getConnection()
        .getRepository(User)
        .increment({ id: user.id }, 'tokenVersion', 1);
      return { success: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getAccessToken(refreshToken: { refreshToken: string }) {
    let payload: any;

    if (!refreshToken) {
      throw new BadRequestException();
    }
    try {
      payload = await this.jwtService.verify(refreshToken.refreshToken, {
        secret: 'secret',
      });
      const user = await this.userRepository.findOne({ id: payload.userId });
      if (!user) {
        throw new BadRequestException();
      }
      if (user.tokenVersion !== payload.tokenVersion) {
        throw new BadRequestException();
      }
      return this.createTokens(user);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
