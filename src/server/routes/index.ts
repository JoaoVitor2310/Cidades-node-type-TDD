import { Router } from 'express';
import { CitiesController, PeopleController, UsersController } from '../controllers';
import { ensureAuthenticated } from '../shared/middleware';

const router = Router();

router.post('/cities', ensureAuthenticated,  CitiesController.createValidation,CitiesController.create);
router.get('/cities', ensureAuthenticated,  CitiesController.getAllValidation,CitiesController.getAll);
router.get('/cities/:id', ensureAuthenticated,  CitiesController.getByIdValidation,CitiesController.getById);
router.put('/cities/:id', ensureAuthenticated,  CitiesController.updateByIdValidation,CitiesController.updateById);
router.delete('/cities/:id', ensureAuthenticated,  CitiesController.deleteByIdValidation,CitiesController.deleteById);
router.post('/cities', ensureAuthenticated,  CitiesController.createValidation,CitiesController.create);

router.get('/people', ensureAuthenticated,  PeopleController.getAllValidation,PeopleController.getAll);
router.post('/people', ensureAuthenticated,  PeopleController.createValidation,PeopleController.create);
router.get('/people/:id', ensureAuthenticated,  PeopleController.getByIdValidation,PeopleController.getById);
router.put('/people/:id', ensureAuthenticated,  PeopleController.updateByIdValidation,PeopleController.updateById);
router.delete('/people/:id', ensureAuthenticated,  PeopleController.deleteByIdValidation,PeopleController.deleteById);

router.post('/signin',UsersController.singInValidation, UsersController.singIn);
router.post('/signup',UsersController.singUpValidation, UsersController.singUp);


export { router };