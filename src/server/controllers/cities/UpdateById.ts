import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';

interface IParamProps { // Tipo dos params da request
  id?: number;
}

interface IBodyProps { // Tipo do body da request
  name: string;
}

export const updateByIdValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  params: getSchema<IParamProps>(yup.object().shape({ //Shape dos campos desejados
    id: yup.number().integer().required().moreThan(0),
  })),
  body: getSchema<IBodyProps>(yup.object().shape({ //Shape dos campos desejados
    name: yup.string().required().min(3),
  }))
}));


// 2 objetos vazios pq o ReqQuery tem que ficar na 4° posição, só passar o mouse em cima de Request para ver.
export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
  
  if(Number(req.params.id) === 99999){ // Útil somente enquanto não temos o banco de dados para comparar.
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Record not found'
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};