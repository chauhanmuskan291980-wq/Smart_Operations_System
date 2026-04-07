import pkg from '@prisma/client';
import 'dotenv/config';

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default prisma;