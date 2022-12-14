import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
  const user = await this.usersService.getUser(username);
  const passwordValid = await bcrypt.compare(password, user.password)
  if (!user) {
    throw new NotAcceptableException('user not found');
  }
  if (user && passwordValid) {
    return user;
  }
  return null;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
