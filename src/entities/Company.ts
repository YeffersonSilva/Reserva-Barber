export class Company {
    constructor(
      public id: number,
      public name: string,
      public logo: string | null,
      public primaryColor: string | null,
      public secondaryColor: string | null,
      public createdAt?: Date,
      public updatedAt?: Date
    ) {}
  }
  