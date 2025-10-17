import { Injectable } from '@nestjs/common';
import { Health } from './health.entity';
import { Repository } from 'typeorm';
import {
  CreateHealthDto,
  DecryptedHealth,
  GroupedDecryptedHealth,
  HealthType,
} from './health.type';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

const HEALTH_ENCRYPTION_ALGORITHM = 'aes-256-gcm'; // au lieu de cbc
const HEALTH_HASH_ALGORITHM = 'sha256';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Health)
    private healthRepository: Repository<Health>,
    private readonly configService: ConfigService,
  ) {}

  async findAllByUser(userId: number): Promise<GroupedDecryptedHealth> {
    const healthData = await this.healthRepository.find({
      where: { user: { id: userId } },
      order: { date: 'ASC' },
    });

    // Déchiffrer les valeurs et grouper par type
    const decryptedData = healthData.map((health) => ({
      ...health,
      value:
        (this.decryptHealthData(health.value) as number) ||
        (health.value as unknown as number),
    }));

    const groupedData: GroupedDecryptedHealth = {
      [HealthType.WEIGHT]: decryptedData.filter(
        (health) => health.type === HealthType.WEIGHT,
      ),
      [HealthType.HEART_RATE]: decryptedData.filter(
        (health) => health.type === HealthType.HEART_RATE,
      ),
    };

    return groupedData;
  }

  async findOne(id: Health['id']): Promise<DecryptedHealth | null> {
    const health = await this.healthRepository.findOne({ where: { id } });
    if (health) {
      return {
        ...health,
        value:
          (this.decryptHealthData(health.value) as number) ||
          (health.value as unknown as number),
      };
    }
    return health;
  }

  async create(
    createHealthDto: CreateHealthDto,
    userId: number,
  ): Promise<DecryptedHealth> {
    // Vérifier s'il existe déjà une entrée pour cet utilisateur, cette date et ce type
    const existingHealth = await this.healthRepository.findOne({
      where: {
        user: { id: userId },
        date: createHealthDto.date,
        type: createHealthDto.type,
      },
    });

    if (existingHealth) {
      // Mettre à jour l'entrée existante
      const encryptedValue = this.encryptHealthData(createHealthDto.value);
      await this.healthRepository.update(
        { id: existingHealth.id },
        { value: encryptedValue },
      );
      const updatedHealth = await this.findOne(existingHealth.id);
      return updatedHealth!;
    } else {
      // Créer une nouvelle entrée
      const encryptedValue = this.encryptHealthData(createHealthDto.value);
      const health = this.healthRepository.create({
        ...createHealthDto,
        value: encryptedValue,
        user: { id: userId },
      });
      const savedHealth = await this.healthRepository.save(health);
      return {
        ...savedHealth,
        value: createHealthDto.value,
      };
    }
  }

  //   async update(
  //     id: Health['id'],
  //     updateHealthDto: UpdateHealthDto,
  //   ): Promise<DecryptedHealth | null> {
  //     const updateData: Partial<Health> = {
  //       type: updateHealthDto.type,
  //       date: updateHealthDto.date,
  //     };

  //     // Chiffrer la valeur si elle est fournie
  //     if (updateHealthDto.value !== undefined) {
  //       updateData.value = this.encryptHealthData(updateHealthDto.value);
  //     }

  //     await this.healthRepository.update({ id }, updateData);
  //     return this.findOne(id);
  //   }

  //   async remove(id: Health['id']): Promise<void> {
  //     await this.healthRepository.delete({ id });
  //   }

  encryptHealthData(data: number): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(HEALTH_ENCRYPTION_ALGORITHM, key, iv);

    const dataString = JSON.stringify(data);
    let encrypted = cipher.update(dataString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex'); // Ajout du tag

    return iv.toString('hex') + ':' + authTag + ':' + encrypted; // 3 parties
  }

  decryptHealthData(encryptedData: string): any {
    try {
      const key = this.getKey();
      const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv(
        HEALTH_ENCRYPTION_ALGORITHM,
        key,
        iv,
      );
      decipher.setAuthTag(authTag); // Vérification de l'intégrité

      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  private getKey(): Buffer {
    const secret = this.configService.get<string>('HEALTH_DATA_SECRET');
    if (!secret) {
      throw new Error('HEALTH_DATA_SECRET environment variable is not set');
    }
    return crypto.createHash(HEALTH_HASH_ALGORITHM).update(secret).digest();
  }
}
