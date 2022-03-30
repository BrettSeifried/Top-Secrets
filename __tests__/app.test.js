const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const { agent } = require('supertest');

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up a user via post', async () => {
    const res = await request(app)
      .post('/api/v1/users/')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'brettford@defense.gov',
    });
  });

  it('users can sign in', async () => {
    const user = await UserService.create({
      email: 'brettford@defense.gov',
      password: 'password',
    });

    const res = await request(app)
      .post('/api/v1/users/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    expect(res.body).toEqual({
      message: 'Sign In Sucessful',
      user,
    });
  });

  it('signs in and retireves the currently signed in user', async () => {
    const agent = request.agent(app);

    await UserService.create({
      email: 'brettford@defense.gov',
      password: 'password',
    });

    await agent
      .post('/api/v1/users/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    const res = await agent.get('/api/v1/users/me');
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'brettford@defense.gov',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('only signed in users can see messages', async () => {
    const agent = request.agent(app);

    await UserService.create({
      email: 'brettford@defense.gov',
      password: 'password',
    });

    let res = await agent.get('/api/v1/users/private');
    expect(res.status).toEqual(401);

    await agent
      .post('/api/v1/users/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    res = await agent.get('/api/v1/users/private');

    expect(res.body).toEqual({
      note: 'Top Secret! You can only see this if you are logged in',
    });
  });

  it('only logged in users to view messages', async () => {
    const agent = request.agent(app);

    await UserService.create({
      email: 'brettford@defense.gov',
      password: 'password',
    });

    let res = await agent.get('/api/v1/notes');
    expect(res.status).toEqual(401);

    await agent
      .post('/api/v1/users/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    res = await agent.get('/api/v1/notes');
    expect(res.status).toEqual(200);
  });

  it('delete logs out user', async () => {
    const agent = request.agent(app);

    await UserService.create({
      email: 'brettford@defense.gov',
      password: 'password',
    });

    await agent
      .post('/api/v1/users/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    const res = await agent.delete('/api/v1/users/session');
    expect(res.body).toEqual({ success: true, message: 'Sign out successful' });
  });

  it.only('signed in users can posts notes', async () => {
    const agent = request.agent(app);

    const expected = {
      title: 'Test',
      content: 'Test Content',
      createdAt: expect.any(String),
    };
    await UserService.create({
      email: 'brettford@defense.gov',
      password: 'password',
    });

    await agent
      .post('/api/v1/users/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });
    // await agent.get('/api/v1/notes');
    const res = await agent.post('/api/v1/notes').send(expected);

    expect(res.body).toEqual({ id: expect.any(String), ...expected });
  });
});
