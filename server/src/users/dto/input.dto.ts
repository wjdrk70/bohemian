import { ArgsType, ObjectType, PickType,Field } from '@nestjs/graphql';
import { User } from 'src/typeorm/entities/User';

@ArgsType()
export class CreateUserInput extends PickType(
  User,
  ['email', 'nickname', 'password'],
  ArgsType,
) {}

@ObjectType()
export class CreateUserOutput{
  @Field((type) => Boolean)
  success?: boolean;
  
  @Field((type) => String, { nullable: true })
  message?: string;
}

@ArgsType()
export class LoginInput extends PickType(
  User,
  ['email', 'password'],
  ArgsType,
) {}

@ObjectType()
export class LoginOutput {
  @Field((type) => Boolean)
    success?: boolean;
    @Field((type) => String, { nullable: true })
    message?: string;
    @Field((type) => String, { nullable: true })
  token?:string;
}