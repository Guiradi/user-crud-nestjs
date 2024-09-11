import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { NotFoundException } from 'src/common/exceptions/notfound.exception';
import { ForbiddenException } from 'src/common/exceptions/forbidden.exception';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email });
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.roles === Role.User && user.id !== id) {
      throw new ForbiddenException();
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(createUserDto: CreateUserDto, isAdmin?: boolean): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      roles: isAdmin ? Role.Admin : Role.User,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.getById(id);
    await this.userModel.findByIdAndDelete(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }
}
