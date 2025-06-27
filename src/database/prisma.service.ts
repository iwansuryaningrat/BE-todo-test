import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.$executeRawUnsafe(`SET TIME ZONE 'Asia/Jakarta'`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}