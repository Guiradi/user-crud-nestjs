import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { PasswordLength } from 'src/utils/custom-validators';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Validate(PasswordLength, {
    message: 'This user password must be at least 8 characters!',
  })
  @IsNotEmpty()
  password: string;
}
