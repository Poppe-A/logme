import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateSession1760647913000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'session',
      new TableColumn({ name: 'is_finished', type: 'boolean', default: false }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('session', 'is_finished');
  }
}
