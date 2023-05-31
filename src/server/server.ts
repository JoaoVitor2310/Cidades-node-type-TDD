import express from 'express';
import './shared/services/TranslationsYup'; // Traduções do yup. Deve ficar acima do router.
import { router } from './routes/index'; // Esse index é desnecessário para o caminho, ele sempre procura o index, vou deixar para ficar claro
import 'dotenv/config';
const server = express();


server.use(express.json()); // Lembre-se de deixar sempre acima do router.
server.use(router);

export { server };