import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameScore } from '../game/game-score.entity'; // Adjust the path as necessary
import { User } from '../user/user.entity'; // Import User entity if needed

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(GameScore)
    private gameScoresRepository: Repository<GameScore>,
  ) {}

  async addScore(playerName: string | undefined, score: number) {
    const newGameScore = this.gameScoresRepository.create({ playerName, score });
    await this.gameScoresRepository.save(newGameScore);
  }

  async getTopScores() {
    return this.gameScoresRepository.find({
      order: { score: 'DESC' },
      take: 10,
    });
  }

  async deleteScore(id: number) {
    const result = await this.gameScoresRepository.delete(id);
    return result.affected > 0; // Returns true if a row was deleted
  }
}
