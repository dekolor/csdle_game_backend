import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameScore } from './game-score.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { RedisService } from '../redis/redis.service';
@Module({
  imports: [TypeOrmModule.forFeature([GameScore])], // Register GameScore entity
  providers: [GameService, RedisService],
  controllers: [GameController],
})
export class GameModule {}
