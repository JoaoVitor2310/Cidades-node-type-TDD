import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';
import { PeopleProvider } from '../../database/providers/people';

interface IParamProps { // Tipo dos params da request
  id?: number;
}

export const getByIdValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  params: getSchema<IParamProps>(yup.object().shape({ //Shape dos campos desejados
    id: yup.number().integer().required().moreThan(0),
  }))
}));


// 2 objetos vazios pq o tipo ReqQuery tem que ficar na 4° posição, só passar o mouse em cima de Request para ver.
export const getById = async (req: Request<IParamProps>, res: Response) => {
  
  if(!req.params.id){ // Checa se o parâmetro id veio na requisição
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro id deve ser informado.'
      }
    });
  }
  
  const result = await PeopleProvider.getById(req.params.id); // Faz a operação com o banco de dados utilizando os providers
  
  if(result instanceof Error){ // Se a resposta for um erro
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message // Responde com o erro
      }
    })
  }

  return res.status(StatusCodes.OK).json(result); // Responde com a cidade
  
};