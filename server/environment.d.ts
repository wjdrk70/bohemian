import { Logger } from "@nestjs/common";

declare namespace NodeJS {
  export interface ProcessEnv {
    MYSQL_DB_HOST?: string;
    MYSQL_DB_PORT?: string;
    MYSQL_DB_USER?: string;
    MYSQL_DB_PASS?: string;
    MYSQL_DB_NAME?: string;
    JWT_SECRET_KEY?: string;
    PORT?: string;
    ENVIRONMENT: Environment;
  }

  export type Environment = "DEVELOPMENT" | "PRODUCTION" | "TEST";
}
