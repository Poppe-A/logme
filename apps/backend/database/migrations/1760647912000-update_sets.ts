import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSets1760647912000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE \`set\`
        MODIFY COLUMN\`weight\` DECIMAL(6,2) NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE set CHANGE COLUMN weight weight INT NULL;
    `);
  }
}
