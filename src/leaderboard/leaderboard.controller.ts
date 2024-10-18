import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post('add')
  async addScore(@Body() body: { playerName?: string; score: number }) {
    await this.leaderboardService.addScore(body.playerName, body.score);
    return { success: true };
  }

  @Get('top')
  getTopScores() {
    return this.leaderboardService.getTopScores();
  }

  @Delete(':id')
  async deleteScore(@Param('id') id: number) {
    const success = await this.leaderboardService.deleteScore(id);
    return { success };
  }
}
