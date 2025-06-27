import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FileUploader } from './libs/utils/fileUploader.util';
import { PrismaService } from './libs/database/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    FileUploader,
    PrismaService,
  ],
})
export class AppModule { }
