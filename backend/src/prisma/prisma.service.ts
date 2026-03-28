import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('Conectando no banco...');
    await this.$connect();
    console.log('Banco conectado');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
