import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserContextService } from 'src/common/services/user.context.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UserContextService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
