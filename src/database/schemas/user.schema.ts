import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.User, enum: Role })
  role: Role;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  @Type(() => User)
  admin?: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
