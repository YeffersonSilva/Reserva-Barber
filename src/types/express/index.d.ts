declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: 'ADMIN' | 'MANAGER'| 'USER' | 'COMPANY_ADMIN' | 'EMPLOYEE' ; // añadir 'EMPLOYEE'
      companyId?: number; // añadir esta propiedad
    }
  }
}
