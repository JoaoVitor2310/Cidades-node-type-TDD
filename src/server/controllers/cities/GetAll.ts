import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';
import { CitiesProvider } from '../../database/providers/cities';

interface IQueryProps { // Tipo do query da request
  page?: number;
  limit?: number;
  filter?: string;
  id?: number;
}

export const getAllValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  query: getSchema<IQueryProps>(yup.object().shape({ //Shape dos campos desejados
    page: yup.number().optional().moreThan(0),
    limit: yup.number().optional().moreThan(0),
    filter: yup.string().optional(),
    id: yup.number().integer().optional().default(0),
  }))
}));


// 2 objetos vazios pq o ReqQuery tem que ficar na 4° posição, só passar o mouse em cima de Request para ver.
export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {

  // Faz a chamada no provider passando os valores recebidos, se não receber um valor, envia um padrão.
  const result = await CitiesProvider.getAll(req.query.page || 1, req.query.limit || 10, req.query.filter || '', Number(req.query.id) || 0);

  const count = await CitiesProvider.count(req.query.filter); // Identifica quantos resultados encontrou, para mostrar ao usuário

  if (result instanceof Error) { // Verifica se deu erro na consulta
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  } else if (count instanceof Error) { // Verifica se deu erro na consulta de todos os resultados
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: count.message
      }
    })
  }


  // setHeader define o headers com a sintaxe: (chave, valor)
  res.setHeader('access-control-expose-headers', 'x-total-count'); // Libera o acesso para o x-total-count no navegador
  res.setHeader('x-total-count', count); // Coloca a quantidade de registros encontrados no header para o client

  return res.status(StatusCodes.OK).json(result); // Retorna o resultado com status 200
};