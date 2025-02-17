// tests/integration/authEndpoints.test.ts
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/dbConfig';

describe('Auth Endpoints', () => {
  // Antes de cada prueba limpiamos la tabla de usuarios (ideal para una base de datos de test)
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user successfully', async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      phone: "555123456",
      role: "CLIENT"
    };
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should not register a user with an existing email', async () => {
    const userData = {
      name: "Test User",
      email: "duplicate@example.com",
      password: "password123",
      phone: "555123456",
      role: "CLIENT"
    };
    // Registrar el usuario
    await request(app).post('/auth/register').send(userData);
    // Intentar registrar nuevamente con el mismo email
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should login a registered user successfully', async () => {
    const userData = {
      name: "Login User",
      email: "login@example.com",
      password: "password123",
      phone: "555987654",
      role: "CLIENT"
    };
    // Registrar el usuario
    await request(app).post('/auth/register').send(userData);
    // Intentar login
    const res = await request(app).post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: "nonexistent@example.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
