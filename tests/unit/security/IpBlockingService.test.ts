import { IpBlockingService } from "../../../src/services/IpBlockingService";
import Redis from "ioredis";

jest.mock("ioredis");

describe("IpBlockingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block an IP address", async () => {
    const mockSetex = jest.fn();
    (Redis as unknown as jest.Mock).mockImplementation(() => ({
      setex: mockSetex,
    }));

    const ip = "192.168.1.1";
    const reason = "Multiple failed login attempts";

    await IpBlockingService.blockIp(ip, reason);
    expect(mockSetex).toHaveBeenCalledWith(
      `blocked_ip:${ip}`,
      24 * 60 * 60,
      reason
    );
  });

  it("should check if IP is blocked", async () => {
    const mockExists = jest.fn().mockResolvedValue(1);
    (Redis as unknown as jest.Mock).mockImplementation(() => ({
      exists: mockExists,
    }));

    const ip = "192.168.1.1";
    const result = await IpBlockingService.isIpBlocked(ip);

    expect(result).toBe(true);
    expect(mockExists).toHaveBeenCalledWith(`blocked_ip:${ip}`);
  });

  it("should get block reason", async () => {
    const reason = "Suspicious activity";
    const mockGet = jest.fn().mockResolvedValue(reason);
    (Redis as unknown as jest.Mock).mockImplementation(() => ({
      get: mockGet,
    }));

    const ip = "192.168.1.1";
    const result = await IpBlockingService.getBlockReason(ip);

    expect(result).toBe(reason);
    expect(mockGet).toHaveBeenCalledWith(`blocked_ip:${ip}`);
  });
});
