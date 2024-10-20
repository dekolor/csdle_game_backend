import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guess } from './guess.entity';
import { RedisService } from '../redis/redis.service';
import { ChallengeType } from './challenge.types';
import { format } from 'date-fns';
import * as cron from 'node-cron';

@Injectable()
export class GameService implements OnModuleInit {
  private weapons = ['AK-47', 'M4A1-S', 'AWP', 'Desert Eagle'];
  private skins = ['Dragon Lore', 'Asiimov', 'Hyper Beast']; // Example skins
  private proPlayers = ['s1mple', 'ZywOo', 'device']; // Example pro players

  constructor(
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
    private redisService: RedisService,
  ) {}

  onModuleInit() {
    // Schedule the task to run at midnight every day
    cron.schedule('0 0 * * *', () => {
      this.generateDailyChallenge();
    });
  }

  async checkGuess(challengeId: string, guess: string): Promise<boolean> {
    console.log(`Retrieving challenge for ID: ${challengeId}`);
    console.log(`Retrieving key from Redis: daily-challenge:${challengeId}`);
  
    const challengeData = await this.redisService.get(`${challengeId}`);
    
    if (!challengeData) {
      console.warn(`No challenge found for ID: ${challengeId}`);
      return false;
    }
  
    const parsedChallenge = JSON.parse(challengeData);
    const correctItem = parsedChallenge.item;  // This could be a weapon, skin, or pro player
  
    // Log the type and item of the challenge for debugging
    console.log(`Challenge type: ${parsedChallenge.type}, correct item: ${correctItem}`);
  
    // Compare the guess with the correct item (case insensitive)
    return correctItem.toLowerCase() === guess.toLowerCase();
  }

  async getTotalGuesses(): Promise<number> {
    return this.guessRepository.count();
  }

  async generateDailyChallenge() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const challengeKey = `daily-challenge:${today}`;
  
    // Check if today's challenge already exists
    const existingChallenge = await this.redisService.get(challengeKey);
    if (existingChallenge) {
      console.log(`Challenge for today (${challengeKey}) already exists:`, existingChallenge);
      return JSON.parse(existingChallenge);
    }
  
    // Randomly select a challenge type
    const challengeType = this.getRandomChallengeType();
    let challengeItem;
  
    switch (challengeType) {
      case ChallengeType.GUESS_WEAPON:
        challengeItem = this.getRandomWeapon();
        break;
      case ChallengeType.GUESS_SKIN:
        challengeItem = this.getRandomSkin();
        break;
      case ChallengeType.GUESS_PRO_PLAYER:
        challengeItem = this.getRandomProPlayer();
        break;
      default:
        throw new Error('Invalid challenge type');
    }
  
    const challenge = { type: challengeType, item: challengeItem };
    
    // Log the challenge before setting it in Redis
    console.log(`Storing challenge (${challengeKey}):`, challenge);

    console.log(`Setting key in Redis: daily-challenge:${today}`);
  
    await this.redisService.set(challengeKey, JSON.stringify(challenge), 86400); // Store for 24 hours
  
    return challenge;
  }

  getRandomChallengeType(): ChallengeType {
    const types = Object.values(ChallengeType);
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
  }

  getRandomWeapon() {
    const randomIndex = Math.floor(Math.random() * this.weapons.length);
    return this.weapons[randomIndex];
  }

  getRandomSkin() {
    const randomIndex = Math.floor(Math.random() * this.skins.length);
    return this.skins[randomIndex];
  }

  getRandomProPlayer() {
    const randomIndex = Math.floor(Math.random() * this.proPlayers.length);
    return this.proPlayers[randomIndex];
  }

  async getDailyChallenge() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const challengeKey = `daily-challenge:${today}`;
    const challenge = await this.redisService.get(challengeKey);

    if (!challenge) {
      throw new Error('No challenge found for today');
    }

    const parsedChallenge = JSON.parse(challenge);
    return { type: parsedChallenge.type }; // Return only the challenge type
  }
}
