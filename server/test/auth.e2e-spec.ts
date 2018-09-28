import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { settings } from '../src/settings';

const serverHost = `http://localhost:${process.env.PORT}`;

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken, refreshToken;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('should fail when username is empty', async () => {
    return await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/login`)
      .send({
        username: '',
        password: 'test1234'
      })
      .expect(404);
  });

  it('should fail when username fails', async () => {
    return await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/login`)
      .send({
        username: 'failed',
        password: 'test1234'
      })
      .expect(404);
  });

  it('should fail when password fails', async () => {
    return await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/login`)
      .send({
        username: 'admin',
        password: 'failed'
      })
      .expect(400);
  });

  it('should return tokens after successful login', async () => {
    const response = await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/login`)
      .send({
        username: 'admin',
        password: 'test1234'
      })
      .expect(201);

    const { access_token, refresh_token } = response.body;

    accessToken = access_token;
    refreshToken = refresh_token;

    expect(access_token).toBeString();
    expect(refresh_token).toBeString();
  });

  it('should not return new access token after send wrong refresh token', async () => {
    await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/token/refresh`)
      .send({
        refresh_token: 'failed'
      })
      .expect(401);
  });

  it('should return new access token after send right refresh', async () => {
    const response = await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/token/refresh`)
      .send({
        refresh_token: refreshToken
      })
      .expect(201);

    const { access_token, refresh_token } = response.body;

    expect(access_token).toBeString();
    expect(refresh_token).toBeString();
    expect(refresh_token).toBe(refreshToken);
  });

  it('should not reject token when auth data provided es wrong', async () => {
    await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/token/reject`)
      .set({
        Authorization: `Bearer failed`
      })
      .send({ refresh_token: refreshToken })
      .expect(401);
  });

  it('should reject token and block next refresh', async () => {
    const response = await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/login`)
      .send({
        username: 'admin',
        password: 'test1234'
      })
      .expect(201);

    const { access_token, refresh_token } = response.body;

    await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/token/refresh`)
      .send({ refresh_token })
      .expect(201);

    await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/token/reject`)
      .set({
        Authorization: `Bearer ${access_token}`
      })
      .send({ refresh_token })
      .expect(204);

    await request(serverHost)
      .post(`/${settings.apiPrefix}/auth/token/refresh`)
      .send({ refresh_token })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
