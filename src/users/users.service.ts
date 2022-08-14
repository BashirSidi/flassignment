import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>
  ){}


  async createUser(name: string, username: string, password: string): Promise<CreateUserDto> {
    const newUser = new this.userModel({
      name,
      username,
      password,
    });
    await newUser.save();
    return newUser;
  }

  async getUsers() {
    return this.userModel.find({})
      .then((users) => users)
      .catch((err) => console.log(err));
  }

  async getUser(userName: string): Promise<CreateUserDto> {
    const username = userName.toLowerCase();
    return this.userModel.findOne({username});
  }

  async findUser(id: string): Promise<CreateUserDto> {
    return this.userModel.findById(id);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<CreateUserDto> {
    return this.userModel.findByIdAndUpdate(id, data, {new: true})
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
