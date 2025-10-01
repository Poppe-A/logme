import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSet1754929826140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'set',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'repetitions', type: 'int' },
          { name: 'weight', type: 'int', isNullable: true },
          { name: 'order', type: 'int' },
          { name: 'session_exercise_id', type: 'int' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'set',
      new TableForeignKey({
        name: 'FK_set_session_exercise',
        columnNames: ['session_exercise_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'session_exercise',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('sets', 'FK_set_session_exercise');

    await queryRunner.dropTable('set');
  }
}
