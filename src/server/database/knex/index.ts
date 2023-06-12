// Define o ambiente que iremos utilizar
import { knex } from 'knex';
import { development, production, test } from './Environment';
import 'dotenv/config'; // Garante que as variáveis irão funcionar neste arquivo
import pg from 'pg'; // Postgree

if(process.env.NODE_ENV === 'production'){
  pg.types.setTypeParser(20, 'text', parseInt); // Arruma config do postgree de transformar tudo para string
}

const getEnvironment = () => { // Função que irá retornar o ambiente que estamos
  switch (process.env.NODE_ENV) {
    case 'production': return production;

    case 'test': return test;

    default: return development;
  }
};

export const Knex = knex(getEnvironment());