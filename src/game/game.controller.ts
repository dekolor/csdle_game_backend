import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { GameService } from './game.service';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly redisService: RedisService,
  ) {}

  @Post('guess')
  async checkGuess(
    @Headers('challenge-id') challengeId: string,
    @Body() body: { guess: string },
  ) {
    const correctWeapon = await this.redisService.get(
      `challenge:${challengeId}`,
    );

    if (!correctWeapon) {
      return { error: 'No challenge found. Please request a new challenge.' };
    }

    const isCorrect = this.gameService.checkGuess(body.guess, correctWeapon);
    return { correct: isCorrect };
  }

  @Get('challenge')
  async getChallenge() {
    const weapon = this.gameService.getRandomWeapon();
    const challengeId = uuidv4(); // Generate a UUID for the challenge

    await this.redisService.set(`challenge:${challengeId}`, weapon, 3600);

    return { challenge: 'Guess the weapon', challengeId };
  }
}
