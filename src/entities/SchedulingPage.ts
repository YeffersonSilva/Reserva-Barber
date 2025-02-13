export class SchedulingPage {
    constructor(
      public id: number,
      public companyId: number,
      public slug: string | null,
      public background: string | null,
      public title: string | null,
      public description: string | null,
      public customCss: string | null,
      public customJs: string | null,
      public createdAt?: Date,
      public updatedAt?: Date,
    ) {}
  }
  