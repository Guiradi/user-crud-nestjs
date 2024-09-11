import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
import { CreateUserInputDto } from './dto/create-user-input.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { NotFoundException } from 'src/common/exceptions/notfound.exception';
import { ForbiddenException } from 'src/common/exceptions/forbidden.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UserContextService } from 'src/common/services/user.context.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userContextService: UserContextService,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email });
  }

  async getById(id: string): Promise<User> {
    const currentUser = this.userContextService.getUser();

    if (currentUser.role === Role.User && `${currentUser._id}` !== id) {
      throw new ForbiddenException();
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    const currentUser = this.userContextService.getUser();
    return this.userModel.find({
      $or: [{ admin: currentUser }, { _id: currentUser._id }],
    });
  }

  async register(createUserDto: CreateUserInputDto): Promise<User> {
    return this._create({
      ...createUserDto,
      role: Role.Admin,
    });
  }

  async create(createUserDto: CreateUserInputDto): Promise<User> {
    return this._create({
      ...createUserDto,
      role: Role.Admin,
      admin: this.userContextService.getUser(),
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

  private async _create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }
}
