import pkg from '@prisma/client';
import 'dotenv/config';

const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

export default prisma;