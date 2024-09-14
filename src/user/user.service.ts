import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private users = []; // Temporary user storage

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now(), username, password: hashedPassword };
    this.users.push(user);
    return { id: user.id, username: user.username };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = this.users.find((u) => u.username === username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
