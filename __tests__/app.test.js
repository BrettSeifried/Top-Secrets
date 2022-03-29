const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up a user via post', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
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
      .post('/api/v1/auth/session')
      .send({ email: 'brettford@defense.gov', password: 'password' });

    expect(res.body).toEqual({
      message: 'Sign In Sucessful',
      user,
    });
  });

  // it('');
});
