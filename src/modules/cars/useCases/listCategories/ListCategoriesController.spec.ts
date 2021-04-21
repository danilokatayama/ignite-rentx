import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('List Categories Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const adminUser = new User();
    const id = uuidV4();
    const password = await hash('admin', 8);

    Object.assign(adminUser, {
      name: 'admin',
      email: 'admin@rentx.com.br',
      password,
      driver_license: 'XXXXXXX',
      isAdmin: true,
      created_at: new Date(),
    });

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          id,
          name: 'admin',
          email: 'admin@rentx.com.br',
          password,
          driver_license: 'XXXXXXX',
          isAdmin: true,
        },
      ])
      .execute();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { refresh_token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toEqual('Category Supertest');
  });
});
