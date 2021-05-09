import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });

    return !user;
  }

  defaultMessage(): string {
    return 'The email «$value» is already register.';
  }
}
