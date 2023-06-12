import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';
import { IUser } from '../../database/models';  
import { UsersProvider } from '../../database/providers/users';

interface IBodyProps extends Omit<IUser, 'id'>{} // Tipo do body da request. O Omit omite uma propriedade, recebe um 'objeto' e o que irá omitir dentro dele.

export const singUpValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  body: getSchema<IBodyProps>(yup.object().shape({ //Shape dos campos desejados
    name: yup.string().required().min(3),
    email: yup.string().required().email().min(5),
    password: yup.string().required().min(6),
  }))
}));


// 2 objetos vazios pq o ReqBody tem que ficar na 3° posição, só passar o mouse em cima de Request para ver
export const singUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const result = await UsersProvider.create(req.body); // Utiliza o provider para criar cidade no banco de dados
  
  if(result instanceof Error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }
  
  return res.status(201).json(result); // Retorna 201 CREATED com os dados
};