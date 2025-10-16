import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHealth1760647902496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
