import Redis from "ioredis";

export class IpBlockingService {
  private static redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  });
  private static readonly BLOCK_DURATION = 24 * 60 * 60; // 24 horas en segundos

  static async blockIp(ip: string, reason: string): Promise<void> {
    await this.redis.setex(`blocked_ip:${ip}`, this.BLOCK_DURATION, reason);
  }

  static async isIpBlocked(ip: string): Promise<boolean> {
    const blocked = await this.redis.exists(`blocked_ip:${ip}`);
    return blocked === 1;
  }

  static async getBlockReason(ip: string): Promise<string | null> {
    return await this.redis.get(`blocked_ip:${ip}`);
  }

  static async unblockIp(ip: string): Promise<void> {
    await this.redis.del(`blocked_ip:${ip}`);
  }

  static async getBlockedIps(): Promise<string[]> {
    const keys = await this.redis.keys("blocked_ip:*");
    return keys.map((key) => key.replace("blocked_ip:", ""));
  }
}
