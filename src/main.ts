import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create a Redis client
  const redisClient = createClient({ legacyMode: true });
  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: '',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000, secure: false, httpOnly: true }, // 1-hour expiry
    }),
  );

  // Enable CORS and allow credentials (cookies)
  app.enableCors({
    origin: true, // Allow all origins, or you can restrict to specific domains
    credentials: true, // Allow cookies to be sent
  });

  await app.listen(3000);
}
bootstrap();
