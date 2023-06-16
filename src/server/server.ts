import express from 'express';
import './shared/services/TranslationsYup'; // Traduções do yup. Deve ficar acima do router.
import { router } from './routes/index'; // Esse index é desnecessário para o caminho, ele sempre procura o index, vou deixar para ficar claro
import 'dotenv/config';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import SwaggerDocs from '../../swagger.json';

const server = express();


server.use(express.json()); // Lembre-se de deixar sempre acima do router.
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerDocs)); // Dopcumentação Swagger
server.use(cors()); // Libera o acesso através de domínios cruzados, nesse caso iremos liberar para todos
server.use(router);

export { server };