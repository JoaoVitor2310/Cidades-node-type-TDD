import express from 'express';
import { router } from './routes/index'; // Esse index é desnecessário para o caminho, ele sempre procura o index, vou deixar para ficar claro
import 'dotenv/config';
const server = express();

server.use(express.json());
server.use(router);

export { server };