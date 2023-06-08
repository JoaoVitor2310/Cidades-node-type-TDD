//Arquivo de setup do Jest
import supertest from 'supertest';
import { server } from '../src/server/server';
import { Knex } from '../src/server/database/knex';

// Inicia o banco na memória
beforeAll(async () => {
  await Knex.migrate.latest(); // Faz o migrate
  await Knex.seed.run(); // Faz o seed
});

// Encerra o banco da memória
afterAll(async () => {
  await Knex.destroy(); // Deleta o banco
});


export const testServer = supertest(server);