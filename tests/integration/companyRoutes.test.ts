// tests/integration/companyRoutes.test.ts
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/dbConfig';
import { signToken } from '../../src/utils/token';

describe('Rutas de Company', () => {
  // Generamos un token de prueba para un usuario ADMIN. 
  // En un entorno real podrías crear un usuario de test en la base de datos.
  let token: string;

  beforeAll(async () => {
    token = signToken({ id: 1, role: 'ADMIN', companyId: null }, '15m');
  });

  afterAll(async () => {
    // Se cierra la conexión con la base de datos al finalizar las pruebas
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
      .set('Authorization', `Bearer ${token}`)
      .send(companyData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('company');
    expect(response.body.company.name).toBe(companyData.name);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('debe listar todas las empresas', async () => {
    const response = await request(app)
      .get('/companies')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Puedes agregar pruebas adicionales para GET por ID, PUT y DELETE.
});
