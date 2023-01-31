import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const enviromentVars = {
  PORT: process.env.PORT || 3000,
  LOL_API_KEY: process.env.LOL_API_KEY,
};
