import { Logger, Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { entities } from "./typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthService } from "./auth/auth.service";
import { AuthResolver } from "./auth/auth.resolver";
import { AuthModule } from "./auth/auth.module";

let envFilePath = ".env.development";
console.log(`Running in ${process.env.ENVIRONMENT}`);
if (process.env.ENVIRONMENT === "PRODUCTION") {
  envFilePath = ".env.production";
} else if (process.env.ENVIRONMENT === "TEST") {
  envFilePath = ".env.testing";
}
Logger.log(process.env.JWT_SECRET_KEY);
Logger.log(process.env.MYSQL_DB_HOST);
Logger.log(process.env.MYSQL_DB_NAME);
Logger.log(process.env.PORT);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath }),
    GraphQLModule.forRoot({
      autoSchemaFile: "src/schema.gql",
      debug: process.env.NODE_ENV === "development",
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
export class AppModule {}
