import { authenticator } from "otplib";
import QRCode from "qrcode";

export class TwoFactorAuthService {
  static async generateSecret(
    userId: string
  ): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = authenticator.generateSecret();
    const appName = "TuAplicacion";
    const otpauthUrl = authenticator.keyuri(userId, appName, secret);

    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    return {
      secret,
      qrCodeUrl,
    };
  }

  static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }
}
