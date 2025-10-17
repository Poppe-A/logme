import { Health } from './health.entity';

export enum HealthType {
  WEIGHT = 'weight',
  HEART_RATE = 'heart_rate',
}

export interface CreateHealthDto {
  value: number; // Valeur numérique avant chiffrement
  type: Health['type'];
  date: Health['date'];
}

export interface UpdateHealthDto {
  value?: number; // Valeur numérique avant chiffrement
  type?: Health['type'];
  date?: Health['date'];
}

// Type pour les données déchiffrées retournées par l'API
export interface DecryptedHealth {
  id: number;
  value: number; // Valeur déchiffrée
  type: Health['type'];
  date: Health['date'];
}

export interface GroupedDecryptedHealth {
  [HealthType.WEIGHT]: DecryptedHealth[];
  [HealthType.HEART_RATE]: DecryptedHealth[];
}
