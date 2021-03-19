import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/User';
import { CreateUserInput, LoginInput } from './dto/input.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async login({ email, password }: LoginInput): Promise<string> {
    try {
      Logger.log(email);

      const userEmail = await this.UserRepository.findOne({ where: { email } });
      if (!userEmail) {
        Logger.log('이메일이 존재하지 않습니다.');
        throw new NotFoundException('User not found');
      }

      const passwordCorrect = await bcrypt.compareSync(
        password,
        userEmail.password,
      );
      if (!passwordCorrect) {
        Logger.log('비밀번호가 틀렸습니다');
        throw new UnauthorizedException('Is wrong password');
      }
      Logger.log('로그인 성공')
      return `${userEmail.nickname}님 로그인 하셨습니다`;
    } catch (error) {
      Logger.log('로그인 실패');
    }
  }

  async registerUser(createUserData: CreateUserInput): Promise<User> {
    try {
      const { email, nickname, password } = createUserData;
      const duplicateEmail = await this.UserRepository.findOne({ email });
      const duplicateNickName = await this.UserRepository.findOne({ nickname });
      const hashPassword = await bcrypt.hash(password, 10);

      if (duplicateEmail || duplicateNickName) {
        Logger.log('닉네임 or email이 중복됩니다.');
        throw new HttpException('email already taken', HttpStatus.CONFLICT);
      }

      return await this.UserRepository.save(
        await this.UserRepository.create({
          email,
          nickname,
          password: hashPassword,
        }),
      );
    } catch (error) {
      Logger.log('db저장 실패!');

      // throw new HttpException('error insert query', HttpStatus.CONFLICT);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.UserRepository.find();
  }

  // getUser(id:number):Promise<User>{
  //   return this.UserRepository.findOne();
  // }
}
