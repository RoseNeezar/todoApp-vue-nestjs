import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
