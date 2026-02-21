import { Controller, Get, Req } from '@nestjs/common';
import { DataService } from './data.service';
import { RequestWithMetadatas } from '../auth/auth.types';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('get-for-dashboard')
  getForDashboard(@Req() req: RequestWithMetadatas) {
    console.log('zefez');
    return this.dataService.getForDashboard(req.user.userId);
  }
}
