import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,);

  const config = new DocumentBuilder()
    .setTitle('Frozen Logic Assignment')
    .setDescription('Simple service in NestJS that manages currency exchange rates')
    .setVersion('1.0.0.1')
    .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();