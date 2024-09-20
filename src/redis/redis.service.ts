import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.client.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
