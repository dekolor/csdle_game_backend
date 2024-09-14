import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('weapon')
  getWeapon() {
    return { weapon: this.gameService.getRandomWeapon() };
  }

  @Post('guess')
  checkGuess(@Body() body: { weapon: string; guess: string }) {
    const result = this.gameService.checkGuess(body.weapon, body.guess);
    return { correct: result };
  }
}
