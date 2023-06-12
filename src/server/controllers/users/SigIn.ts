import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { JWTService, validation } from '../../shared/middleware';
import { IUser } from '../../database/models';
import { UsersProvider } from '../../database/providers/users';
import { PasswordCrypto } from '../../shared/services';

interface IBodyProps extends Omit<IUser, 'id' | 'name'> { } // Tipo do body da request. O Omit omite uma propriedade, recebe um 'objeto' e o que irá omitir dentro dele.

export const singInValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  body: getSchema<IBodyProps>(yup.object().shape({ //Shape dos campos desejados
    email: yup.string().required().email().min(5),
    password: yup.string().required().min(6),
  }))
}));


// 2 objetos vazios pq o ReqBody tem que ficar na 3° posição, só passar o mouse em cima de Request para ver
export const singIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const { email, password } = req.body;


  const user = await UsersProvider.getByEmail(email); // Utiliza o provider para criar cidade no banco de dados

  if (user instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha inválidos'
      }
    })
  }

  const passwordMatch = await PasswordCrypto.verifyPassword(password, user.password)

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha inválidos'
      }
    })
  } else {
    const accessToken = JWTService.signIn({ uid: user.id });
    if (accessToken === 'JWT_SECRET_NOT_FOUND') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ // Erro caso não tenha o secret, erro interno de quem configurou o servidor
        errors: {
          default: 'Erro ao gerar o token de acesso, tente novamente mais tarde.'
        }
      })
    }

    return res.status(StatusCodes.OK).json({ accessToken })
  }




  // return res.status(201).json(user); // Retorna 201 CREATED com os dados
};