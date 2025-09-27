import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSession1754929826056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'session',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          { name: 'user_id', type: 'int' },
          { name: 'sport_id', type: 'int' },
          {
            name: 'description',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          { name: 'start_date', type: 'timestamp', default: 'NOW()' },
          { name: 'end_date', type: 'date', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'session',
      new TableForeignKey({
        name: 'FK_session_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    );

    await queryRunner.createForeignKey(
      'session',
      new TableForeignKey({
        name: 'FK_session_sport',
        columnNames: ['sport_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sport',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('session', 'FK_session_user');
    await queryRunner.dropForeignKey('session', 'FK_session_sport');

    await queryRunner.dropTable('session');
  }
}
