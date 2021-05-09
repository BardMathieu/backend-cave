import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserUpdate } from './dto/user-update.dto';
import { IUser } from './user.interface';
import { SignUp } from '../auth/dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: SignUp) {
    user._id = uuidv4()
    const creatUser = new this.userModel(user)
    creatUser.password = await this.hashPasswords(user.password)
    return creatUser.save()
  }

  async findOne(where): Promise<any> {
    const user = await this.userModel.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }
    user.lastConnection = new Date()
    user.save()
    return user;
  }

  async update(id: number, updates: UserUpdate): Promise<IUser> {
    const found =  await this.userModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        updates,
      )
      .lean();
    if (!found) {
      throw new HttpException('contract not found', HttpStatus.NOT_FOUND);
    }
    return found
  }

  async checkPassword(plainPassword: string, password): Promise<boolean> {
    return await bcrypt.compare(plainPassword, password);
  }

  async hashPasswords(password): Promise<string> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2a\$\d+\$/.test(password)) {
      return await bcrypt.hash(password, salt);
    }
  }

}
