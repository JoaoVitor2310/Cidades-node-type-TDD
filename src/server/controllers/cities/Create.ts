import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários

interface ICity { // Tipo do body da request
  name: string;
}

const bodyValidation: yup.ObjectSchema<ICity> = yup.object().shape({ //Shape dos campos desejados
  name: yup.string().required().min(3),
  email: yup.string().required().min(3),
});

// 2 objetos vazios pq o ReqBody tem que ficar na 3° posição, só passar o mouse em cima de Request para ver
export const create = async (req: Request<{}, {}, ICity>, res: Response) => {
  let validatedData: ICity | undefined = undefined;

  try {
    validatedData = await bodyValidation.validate(req.body, { abortEarly: false });
    const { name } = req.body;
    return res.send('Nome: ' + name);

  } catch (error) {
    const yupError = error as yup.ValidationError; // Força o typescript a tipar o erro como erro do yup

    // Record é um tipo de objeto que informa tipos de chaves e valores https://www.typescriptlang.org/docs/handbook/utility-types.html
    const errors: Record<string, string> = {};

    //Iremos agrupar os erros do yup para mandar como resposta
    yupError.inner.forEach(err => { // O inner é o array de erros
      if (err.path === undefined) return; // Se eu não tenho o path saia da função.
      errors[err.path] = err.message;
    });

    return res.status(StatusCodes.BAD_REQUEST).json({errors});
  }

};