import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { AuthHelper } from './libs/helpers';
import { AuthService } from './auth/auth.service';
import { UserService } from './users/user.service';
import { CronUtil, FileUploader } from './libs/utils';
import { AuthController } from './auth/auth.controller';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaService } from './libs/database/prisma.service';
import { UserController } from './users/user.controller';

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
    AuthController,
    UserController,
  ],
  providers: [
    CronUtil,
    UserService,
    AuthService,
    AuthHelper,
    FileUploader,
    PrismaService,
  ],
})
export class AppModule { }
