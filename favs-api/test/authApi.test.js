const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../src/models/User');
const server = require('../src/server');

const api = supertest(server);

const mockUser = {
  email: 'test@gmail.com',
  password: 'testing123',
};

describe('/api/auth/local tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  test('POST /register should return user with status 201', async () => {
    const res = await api.post('/api/auth/local/register').send(mockUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.email).toEqual(mockUser.email);
  });

  test('POST /register with invalid email should return error 400', async () => {
    const res = await api.post('/api/auth/local/register').send({
      email: 'fake@email',
      password: 'password',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('email must be a valid email');
  });

  test('POST /register without password should return error 400', async () => {
    const res = await api
      .post('/api/auth/local/register')
      .send({ email: 'fake@email' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('password is a required field');
  });

  test('POST /register with a taken email should return error 400', async () => {
    await api.post('/api/auth/local/register').send(mockUser);
    const res = await api.post('/api/auth/local/register').send(mockUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('user with email already exists');
  });

  test('POST /login should return jwt token', async () => {
    await api.post('/api/auth/local/register').send(mockUser);
    const res = await api.post('/api/auth/local/login').send(mockUser);

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.token === 'string').toEqual(true);
  });

  test('POST /login with invalid credentials should return error 400', async () => {
    const res = await api.post('/api/auth/local/login').send({
      email: 'fake@gmail.com',
      password: 'password',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('invalid username or password');
  });

  test('POST /login without password should return error 400', async () => {
    const res = await api.post('/api/auth/local/login').send({
      email: 'fake@gmail.com',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('password is a required field');
  });

  test('GET /me should return current user without passwordHash', async () => {
    await api.post('/api/auth/local/register').send(mockUser);
    const loginRes = await api.post('/api/auth/local/login').send(mockUser);

    const bearerToken = loginRes.body.token;
    const res = await api
      .get('/api/auth/local/me')
      .set('Authorization', `bearer ${bearerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(mockUser.email);
    expect(res.body.passwordHash).toBeUndefined();
  });

  test('GET /me without token should return error 400', async () => {
    const res = await api.get('/api/auth/local/me');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('missing token');
  });

  test('GET /me with invalid token should return error 400', async () => {
    const res = await api
      .get('/api/auth/local/me')
      .set('Authorization', 'bearer 1234');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('invalid token');
  });
});
