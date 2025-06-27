import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { FileUploader } from './utils/fileUploader.util';
import { ConfigModule, ConfigService } from "@nestjs/config";

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
    FileUploader,
    AppController,
  ],
  providers: [AppService],
})
export class AppModule { }
