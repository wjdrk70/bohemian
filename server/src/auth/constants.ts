import { Logger } from "@nestjs/common";
export const jwtConstants = {
  // secret: "randompassword",
  secret: process.env.JWT_SECRET_KEY,
};
Logger.log(process.env.PORT + "포트");

Logger.log(process.env.JWT_SECRET_KEY + "시크릿");
