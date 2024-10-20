import { Controller, Get, Post, Body, Headers, Param } from '@nestjs/common';
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
    @Headers('Challenge-Id') challengeId: string,
    @Body() body: { guess: string },
  ) {
    const correctWeapon = await this.redisService.get(
      `challenge:${challengeId}`,
    );

    if (!correctWeapon) {
      return { error: 'No challenge found. Please request a new challenge.' };
    }

    const isCorrect = await this.gameService.checkGuess(challengeId, body.guess);
    return { correct: isCorrect };
  }

  @Get('challenge')
  async getChallenge() {
    const weapon = this.gameService.getRandomWeapon();
    const challengeId = uuidv4(); // Generate a UUID for the challenge

    await this.redisService.set(`challenge:${challengeId}`, weapon, 3600);

    return { challenge: 'Guess the weapon', challengeId };
  }

  @Get('total-guesses')
  async getTotalGuesses() {
    const totalGuesses = await this.gameService.getTotalGuesses();
    return { totalGuesses };
  }

  @Get('correct-guess/:challengeId')
  async getCorrectGuess(@Param('challengeId') challengeId: string) {
    const correctWeapon = await this.redisService.get(`challenge:${challengeId}`);

    if (!correctWeapon) {
      return { error: 'No correct guess found for this challenge ID.' };
    }

    return { correctWeapon };
  }

  @Get('daily-challenge')
  async getDailyChallenge() {
    return this.gameService.getDailyChallenge();
  }

  @Get('generate-daily-challenge')
  async generateDailyChallenge() {
    return this.gameService.generateDailyChallenge();
  }

  @Post('daily-challenge/guess')
  async submitDailyChallengeGuess(@Body() body: { guess: string }) {
    const today = new Date().toISOString().split('T')[0];
    const challengeId = `daily-challenge:${today}`;
  
    // Log the challenge ID and guess
    console.log(`Submitting guess for challenge ID: ${challengeId}, Guess: ${body.guess}`);
  
    const isCorrect = await this.gameService.checkGuess(challengeId, body.guess);
    const challengeType = (await this.gameService.getDailyChallenge()).type;
  
    return { correct: isCorrect, challengeType, message: isCorrect ? "Correct answer!" : null };
  }
}
