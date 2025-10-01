import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { ExerciseType } from '../../src/exercise/exercise.type';

export class CreateExercise1754910752067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exercise',
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
          { name: 'alt_name', type: 'varchar', isNullable: true },
          { name: 'second_alt_name', type: 'varchar', isNullable: true },
          {
            name: 'description',
            type: 'varchar',
            length: '1000',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              ExerciseType.DISTANCE,
              ExerciseType.DURATION,
              ExerciseType.REPETITION,
            ],
          },
          { name: 'sport_id', type: 'int' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'exercise',
      new TableForeignKey({
        name: 'FK_exercise_sport',
        columnNames: ['sport_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sport',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('exercise', 'FK_exercise_sport');
    await queryRunner.dropTable('exercise');
  }
}
