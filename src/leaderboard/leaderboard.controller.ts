import { Controller, Get, Post, Body } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post('add')
  addScore(@Body() body: { player: string; score: number }) {
    this.leaderboardService.addScore(body.player, body.score);
    return { success: true };
  }

  @Get('top')
  getTopScores() {
    return this.leaderboardService.getTopScores();
  }
}
