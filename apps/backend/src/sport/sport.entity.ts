import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('sport')
@Unique(['id'])
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;
}
