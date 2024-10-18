import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameScore } from './game-score.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { RedisService } from '../redis/redis.service';
import { Guess } from './guess.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameScore, Guess])], // Register GameScore and Guess entities
  providers: [GameService, RedisService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
