import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SportService } from './sport.service';
import { Sport } from './sport.entity';
import { CreateOrUpdateSportDto } from './sport.types';

@Controller('sports')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  findAll(): Promise<Sport[]> {
    return this.sportService.findAll();
  }

  @Post()
  createSport(
    @Body() createSportDto: CreateOrUpdateSportDto,
  ): Promise<Sport[]> {
    return this.sportService.create(createSportDto);
  }

  @Patch('/:id')
  updateSport(
    @Body() updateSportDto: CreateOrUpdateSportDto,
    @Param('id') id: Sport['id'],
  ): Promise<Sport[]> {
    return this.sportService.update(id, updateSportDto);
  }
}
