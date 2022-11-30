import { hash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import { User } from '../../../../modules/accounts/infra/typeorm/entities/User';
import createConnection from '../index';

async function create() {
  const connection = await createConnection();

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

  await connection.close();
}

create().then(() => console.log('Admin user created!'));
