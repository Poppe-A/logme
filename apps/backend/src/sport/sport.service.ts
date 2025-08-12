import { Injectable } from '@nestjs/common';
import { Sport } from './sport.entity';
import { Repository } from 'typeorm';
import { CreateSportDto } from './sport.types';
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

  async create(createSportDto: CreateSportDto): Promise<Sport[]> {
    await this.sportRepository.save(createSportDto);
    return this.findAll();
  }
}
