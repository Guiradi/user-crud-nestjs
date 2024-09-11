import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  roles: Role;
}
