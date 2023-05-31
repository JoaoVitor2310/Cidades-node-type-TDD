import { Router } from 'express';
import { CitiesController } from '../controllers';

const router = Router();

router.get('/', (req, res) => {
  return res.send('Rota de teste! Utilize os outros endpoints.');
});

router.post(
  '/cities',
  // CitiesController.createQueryValidation,
  // CitiesController.createValidation,
  CitiesController.createValidation,
  CitiesController.create
);


export { router };