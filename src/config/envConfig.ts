
import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  MAILER_HOST: process.env.MAILER_HOST,
  MAILER_PORT: process.env.MAILER_PORT,
  MAILER_USER: process.env.MAILER_USER,
  MAILER_PASS: process.env.MAILER_PASS,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  FIREBASE_ADMIN_KEY: process.env.FIREBASE_ADMIN_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL,
  ASAAS_API_URL: process.env.ASAAS_API_URL,
  ASAAS_API_KEY: process.env.ASAAS_API_KEY,
};
