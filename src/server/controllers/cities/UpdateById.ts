import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';
import { ICity } from '../../database/models';
import { CitiesProvider } from '../../database/providers/cities';

interface IParamProps { // Tipo dos params da request
  id?: number;
}

interface IBodyProps extends Omit<ICity, 'id'>{ // Tipo do body da request
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
  
  if(!req.params.id){ // Checa se o parâmetro id veio na requisição
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'The id parameter needs to be informed'
      }
    });
  }

  const result = await CitiesProvider.updateById(req.params.id, req.body); // Faz a operação com o banco de dados utilizando os providers
  
  if(result instanceof Error){ // Se a resposta for um erro
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }

  return res.status(StatusCodes.ACCEPTED).send(result); // Responde com o objeto atualizado
};