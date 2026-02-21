import { Injectable } from '@nestjs/common';
import { Setting } from './setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSettingDto } from './setting.type';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async findByUserId(userId: number): Promise<Setting | null> {
    console.log('setting serv');
    return this.settingRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async update(
    userId: number,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    let setting = await this.findByUserId(userId);

    if (!setting) {
      setting = this.settingRepository.create({
        user: { id: userId },
        ...updateSettingDto,
      });
    } else {
      Object.assign(setting, updateSettingDto);
    }

    return this.settingRepository.save(setting);
  }
}
