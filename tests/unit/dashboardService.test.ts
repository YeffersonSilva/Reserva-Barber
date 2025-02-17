// tests/unit/dashboardService.test.ts
import { DashboardService } from '../../src/modules/dashboard/DashboardService';
import prisma from '../../src/config/dbConfig';

jest.mock('../../src/config/dbConfig', () => ({
  __esModule: true,
  default: {
    appointment: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  const mockedPrisma = prisma as any;

  beforeEach(() => {
    dashboardService = new DashboardService();
    jest.clearAllMocks();
  });

  it('should return appointment summary', async () => {
    const companyId = 1;
    mockedPrisma.appointment.count
      .mockResolvedValueOnce(10)  // total
      .mockResolvedValueOnce(5)   // scheduled
      .mockResolvedValueOnce(3)   // completed
      .mockResolvedValueOnce(2);  // canceled

    const summary = await dashboardService.getAppointmentSummary(companyId);
    expect(summary).toEqual({
      total: 10,
      scheduled: 5,
      completed: 3,
      canceled: 2,
    });
  });

  it('should return upcoming appointments', async () => {
    const companyId = 1;
    const now = new Date();
    const appointments = [
      { id: 1, userId: 1, companyId, serviceId: 1, employeeId: null, dateTime: new Date(now.getTime() + 60000), status: 'SCHEDULED', createdAt: now, updatedAt: now },
      { id: 2, userId: 2, companyId, serviceId: 2, employeeId: null, dateTime: new Date(now.getTime() + 120000), status: 'SCHEDULED', createdAt: now, updatedAt: now },
    ];
    mockedPrisma.appointment.findMany.mockResolvedValue(appointments);

    const result = await dashboardService.getUpcomingAppointments(companyId, 10);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(appointments.length);
  });
});
