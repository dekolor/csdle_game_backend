import { Controller, Get, Post, Body, Session, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { RedisService } from '../redis/redis.service';
import { Request } from 'express';


@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService, private readonly redisService: RedisService) {}

  @Post('guess')
  async checkGuess(@Req() req: Request, @Body() body: { guess: string }) {
    const userId = req.sessionID;
    const correctWeapon = await this.redisService.get(`challenge:${userId}`);

    if (!correctWeapon) {
      return { error: 'No challenge found. Please request a new challenge.' };
    }

    const isCorrect = this.gameService.checkGuess(correctWeapon, body.guess);
    return { correct: isCorrect };
  }

  @Get('challenge')
  async getChallenge(@Req() req: Request) {
    const weapon = this.gameService.getRandomWeapon();
    const userId = req.sessionID;

    console.log(req.session, userId);

    await this.redisService.set(`challenge:${userId}`, weapon, 3600);

    return { challenge: 'Guess the weapon' };
  }
}
