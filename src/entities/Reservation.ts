// src/entities/Reservation.ts
export class Reservation {
  constructor(
    public id: number,
    public userId: number,
    public companyId: number, // Agregamos companyId
    public serviceId: number,
    public dateTime: Date,
    public status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED',
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
