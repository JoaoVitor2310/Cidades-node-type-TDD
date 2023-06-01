import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';

interface ICity { // Tipo do body da request
  name: string;
}

export const createValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  body: getSchema<ICity>(yup.object().shape({ //Shape dos campos desejados
    name: yup.string().required().min(3),
  }))
}));


// 2 objetos vazios pq o ReqBody tem que ficar na 3° posição, só passar o mouse em cima de Request para ver
export const create = async (req: Request<{}, {}, ICity>, res: Response) => {
  return res.status(201).json(1);
};