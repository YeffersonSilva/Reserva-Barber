import crypto from "crypto";

export class PaymentEncryption {
  private static algorithm = "aes-256-gcm";
  private static key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");

  static encrypt(text: string): {
    encryptedData: string;
    iv: string;
    tag: string;
  } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      iv
    ) as crypto.CipherGCM;

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      tag: cipher.getAuthTag().toString("hex"),
    };
  }

  static decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, "hex")
    ) as crypto.DecipherGCM;

    decipher.setAuthTag(Buffer.from(tag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
