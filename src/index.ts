import { Knex } from './server/database/knex';
import { server } from './server/server';

const port = process.env.PORT || 3333; 

const startServer = () => {
  server.listen(port, () => {
    console.log(`Listening to port: ${port}`);
  });
};


if (process.env.IS_LOCALHOST !== 'true') { // Se estiver em produção
  console.log('Running migrations.'); // Inicia as tabelas

  Knex.migrate
    .latest()
    .then(() => {
      Knex.seed.run() // Inicia as seeds
        .then(() => startServer())
        .catch(console.log);
    })
    .catch(console.log);
} else {
  startServer();
}