import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { HealthService } from './health.service';
import { Health } from './health.entity';
import {
  CreateHealthDto,
  DecryptedHealth,
  GroupedDecryptedHealth,
} from './health.type';
import { RequestWithMetadatas } from '../auth/auth.types';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  findAllByUser(
    @Req() req: RequestWithMetadatas,
  ): Promise<GroupedDecryptedHealth> {
    return this.healthService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: Health['id']): Promise<DecryptedHealth | null> {
    return this.healthService.findOne(id);
  }

  @Post()
  create(
    @Body() createHealthDto: CreateHealthDto,
    @Req() req: RequestWithMetadatas,
  ): Promise<DecryptedHealth> {
    return this.healthService.create(createHealthDto, req.user.userId);
  }

  //   @Patch(':id')
  //   update(
  //     @Param('id') id: Health['id'],
  //     @Body() updateHealthDto: UpdateHealthDto,
  //   ): Promise<DecryptedHealth | null> {
  //     return this.healthService.update(id, updateHealthDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: Health['id']): Promise<void> {
  //     return this.healthService.remove(id);
  //   }
}
