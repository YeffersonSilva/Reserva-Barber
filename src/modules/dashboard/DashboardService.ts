 // src/modules/dashboard/DashboardService.ts
import prisma from '../../config/dbConfig';

export class DashboardService {
  // Obtiene un resumen de las citas (total, programadas, completadas y canceladas)
  async getAppointmentSummary(companyId: number) {
    const total = await prisma.appointment.count({ where: { companyId } });
    const scheduled = await prisma.appointment.count({ where: { companyId, status: 'SCHEDULED' } });
    const completed = await prisma.appointment.count({ where: { companyId, status: 'COMPLETED' } });
    const canceled = await prisma.appointment.count({ where: { companyId, status: 'CANCELED' } });

    return { total, scheduled, completed, canceled };
  }

  // Obtiene las próximas citas (por defecto, las 10 más próximas)
  async getUpcomingAppointments(companyId: number, limit: number = 10) {
    const now = new Date();
    const appointments = await prisma.appointment.findMany({
      where: { companyId, dateTime: { gte: now } },
      orderBy: { dateTime: 'asc' },
      take: limit,
    });
    return appointments;
  }
}
