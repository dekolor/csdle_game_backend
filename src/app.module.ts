import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GameModule, UserModule, LeaderboardModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
