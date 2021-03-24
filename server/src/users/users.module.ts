import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger, Module } from "@nestjs/common";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { User } from "../typeorm/entities/User";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/jwt.strategy";
import { ConfigService } from "@nestjs/config";

Logger.log(`${process.env.JWT_SECRET_KEY} in usermodule`);

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET_KEY"),
        signOptions: { expiresIn: "60s" },
      }),
    }),
    PassportModule,
    ConfigService,
  ],
  providers: [UsersService, UsersResolver, JwtStrategy],
})
export class UsersModule {}
