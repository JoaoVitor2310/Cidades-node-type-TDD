import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';

interface IParamProps { // Tipo dos params da request
  id?: number;
}

export const deleteByIdValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  params: getSchema<IParamProps>(yup.object().shape({ //Shape dos campos desejados
    id: yup.number().integer().required().moreThan(0),
  }))
}));


// 2 objetos vazios pq o ReqQuery tem que ficar na 4° posição, só passar o mouse em cima de Request para ver.
export const deleteById = async (req: Request<IParamProps>, res: Response) => {
  
  if(Number(req.params.id) === 99999){ // Útil somente enquanto não temos o banco de dados para comparar.
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Record not found'
      }
    });
  }
  
  return res.status(StatusCodes.NO_CONTENT).send();
};