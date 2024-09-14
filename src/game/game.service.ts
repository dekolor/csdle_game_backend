import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  private weapons = ['AK-47', 'M4A1-S', 'AWP', 'Desert Eagle']; // Mock data

  getRandomWeapon() {
    const randomIndex = Math.floor(Math.random() * this.weapons.length);
    return this.weapons[randomIndex];
  }

  checkGuess(weapon: string, guess: string) {
    return weapon.toLowerCase() === guess.toLowerCase();
  }
}
