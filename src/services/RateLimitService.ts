import Redis from "ioredis";
import { envConfig } from "../config/envConfig";

export class RateLimitService {
  private static redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  });

  static async incrementAndCheckLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.pexpire(key, windowMs);
    }

    const ttl = await this.redis.pttl(key);
    const remaining = Math.max(0, limit - current);

    return {
      allowed: current <= limit,
      remaining
    };
  }

  static generateKey(identifier: string, type: string): string {
    return `ratelimit:${type}:${identifier}`;
  }
} 