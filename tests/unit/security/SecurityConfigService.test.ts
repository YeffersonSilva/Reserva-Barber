import { SecurityConfigService } from "../../../src/services/SecurityConfigService";

describe("SecurityConfigService", () => {
  it("should return default config", () => {
    const config = SecurityConfigService.getConfig();
    expect(config).toHaveProperty("maxLoginAttempts");
    expect(config).toHaveProperty("blockDuration");
    expect(config).toHaveProperty("allowedOrigins");
    expect(config).toHaveProperty("allowedMethods");
    expect(config).toHaveProperty("rateLimits");
  });

  it("should update config partially", () => {
    const originalConfig = SecurityConfigService.getConfig();
    const newConfig = {
      maxLoginAttempts: 3,
      blockDuration: 60 * 60,
    };

    SecurityConfigService.updateConfig(newConfig);
    const updatedConfig = SecurityConfigService.getConfig();

    expect(updatedConfig.maxLoginAttempts).toBe(3);
    expect(updatedConfig.blockDuration).toBe(60 * 60);
    expect(updatedConfig.allowedOrigins).toEqual(originalConfig.allowedOrigins);
  });

  it("should return allowed origins", () => {
    const origins = SecurityConfigService.getAllowedOrigins();
    expect(Array.isArray(origins)).toBe(true);
    expect(origins).toContain("http://localhost:3000");
  });

  it("should return allowed methods", () => {
    const methods = SecurityConfigService.getAllowedMethods();
    expect(Array.isArray(methods)).toBe(true);
    expect(methods).toContain("GET");
    expect(methods).toContain("POST");
  });
});
