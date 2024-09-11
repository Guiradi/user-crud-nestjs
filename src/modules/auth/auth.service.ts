import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/schemas/user.schema';
import { CreateUserInputDto } from '../users/dto/create-user-input.dto';
import { NotFoundException } from 'src/common/exceptions/notfound.exception';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException();
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET,
      }),
    };
  }

  async register(createUserDto: CreateUserInputDto): Promise<User> {
    return await this.usersService.register(createUserDto);
  }
}
