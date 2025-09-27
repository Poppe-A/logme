import { Injectable } from '@nestjs/common';
import { Sport } from './sport.entity';
import { Repository } from 'typeorm';
import { CreateOrUpdateSportDto } from './sport.types';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport)
    private sportRepository: Repository<Sport>,
  ) {}

  findAll(): Promise<Sport[]> {
    return this.sportRepository.find();
  }

  async create(createSportDto: CreateOrUpdateSportDto): Promise<Sport[]> {
    await this.sportRepository.save(createSportDto);
    return this.findAll();
  }

  async update(
    id: Sport['id'],
    updateSportDto: CreateOrUpdateSportDto,
  ): Promise<Sport[]> {
    await this.sportRepository.update({ id }, updateSportDto);
    return this.findAll();
  }
}
