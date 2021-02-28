import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AuthCredentialDto } from '../dto/authCredential.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ success: boolean }> {
    const { password, email } = authCredentialDto;

    try {
      const user: Partial<User> = {
        email,
        password: await this.hashPassword(password),
      };
      await User.create(user).save();
      return { success: true };
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialDto: AuthCredentialDto,
  ): Promise<User> {
    const { password, email } = authCredentialDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
