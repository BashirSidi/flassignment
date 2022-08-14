import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import{ ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET' // i will later add this in .env file 
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUser(payload.sub);
    return {
      user
    }
  };
}