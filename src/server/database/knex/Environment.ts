import { Knex } from 'knex';
import path from 'path';

export const development: Knex.Config = {
  client: 'sqlite3', // Nome do banco que iremos usar
  useNullAsDefault: true,
  connection: { // Arquivo de configuração de conexão
    filename: path.resolve(__dirname, '..', '..', '..', '..', 'database.sqlite'),
  },
  migrations: { // Arquivo de configuração de migration
    directory: path.resolve(__dirname, '..', 'migrations'),
  },
  seeds: { // Arquivo de configuração de seeds
    directory: path.resolve(__dirname, '..', 'seeds'),
  },
  pool: { // Configuração extra pro sqlite aceitar forign keys
    afterCreate: (connection: any, done: Function) => {
      connection.run('PRAGMA foreign_keys = ON');
      done();
    }
  }
};

export const test: Knex.Config = {
  ...development, // Mesma configuração do development, PORÉM...
  connection: ':memory:' // A conexão será na memória, ou seja, depois de testar ele irá excluir tudo e recomeçar na próxima vez.
};

export const production: Knex.Config = {
  client: 'pg', // Nome do banco que iremos usar
  migrations: { // Arquivo de configuração de migration
    directory: path.resolve(__dirname, '..', 'migrations'),
  },
  seeds: { // Arquivo de configuração de seeds
    directory: path.resolve(__dirname, '..', 'seeds'),
  },
  pool: { // Configuração extra pro sqlite aceitar forign keys
    afterCreate: (connection: any, done: Function) => {
      connection.run('PRAGMA foreign_keys = ON');
      done();
    }
  },
  connection: { // Arquivo de configuração de conexão
    host: process.env.DATABASE_HOST, // Endereço do servidor
    user: process.env.DATABASE_USER, // Usuário administrador
    database: process.env.DATABASE_NAME, // Nome do banco
    password: process.env.DATABASE_PASSWORD, // Senha do banco
    port: Number(process.env.DATABASE_PORT || 5432), // Porta do servidor. Tem que ser number
    ssl: {rejectUnauthorized: false}, // Segurança de conexão.
  },
};