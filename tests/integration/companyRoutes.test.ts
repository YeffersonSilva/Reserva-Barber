// tests/integration/companyRoutes.test.ts
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/dbConfig';

describe('Rutas de Company', () => {
  let adminToken: string;
  let adminUserId: number;
  let companyId: number;

  beforeAll(async () => {
    // Limpiar la tabla de usuarios (idealmente, usar una BD de test)
    await prisma.user.deleteMany({});
    // Registrar un usuario admin a través del endpoint de autenticación
    const adminData = {
      name: "Test Admin",
      email: "admin@test.com",
      password: "password123",
      phone: "123456789",
      role: "ADMIN"
    };
    const res = await request(app)
      .post('/auth/register')
      .send(adminData);
    expect(res.status).toBe(201);
    adminToken = res.body.token;
    adminUserId = res.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe crear una empresa y reemitir un token actualizado', async () => {
    const companyData = {
      name: 'Integration Test Company',
      logo: 'logo.png',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
    };

    const response = await request(app)
      .post('/companies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(companyData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('company');
    expect(response.body.company.name).toBe(companyData.name);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
    companyId = response.body.company.id;
    // Actualizamos el token para futuras pruebas (ahora incluye companyId)
    adminToken = response.body.token;
  });

  it('debe obtener una empresa por ID', async () => {
    const response = await request(app)
      .get(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', companyId);
    expect(response.body).toHaveProperty('name');
  });

  it('debe actualizar una empresa', async () => {
    const updateData = { name: "Updated Company Name" };
    const response = await request(app)
      .put(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateData.name);
  });

  it('debe eliminar una empresa y confirmar su eliminación', async () => {
    // Eliminar la empresa
    const deleteRes = await request(app)
      .delete(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(204);

    // Intentar obtener la empresa eliminada
    const getRes = await request(app)
      .get(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(404);
  });

  it('debe listar todas las empresas', async () => {
    // Se espera que, al menos, la empresa creada previamente (si no se eliminó) o
    // otras empresas registradas, se devuelvan en el listado.
    const response = await request(app)
      .get('/companies')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Caso negativo: acceso sin token
  it('debe fallar al acceder a una ruta protegida sin token', async () => {
    const res = await request(app)
      .get('/companies');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
