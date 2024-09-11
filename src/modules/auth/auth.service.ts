import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('user_not_found');
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

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create({
      ...createUserDto,
      roles: Role.Admin,
    });
  }
}
