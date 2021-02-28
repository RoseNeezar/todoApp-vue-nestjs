import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/auth/repository/user.repository';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from './jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
      ignoreExpiration: false,
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;
    const user = await this.userRepository.findOne({ id: userId });
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
