import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  challengeId: string;

  @Column()
  guess: string;

  @Column({ default: 0 })
  attempts: number;
}
