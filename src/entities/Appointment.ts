export class Appointment {
    constructor(
      public id: number,
      public userId: number,
      public companyId: number,
      public serviceId: number,
      public employeeId: number | null,
      public dateTime: Date,
      public status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED',
      public createdAt?: Date,
      public updatedAt?: Date,
    ) {}
  }
  