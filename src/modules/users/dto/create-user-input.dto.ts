import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserInputDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'Invalid email address',
    },
  )
  email: string;

  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;
}
