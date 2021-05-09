import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from './user.interface';
import {v4 as uuidv4 } from 'uuid'

export type UserDocument = IUser & Document;

@Schema()
export class User {

  @Prop()
  _id: string = uuidv4()

  @Prop({ required: true })
  firstname: string;

  @Prop({default: ['default']})
  role: string[]

  @Prop()
  lastname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({default: new Date()})
  createdAt: Date;

  @Prop({default: new Date()})
  lastConnection: Date;

}
export const UserSchema = SchemaFactory.createForClass(User);

