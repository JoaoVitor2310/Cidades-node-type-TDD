import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';

interface IQueryProps { // Tipo do query da request
  page?: number;
  limit?: number;
  filter?: string;
}

export const getAllValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  query: getSchema<IQueryProps>(yup.object().shape({ //Shape dos campos desejados
    page: yup.number().optional().moreThan(0),
    limit: yup.number().optional().moreThan(0),
    filter: yup.string().optional(),
  }))
}));


// 2 objetos vazios pq o ReqQuery tem que ficar na 4° posição, só passar o mouse em cima de Request para ver.
export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  
  // setHeader define o headers com (chave, valor)
  res.setHeader('access-control-expose-headers', 'x-total-count'); // Libera o acesso para o x-total-count no navegador
  res.setHeader('x-total-count', 1); // Mock do valor de registros no banco será 1
  
  return res.status(StatusCodes.OK).json([
    {
      id: 1,
      name: 'Caxias do Sul',
    }
  ]);
};