import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateHealth1760647902496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'health',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'user_id', type: 'int' },
          { name: 'value', type: 'text' },
          { name: 'date', type: 'date' },
          { name: 'type', type: 'enum', enum: ['weight', 'heart_rate'] },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'health',
      new TableForeignKey({
        name: 'FK_health_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    // Ajouter l'index unique pour user_id, date et type
    await queryRunner.createIndex(
      'health',
      new TableIndex({
        name: 'UQ_health_user_date_type',
        columnNames: ['user_id', 'date', 'type'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('health', 'UQ_health_user_date_type');
    await queryRunner.dropForeignKey('health', 'FK_health_user');
    await queryRunner.dropTable('health');
  }
}
