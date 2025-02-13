export class Employee {
    constructor(
      public id: number,
      public name: string,
      public email: string,
      public password: string,
      public companyId: number,
      public role: 'EMPLOYEE',
      public createdAt?: Date,
      public updatedAt?: Date,
    ) {}
  }
  