
export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public phone: string | null,
    public role: 'ADMIN' | 'USER' | 'COMPANY_ADMIN',
    public createdAt = new Date(),
    public updatedAt = new Date(),

  ) {}
}
