import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    try {
      return await this.userModel.findOne({ email });
    } catch {
      throw new NotFoundException();
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this._create(createUserDto);
  }

  async findById(id: string): Promise<User | undefined> {
    // verificar se é o usuário lgoado ou admin
    try {
      return await this.userModel.findById(id);
    } catch {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this._create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // verificar se é o usuário lgoado
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto?.email !== user.email) {
      await this.checkEmail(updateUserDto.email);
    }

    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string): Promise<void> {
    // verificar se é o usuário lgoado
    await this.userModel.findByIdAndDelete(id);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  private async _create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkEmail(createUserDto.email);
    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  private async checkEmail(email: string) {
    const alreadyExists = await this.findOne(email);

    if (alreadyExists) {
      throw new ConflictException('email_already_used');
    }
  }
}
