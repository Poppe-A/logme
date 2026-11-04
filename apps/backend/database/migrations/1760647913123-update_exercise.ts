import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateExercise1760647913123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'exercise',
      new TableColumn({ name: 'video_link', type: 'varchar', length: '300' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('exercise', 'video_link');
  }
}
