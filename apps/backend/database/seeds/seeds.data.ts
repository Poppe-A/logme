import { DataSource } from 'typeorm';
import { seedSports } from './sport/sport.seeder';

export async function seedData(dataSource: DataSource) {
  await seedSports(dataSource);
}
