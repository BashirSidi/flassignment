import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  @Post('signup')
  async create(
    @Body('name') name: string,
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await this.usersService.createUser(name, username, hashedPassword);
    return {
      message: "User successfully registered",
      name: result.name,
      username: result.username,
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  sayHi(@Request() req): any{
    return req.user
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
