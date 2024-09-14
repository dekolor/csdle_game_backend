import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardService {
  private scores = []; // Mock database for storing scores

  addScore(player: string, score: number) {
    this.scores.push({ player, score });
    this.scores.sort((a, b) => b.score - a.score);
  }

  getTopScores() {
    return this.scores.slice(0, 10); // Return top 10 players
  }
}
