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
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  @ApiCreatedResponse({type: CreateUserDto})
  @Post('signup')
  async create(
    @Body() createUserDto: CreateUserDto ) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const result = await this.usersService.createUser(createUserDto.name, createUserDto.username, hashedPassword);
    return {
      message: "User successfully registered",
      name: result.name,
      username: result.username,
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(
    @Request() req,
    @Body() loginUserDto: LoginUserDto
  ): any {
    return this.authService.login(req.user);
  }

  @ApiOkResponse({type: User, isArray: true})
  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOkResponse({type: User})
  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}