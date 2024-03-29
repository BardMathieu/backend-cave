import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUserAlreadyExist } from '../../user/is-user-already-exist.validator';

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  readonly firstname: string;

  @IsDefined()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(6)
  password: Promise<void>;
  _id: string;
}
