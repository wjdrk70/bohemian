import { Logger, Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { entities } from "./typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthService } from "./auth/auth.service";
import { AuthResolver } from "./auth/auth.resolver";
import { AuthModule } from "./auth/auth.module";

import * as Joi from "joi";

let envFilePath = ".env.development";
Logger.log(`Running in ${process.env.ENVIRONMENT}`);
Logger.log(process.env.ENVIRONMENT);
Logger.log(process.env.MYSQL_DB_HOST);
Logger.log(process.env.MYSQL_DB_NAME);
Logger.log(process.env.PORT);
if (process.env.ENVIRONMENT === "PRODUCTION") {
  envFilePath = ".env.production";
} else if (process.env.ENVIRONMENT === "TEST") {
  envFilePath = ".env.testing";
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("DEVELOPMENT", "PRODUCTION", "TEST")
          .required(),
        //DB_HOST: Joi.string().required(),
      }),
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: "src/schema.gql",
      debug: process.env.NODE_ENV === "DEVELOPMENT",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_DB_HOST,
      port: Number.parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASS,
      database: process.env.MYSQL_DB_NAME,
      entities,
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AuthService, AuthResolver],
})
export class AppModule {
  // private configService: ConfigService;
}
