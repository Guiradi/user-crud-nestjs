import { IntersectionType } from '@nestjs/mapped-types';
import { CreateUserInputDto } from './create-user-input.dto';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/database/schemas/user.schema';

export class UserRoleInfoDto {
  role?: Role;
  admin?: User;
}
export class CreateUserDto extends IntersectionType(
  CreateUserInputDto,
  UserRoleInfoDto,
) {}
