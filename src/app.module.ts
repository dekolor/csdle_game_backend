import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { RedisService } from './redis/redis.service';
import 'dotenv/config';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'mysql' for MySQL
      host: 'localhost', // Replace with your DB host
      port: 3306, // Replace with MySQL port if necessary
      username: '',
      password: '',
      database: '',
      autoLoadEntities: true, // Automatically load entities (models)
      synchronize: true, // Synchronize schema on every app launch (turn off in production)
    }),
    UserModule,
    AuthModule,
    GameModule,
    LeaderboardModule,
  ],
  providers: [RedisService],
})
export class AppModule {}
