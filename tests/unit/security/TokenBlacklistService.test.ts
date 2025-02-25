import { TokenBlacklistService } from "../../../src/services/TokenBlacklistService";
import Redis from "ioredis";

jest.mock("ioredis");
const MockRedis = Redis as jest.MockedClass<typeof Redis>;

describe("TokenBlacklistService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add token to blacklist", async () => {
    const mockSet = jest.fn();
    MockRedis.mockImplementation(
      () =>
        ({
          set: mockSet,
        } as any)
    );

    const token = "jwt.token.here";
    const expirationTime = 3600;

    await TokenBlacklistService.addToBlacklist(token, expirationTime);
    expect(mockSet).toHaveBeenCalledWith(
      `blacklist:${token}`,
      "1",
      "EX",
      expirationTime
    );
  });

  it("should check if token is blacklisted", async () => {
    const mockExists = jest.fn().mockResolvedValue(1);
    MockRedis.mockImplementation(
      () =>
        ({
          exists: mockExists,
        } as any)
    );

    const token = "jwt.token.here";
    const result = await TokenBlacklistService.isBlacklisted(token);

    expect(result).toBe(true);
    expect(mockExists).toHaveBeenCalledWith(`blacklist:${token}`);
  });
});
