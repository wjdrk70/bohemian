import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../typeorm/entities/User';
import { CreateUserInput, LoginInput } from './dto/input.dto';

import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  // @Query(returns => Users)
  //   getUser(@Args('id',{type:()=>Int}) id:number):Promise<Users>{
  //     return this.usersService.getAllUsers(id);
  //   }
  @Mutation((returns) => String)
  async login(@Args() loginInput: LoginInput): Promise<string> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => [User])
  users(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Mutation((returns) => User)
  async registerUser(@Args() createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.registerUser(createUserInput);
  }
}
