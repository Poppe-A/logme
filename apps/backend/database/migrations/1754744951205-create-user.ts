import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1754744951205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          { name: 'password', type: 'varchar' },
          { name: 'firstname', type: 'varchar', length: '100' },
          { name: 'lastname', type: 'varchar', length: '100' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
