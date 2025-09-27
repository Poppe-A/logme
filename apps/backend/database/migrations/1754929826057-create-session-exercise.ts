import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSessionExercise1754929826057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'session_exercise',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'session_id', type: 'int' },
          { name: 'exercise_id', type: 'int' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'session_exercise',
      new TableForeignKey({
        name: 'FK_session_exercise_session',
        columnNames: ['session_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'session',
      }),
    );

    await queryRunner.createForeignKey(
      'session_exercise',
      new TableForeignKey({
        name: 'FK_session_exercise_exercise',
        columnNames: ['exercise_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'exercise',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'session_exercise',
      'FK_session_exercise_session',
    );
    await queryRunner.dropForeignKey(
      'session_exercise',
      'FK_session_exercise_exercise',
    );

    await queryRunner.dropTable('session_exercise');
  }
}
