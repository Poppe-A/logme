import { DataSource } from 'typeorm';
import { Sport } from '../../../src/sport/sport.entity';

export async function seedSports(dataSource: DataSource): Promise<void> {
  const sports = [{ name: 'Musculation' }, { name: 'Running' }];
  const sportRepository = dataSource.getRepository(Sport);
  await sportRepository.save(sports);
}
