import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { AuthHelper } from './libs/helpers';
import { AuthService } from './auth/auth.service';
import { UserService } from './users/user.service';
import { AuthController } from './auth/auth.controller';
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
    AuthController,
  ],
  providers: [
    UserService,
    AuthService,
    AuthHelper,
    FileUploader,
    PrismaService,
  ],
})
export class AppModule { }
