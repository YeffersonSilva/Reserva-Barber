import { SecurityAuditLogger } from "../../../src/services/SecurityAuditService";
import winston from "winston";

jest.mock("winston", () => ({
  format: {
    timestamp: jest.fn(),
    json: jest.fn(),
    combine: jest.fn(),
  },
  transports: {
    File: jest.fn(),
    Console: jest.fn(),
  },
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
  })),
}));

describe("SecurityAuditLogger", () => {
  it("should log security events", () => {
    const mockLogger = winston.createLogger();
    const securityEvent = {
      type: "LOGIN_ATTEMPT" as const,
      userId: 123,
      ip: "192.168.1.1",
      success: true,
      details: { browser: "Chrome" },
    };

    SecurityAuditLogger.logSecurityEvent(securityEvent);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "Security Event",
      expect.objectContaining(securityEvent)
    );
  });

  it("should log security errors", () => {
    const mockLogger = winston.createLogger();
    const error = new Error("Security breach");
    const errorEvent = {
      type: "ACCESS_DENIED" as const,
      ip: "192.168.1.1",
      success: false,
      details: {
        error: error.message,
        stack: error.stack,
      },
    };

    SecurityAuditLogger.logSecurityEvent(errorEvent);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "Security Event",
      expect.objectContaining(errorEvent)
    );
  });
});
