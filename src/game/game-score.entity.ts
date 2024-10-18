import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GameScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ nullable: true }) // Allow null if the player chooses not to provide a name
  playerName: string;
}
