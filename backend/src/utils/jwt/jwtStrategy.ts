import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    console.log('payload', payload);
    const { userId } = payload;
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
