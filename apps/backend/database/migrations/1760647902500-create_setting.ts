import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateSetting1760647902500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'setting',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'user_id', type: 'int' },
          { name: 'dashboard_last_sessions', type: 'boolean', default: true },
          { name: 'dashboard_weight', type: 'boolean', default: true },
          { name: 'dashboard_heart_rate', type: 'boolean', default: true },
          { name: 'health_weight', type: 'boolean', default: true },
          { name: 'health_heart_rate', type: 'boolean', default: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'setting',
      new TableForeignKey({
        name: 'FK_setting_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'setting',
      new TableIndex({
        name: 'UQ_setting_user_id',
        columnNames: ['user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.query(`
      INSERT INTO setting (user_id, dashboard_last_sessions, dashboard_weight, dashboard_heart_rate, health_weight, health_heart_rate)
      SELECT id, 1, 1, 0, 0, 0 FROM user
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('setting', 'UQ_setting_user_id');
    await queryRunner.dropForeignKey('setting', 'FK_setting_user');
    await queryRunner.dropTable('setting');
  }
}
