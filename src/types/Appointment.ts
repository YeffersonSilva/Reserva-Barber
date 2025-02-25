export type AppointmentStatus = 
  | "SCHEDULED"
  | "COMPLETED" 
  | "CANCELED"
  | "CONFIRMED"
  | "PAYMENT_FAILED"
  | "REFUNDED";

export type PaymentStatus = 
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";

export interface Appointment {
  id: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  // ... otros campos
} 