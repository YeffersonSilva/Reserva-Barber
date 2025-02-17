// tests/integration/system.test.ts
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/dbConfig';

describe('System Integration Tests', () => {
  let adminToken: string;
  let adminUserId: number;
  let companyId: number;
  let employeeId: number;
  let serviceId: number;
  let appointmentId: number;

  // Antes de las pruebas: limpiamos las tablas relevantes y creamos un usuario admin mediante el endpoint de registro
  beforeAll(async () => {
    // Limpieza de datos (esto asume que estás en un entorno de pruebas)
    await prisma.appointment.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.schedulingPage.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.user.deleteMany({});

    // Registrar usuario admin
    const adminData = {
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      phone: "123456789",
      role: "ADMIN"
    };

    const registerRes = await request(app)
      .post('/auth/register')
      .send(adminData);
    expect(registerRes.status).toBe(201);
    adminToken = registerRes.body.token;
    adminUserId = registerRes.body.user.id;
  });

  // Al finalizar desconectamos Prisma
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Company Endpoints', () => {
    it('should create a company and reissue a token with companyId', async () => {
      const companyData = {
        name: "Test Company",
        logo: "company.png",
        primaryColor: "#ffffff",
        secondaryColor: "#000000"
      };

      const res = await request(app)
        .post('/companies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(companyData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('company');
      expect(res.body.company.name).toBe(companyData.name);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
      // Actualizamos el token para usarlo en las siguientes pruebas (ahora incluye companyId)
      adminToken = res.body.token;
      companyId = res.body.company.id;
    });

    it('should list companies', async () => {
      const res = await request(app)
        .get('/companies')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update a company', async () => {
      const updateData = { name: "Updated Company Name" };
      const res = await request(app)
        .put(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updateData.name);
    });

    it('should delete a company', async () => {
      // Para no afectar otras pruebas, primero creamos una empresa temporal
      const tempCompany = {
        name: "Temp Company",
        logo: "temp.png",
        primaryColor: "#000000",
        secondaryColor: "#ffffff"
      };
      const createRes = await request(app)
        .post('/companies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tempCompany);
      expect(createRes.status).toBe(201);
      const tempCompanyId = createRes.body.company.id;

      const deleteRes = await request(app)
        .delete(`/companies/${tempCompanyId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(deleteRes.status).toBe(204);
    });
  });

  describe('Employee Endpoints', () => {
    it('should create an employee', async () => {
      const employeeData = {
        name: "Employee One",
        email: "employee1@test.com",
        password: "password123"
      };

      const res = await request(app)
        .post('/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(employeeData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      employeeId = res.body.id;
    });

    it('should list employees for the company', async () => {
      const res = await request(app)
        .get('/employees')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Service Endpoints', () => {
    it('should create a service', async () => {
      const serviceData = {
        name: "Haircut",
        description: "Basic haircut service",
        duration: 30
      };

      const res = await request(app)
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(serviceData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(serviceData.name);
      serviceId = res.body.id;
    });

    it('should list services for the company', async () => {
      const res = await request(app)
        .get('/services')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Appointment Endpoints', () => {
    it('should create an appointment', async () => {
      // Crearemos una cita (appointment) usando el servicio creado
      const appointmentData = {
        serviceId: serviceId,
        dateTime: new Date().toISOString()
      };

      const res = await request(app)
        .post('/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      appointmentId = res.body.id;
    });

    it('should list appointments by company', async () => {
      const res = await request(app)
        .get('/appointments')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update an appointment', async () => {
      // Actualizaremos el estado de la cita
      const updateData = { status: "CANCELED" };
      const res = await request(app)
        .put(`/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("CANCELED");
    });

    it('should delete an appointment', async () => {
      const res = await request(app)
        .delete(`/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });
  });

  describe('Scheduling Page Endpoints', () => {
    it('should create a scheduling page', async () => {
      const schedulingData = {
        title: "Book Your Appointment",
        description: "Schedule your service online."
      };

      const res = await request(app)
        .post('/scheduling-page')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(schedulingData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('should get the scheduling page for the company', async () => {
      const res = await request(app)
        .get('/scheduling-page')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
    });

    it('should get the scheduling page link', async () => {
      const res = await request(app)
        .get('/scheduling-page/link')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('link');
    });
  });

  describe('Dashboard Endpoints', () => {
    it('should get appointment summary', async () => {
      const res = await request(app)
        .get('/dashboard/summary')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('scheduled');
      expect(res.body).toHaveProperty('completed');
      expect(res.body).toHaveProperty('canceled');
    });

    it('should get upcoming appointments', async () => {
      const res = await request(app)
        .get('/dashboard/upcoming')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Auth Negative Cases', () => {
    it('should fail accessing a protected route without token', async () => {
      const res = await request(app)
        .get('/companies');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
});
