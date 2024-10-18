import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { GameScore } from '../game/game-score.entity'; // Adjust the path as necessary
import { User } from '../user/user.entity'; // Adjust the path as necessary

@Module({
  imports: [
    TypeOrmModule.forFeature([GameScore, User]), // Import the necessary entities
  ],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
