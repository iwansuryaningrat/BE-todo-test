import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const options = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks, projects, and users in a task management application.')
    .setContact('Iwan Suryaningrat', 'https://iwansuryaningrat.my.id', 'iwan.suryaningrat28@gmail.com')
    .addServer('localhost:3000', "Local Server")
    .setVersion('1.0')
    .setLicense('MIT', 'https://github.com/nestjs/nest/blob/master/LICENSE')
    .addBearerAuth({
      type: 'http', scheme: 'bearer', bearerFormat: 'token', in: 'header'
    }, 'Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const setupOptions: SwaggerCustomOptions = {
    explorer: true,
    customSiteTitle: "Task Management API Documentation",
    url: "/docs",
    jsonDocumentUrl: "/docs/json",
    yamlDocumentUrl: "/docs/yaml",
    swaggerOptions: {
      filter: true,
      tagsSorter: 'alpha',
      showRequestDuration: true,
      deepLinking: true,
      displayOperationId: false,
      syntaxHighlight: {
        activate: true,
        theme: 'shades-of-purple',
      },
    },
  };

  SwaggerModule.setup('docs', app, document, setupOptions);

  const port: number = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
