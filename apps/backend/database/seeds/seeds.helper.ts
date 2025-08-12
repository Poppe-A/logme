import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { seedData } from './seeds.data';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  await seedData(dataSource);
  await dataSource.destroy();
  await app.close();
  process.exit(0);
}
runSeeder();
