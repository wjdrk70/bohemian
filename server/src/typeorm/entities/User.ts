import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@InputType({ isAbstract: true })
@Entity({ name: 'users' })
@ObjectType()
export class User {
  @Field()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail({}, { message: '이메일 형식으로 작성해주세요' })
  @IsNotEmpty({ message: '이메일을 작성해주시길 바랍니다' })
  @Field((type) => String)
  @Column()
  email: string;

  @IsNotEmpty({ message: '닉네임을 작성해주시길 바랍니다' })
  @IsString()
  @Field()
  @Column()
  nickname: string;

  @IsNotEmpty({ message: '비밀번호를 작성해주시길 바랍니다' })
  @MinLength(8, { message: '비밀번호는 8자이상으로 해주세요.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: '특수문자 및 알파벳 소문자 조합으로 해주시기 바랍니다.',
  })
  @Field((type) => String)
  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updtatedAt: Date;

  @Field()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
