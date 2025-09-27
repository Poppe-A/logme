import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: ['http://localhost:5173'], // ou 3000 selon ton frontend
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    // allowedHeaders: ['content-type'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
