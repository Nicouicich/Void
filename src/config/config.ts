import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const enviromentVars = {
  PORT: process.env.PORT || 3000,
  LOL_API_KEY: process.env.LOL_API_KEY,
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};
