interface SecurityConfig {
  maxLoginAttempts: number;
  blockDuration: number;
  allowedOrigins: string[];
  allowedMethods: string[];
  rateLimits: {
    windowMs: number;
    max: number;
  };
}

export class SecurityConfigService {
  private static config: SecurityConfig = {
    maxLoginAttempts: 5,
    blockDuration: 24 * 60 * 60, // 24 horas en segundos
    allowedOrigins: ["http://localhost:3000"],
    allowedMethods: ["GET", "POST", "PUT", "DELETE"],
    rateLimits: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // número máximo de solicitudes
    },
  };

  static getConfig(): SecurityConfig {
    return this.config;
  }

  static updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  static getAllowedOrigins(): string[] {
    return this.config.allowedOrigins;
  }

  static getAllowedMethods(): string[] {
    return this.config.allowedMethods;
  }

  static getRateLimits() {
    return this.config.rateLimits;
  }
}
