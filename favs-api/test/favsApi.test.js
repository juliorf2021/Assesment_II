const mongoose = require('mongoose');
const supertest = require('supertest');
const FavsList = require('../src/models/FavsList');
const User = require('../src/models/User');
const server = require('../src/server');

const api = supertest(server);

const authorizationHeader = { authorization: '' };

describe('/api/favs tests', () => {
  beforeAll(async () => {
    const user = {
      email: 'email@gmail.com',
      password: 'password',
    };

    const registerRes = await api.post('/api/auth/local/register').send(user);
    const loginRes = await api.post('/api/auth/local/login').send(user);

    authorizationHeader.authorization = `bearer ${loginRes.body.token}`;

    await FavsList.create({
      name: 'My Favs',
      userId: registerRes.body._id,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await FavsList.deleteMany({});
    mongoose.connection.close();
  });

  test('GET / should return an array of size 1', async () => {
    const res = await api.get('/api/favs').set(authorizationHeader);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('My Favs');
    expect(res.body[0].favs.length).toEqual(0);
  });

  test('POST / should return the created favs with status 201', async () => {
    const res = await api
      .post('/api/favs')
      .send({
        name: 'test',
      })
      .set(authorizationHeader);

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('test');
  });

  test('GET /:id should return favs with correct name', async () => {
    const createRes = await api
      .post('/api/favs')
      .send({
        name: 'name',
      })
      .set(authorizationHeader);

    const res = await api
      .get(`/api/favs/${createRes.body._id}`)
      .set(authorizationHeader);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('name');
  });

  test('DELETE /:id should return 204', async () => {
    const createRes = await api
      .post('/api/favs')
      .send({
        name: 'delete me',
      })
      .set(authorizationHeader);

    const res = await api
      .delete(`/api/favs/${createRes.body._id}`)
      .set(authorizationHeader);

    expect(res.statusCode).toEqual(204);
  });

  test('POST /list/:id should return 201', async () => {
    const createRes = await api
      .post('/api/favs')
      .send({
        name: 'hello',
      })
      .set(authorizationHeader);

    const res = await api
      .post(`/api/favs/list/${createRes.body._id}`)
      .send({
        title: 'title',
        description: 'description',
        link: 'https://example.com',
      })
      .set(authorizationHeader);

    expect(res.statusCode).toEqual(201);
  });
});
