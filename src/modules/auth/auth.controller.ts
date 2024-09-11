import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserInputDto } from '../users/dto/create-user-input.dto';
import { AuthExceptionFilter } from 'src/common/filters/auth.exception';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseFilters(new AuthExceptionFilter())
  login(@Body() authData: AuthDto) {
    return this.authService.login(authData.email, authData.password);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserInputDto) {
    return this.authService.register(createUserDto);
  }
}
