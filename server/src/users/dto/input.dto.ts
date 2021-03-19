import { ArgsType, PickType } from '@nestjs/graphql';
import { User } from 'src/typeorm/entities/User';

@ArgsType()
export class CreateUserInput extends PickType(
  User,
  ['email', 'nickname', 'password'],
  ArgsType,
) {}

@ArgsType()
export class LoginInput extends PickType(
  User,
  ['email', 'password'],
  ArgsType,
) {}
