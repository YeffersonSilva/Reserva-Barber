// src/entities/Service.ts
export class Service {
  constructor(
    public id: number,
    public companyId: number,
    public name: string,
    public description: string,
    public duration: number,
    public active: boolean = true,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
