declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: 'ADMIN' | 'USER' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CLIENT';
      companyId?: number; // añadir esta propiedad
    }
  }
}
