import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../typeorm/entities/User";
import {
  CreateUserInput,
  CreateUserOutput,
  LoginInput,
  LoginOutput,
} from "./dto/input.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async registerUser(
    createUserData: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      const { email, nickname, password } = createUserData;
      const duplicateEmail = await this.UserRepository.findOne({ email });
      const duplicateNickName = await this.UserRepository.findOne({ nickname });
      const hashPassword = await bcrypt.hash(password, 10);

      if (duplicateEmail || duplicateNickName) {
        Logger.log("닉네임 or email이 중복됩니다.");
        //throw new HttpException('email already taken', HttpStatus.CONFLICT);
        return { success: false, message: "닉네임 또는 email 이 중복됩니다." };
      }

      await this.UserRepository.save(
        this.UserRepository.create({
          email,
          nickname,
          password: hashPassword,
        })
      );
      return {
        success: true,
        message: `${createUserData.nickname}님 회원가입축하드립니다`,
      };
    } catch (error) {
      Logger.log("db저장 실패!");
      return { success: false, message: "회원가입 실패" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      Logger.log(email);

      // const userEmail = await this.UserRepository.findOne({ where: { email },select:['id','password'] });
      const userEmail = await this.UserRepository.findOne({ email });
      if (!userEmail) {
        // Logger.log('이메일이 존재하지 않습니다.');
        // throw new NotFoundException('User not found');
        return { success: false, message: "이메일이 존재하지 않습니다." };
      }

      const passwordCorrect = await bcrypt.compareSync(
        password,
        userEmail.password
      );
      if (!passwordCorrect) {
        // Logger.log('비밀번호가 틀렸습니다');
        // throw new UnauthorizedException('Is wrong password');
        return { success: false, message: "비밀번호가 틀렸습니다." };
      }

      const payload = { email: email, id: userEmail.id };
      Logger.log(payload);
      const token = this.jwtService.sign(payload);
      Logger.log(token);

      // const token='token'

      return {
        success: true,
        message: `${userEmail.nickname}님이 로그인하셨습니다`,
        token,
      };

      // return `${userEmail.nickname}님이 로그인하셨습니다.`
    } catch (error) {
      // Logger.log('로그인 실패');
      return { success: false, message: "로그인 실패" };
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.UserRepository.find();
  }

  // getUser(id:number):Promise<User>{
  //   return this.UserRepository.findOne();
  // }
}
