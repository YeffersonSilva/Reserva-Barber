import nodemailer from 'nodemailer';

interface AlertEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export class EmailService {
  // Configura el transporter utilizando variables de entorno
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Envia una alerta por email utilizando los datos proporcionados
  static async sendAlert(options: AlertEmailOptions): Promise<void> {
    const { to, subject, template, data } = options;
    
    // Para simplificar usamos un correo de texto plano
    const textContent = `Plantilla: ${template}\n\nDatos: ${JSON.stringify(data, null, 2)}`;
    
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        to,
        subject,
        text: textContent,
      });
    } catch (error) {
      console.error("Error al enviar el correo de alerta:", error);
      throw error;
    }
  }
} 