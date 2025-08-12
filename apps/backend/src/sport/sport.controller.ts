import { Body, Controller, Get, Post } from '@nestjs/common';
import { SportService } from './sport.service';
import { Sport } from './sport.entity';
import { CreateSportDto } from './sport.types';

@Controller('sports')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  findAll(): Promise<Sport[]> {
    return this.sportService.findAll();
  }

  @Post()
  createSport(@Body() createSportDto: CreateSportDto): Promise<Sport[]> {
    console.log('ezfzef', createSportDto);
    return this.sportService.create(createSportDto);
  }
}
