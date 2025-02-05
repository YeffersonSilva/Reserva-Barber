export class OperatingHour {
    constructor(
      public id: number,
      public dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
      public openTime: string,
      public closeTime: string,
      public createdAt?: Date,
      public updatedAt?: Date,
    ) {}
  }
  