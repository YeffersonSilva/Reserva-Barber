import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export class TokenBlacklistService {
  static async addToBlacklist(
    token: string,
    expirationTime: number
  ): Promise<void> {
    await redis.set(`blacklist:${token}`, "1", "EX", expirationTime);
  }

  static async isBlacklisted(token: string): Promise<boolean> {
    const exists = await redis.exists(`blacklist:${token}`);
    return exists === 1;
  }
}
