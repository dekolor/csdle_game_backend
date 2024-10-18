import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guess } from './guess.entity';
import { RedisService } from '../redis/redis.service'; // Import RedisService

@Injectable()
export class GameService {
  private weapons = [
    "CZ75-Auto",
    "Desert Eagle",
    "Dual Berettas",
    "Five-SeveN",
    "Glock-18",
    "P2000",
    "P250",
    "R8 Revolver",
    "Tec-9",
    "USP-S",
    "AK-47",
    "AUG",
    "AWP",
    "FAMAS",
    "G3SG1",
    "Galil AR",
    "M4A1-S",
    "M4A4",
    "SCAR-20",
    "SG 553",
    "SSG 08",
    "MAC-10",
    "MP5-SD",
    "MP7",
    "MP9",
    "PP-Bizon",
    "P90",
    "UMP-45",
    "MAG-7",
    "Nova",
    "Sawed-Off",
    "XM1014",
    "M249",
    "Negev",
    "Knife"
  ]; // Mock data

  constructor(
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
    private redisService: RedisService, // Inject RedisService
  ) {}

  getRandomWeapon() {
    const randomIndex = Math.floor(Math.random() * this.weapons.length);
    return this.weapons[randomIndex];
  }

  async checkGuess(challengeId: string, guess: string): Promise<boolean> {
    const existingGuess = await this.guessRepository.findOne({ where: { challengeId, guess } });

    if (existingGuess) {
      existingGuess.attempts += 1;
      await this.guessRepository.save(existingGuess);
    } else {
      const newGuess = this.guessRepository.create({ challengeId, guess, attempts: 1 });
      await this.guessRepository.save(newGuess);
    }

    const correctWeapon = await this.redisService.get(`challenge:${challengeId}`);
    
    // Check if correctWeapon is null or undefined
    if (!correctWeapon) {
      console.warn(`No correct weapon found for challenge ID: ${challengeId}`);
      return false; // or handle this case as needed
    }

    return correctWeapon.toLowerCase() === guess.toLowerCase();
  }

  async getTotalGuesses(): Promise<number> {
    return this.guessRepository.count();
  }
}
