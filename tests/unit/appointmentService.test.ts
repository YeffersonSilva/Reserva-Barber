// tests/unit/appointmentService.test.ts
import { AppointmentService } from '../../src/modules/appointments/AppointmentService';
import { IAppointmentRepository } from '../../src/repositories/interfaces/IAppointmentRepository';
import { Appointment } from '../../src/entities/Appointment';
import { AppError } from '../../src/error/AppError';

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  const mockRepo: Partial<IAppointmentRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAllByCompany: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAllWithFilters: jest.fn(),
  };

  beforeEach(() => {
    appointmentService = new AppointmentService(mockRepo as IAppointmentRepository);
    jest.clearAllMocks();
  });

  it('should create an appointment successfully', async () => {
    const data = {
      serviceId: 1,
      dateTime: new Date().toISOString(),
      employeeId: undefined,
    };
    const userId = 10;
    const companyId = 20;
    const createdAppointment = new Appointment(
      1,
      userId,
      companyId,
      data.serviceId,
      null,
      new Date(data.dateTime),
      'SCHEDULED'
    );
    (mockRepo.create as jest.Mock).mockResolvedValue(createdAppointment);

    const result = await appointmentService.createAppointment(data, userId, companyId);
    expect(result).toEqual(createdAppointment);
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('should throw error for invalid date', async () => {
    const data = {
      serviceId: 1,
      dateTime: "invalid-date",
      employeeId: undefined,
    };
    await expect(appointmentService.createAppointment(data, 10, 20)).rejects.toThrow(AppError);
  });

  it('should throw error if appointment not found by id', async () => {
    (mockRepo.findById as jest.Mock).mockResolvedValue(null);
    await expect(appointmentService.getAppointmentById(999)).rejects.toThrow(AppError);
  });

  it('should update appointment after verifying existence', async () => {
    const existingAppointment = new Appointment(1, 10, 20, 2, null, new Date(), 'SCHEDULED');
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingAppointment);
    const updatedAppointment = new Appointment(1, 10, 20, 2, null, new Date(), 'COMPLETED');
    (mockRepo.update as jest.Mock).mockResolvedValue(updatedAppointment);

    const result = await appointmentService.updateAppointment(1, { status: 'COMPLETED' });
    expect(result.status).toBe('COMPLETED');
    expect(mockRepo.findById).toHaveBeenCalledWith(1);
    expect(mockRepo.update).toHaveBeenCalledWith(1, { status: 'COMPLETED' });
  });

  it('should delete appointment if authorized', async () => {
    const existingAppointment = new Appointment(1, 10, 20, 2, null, new Date(), 'SCHEDULED');
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingAppointment);
    (mockRepo.delete as jest.Mock).mockResolvedValue(undefined);

    await expect(appointmentService.deleteAppointment(1, 10, true)).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error on unauthorized deletion', async () => {
    const existingAppointment = new Appointment(1, 10, 20, 2, null, new Date(), 'SCHEDULED');
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingAppointment);

    await expect(appointmentService.deleteAppointment(1, 11, false)).rejects.toThrow(AppError);
  });
});
