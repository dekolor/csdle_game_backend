import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity'; // Adjust the path as necessary

@Entity()
export class GameScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => User, user => user.gameScores) // This should now work
  user: User;
}
