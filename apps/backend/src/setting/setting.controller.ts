import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { UpdateSettingDto } from './setting.type';
import { RequestWithMetadatas } from '../auth/auth.types';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  findByUserId(@Req() req: RequestWithMetadatas): Promise<Setting | null> {
    return this.settingService.findByUserId(req.user.userId);
  }

  @Patch()
  update(
    @Body() updateSettingDto: UpdateSettingDto,
    @Req() req: RequestWithMetadatas,
  ): Promise<Setting> {
    console.log('settings contro');
    return this.settingService.update(req.user.userId, updateSettingDto);
  }
}
