import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // Inject UserRepository
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && user.password === password) {
      return user; // Return the user if the password is correct
    }
    return null; // Return null if validation fails
  }

  async findUser(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async register(username: string, inputPassword: string): Promise<User> {
    const password = await bcrypt.hash(inputPassword, 10);
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = this.userRepository.create({ username, password });
    return this.userRepository.save(user);
  }
}
