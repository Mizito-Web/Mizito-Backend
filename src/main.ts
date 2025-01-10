import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { getThemeSync } from '@intelika/swagger-theme';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };
  const config = new DocumentBuilder()
    .setTitle('Mizito APIs')
    .setDescription('All APIs are here now.')
    .setVersion('1.0')
    .addTag('Mizito')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api-doc', app, document, {
    customCss: getThemeSync().toString(),
  });
  await app.listen(3000);
}
bootstrap();
