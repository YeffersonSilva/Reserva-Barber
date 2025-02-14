export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public phone: string | null,
    public role: 'ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CLIENT',
    public companyId?: number,  // Propiedad opcional
    public createdAt = new Date(),
    public updatedAt = new Date(),
  ) {}
}


