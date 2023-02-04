import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const enviromentVars = {
  TEST_PORT: process.env.TEST_PORT,
  LOL_API_KEY: process.env.LOL_API_KEY,
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_TEST_USERNAME: process.env.DB_TEST_USERNAME,
  DB_TEST_PASSWORD: process.env.DB_TEST_PASSWORD,
  DB_TEST_NAME: process.env.DB_TEST_NAME,
};
