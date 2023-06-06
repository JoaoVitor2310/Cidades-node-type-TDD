// Define o ambiente que iremos utilizar
import { knex } from 'knex';
import { development, production, test } from './Environment';

const getEnvironment = () => { // Função que irá retornar o ambiente que estamos
  switch (process.env.NODE_ENV) {
    case 'production': return production;

    case 'test': return test;

    default: return development;
  }
};

export const Knex = knex(getEnvironment());