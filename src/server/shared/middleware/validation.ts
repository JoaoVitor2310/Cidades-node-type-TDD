import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';

// PARA ENTENDER MELHOR OS TIPOS, RECOMENDO LER DE BAIXO PARA CIMA.
// Os comentários com 3 barras, são para dizer que aquela linha serve só para ajudar o TS a reclamar no schema.

type TProperty = 'body' | 'params' | 'query' | 'header';

/// Esse será um generic, pois não sabemos o tipo, e quem usar que irá definir por parâmetro. Esse extends foi o vs code que recomendou, não se preocupe.
type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;

type TAllSchemas = Record<TProperty, ObjectSchema<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>; /// Função que retorna todos os schemas

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler; // Tipo TValidation é igual a uma arrow function que retorna um RequestHandler.

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => { // Função que irá retornar middleware, que tbm é função. Por isso duas =>
  const schemas = getAllSchemas(schema => schema);

  const errorsResult: Record<string, Record<string, string>> = {}; // Esse objeto será composto de um objeto de objetos, por isso os Records  
  
  Object.entries(schemas).forEach(([key, schema]) => { // Object.entrie transforma um objeto arrays, cada "linha" será um array: [chave, valor]; 
    try {
      schema.validateSync(req[key as TProperty], { abortEarly: false }); // validateSync é do yup para validar no formato que definimos.
      const { name } = req.body;

    } catch (error) {
      const yupError = error as ValidationError; // Força o typescript a tipar o erro como erro do yup

      // Record é um tipo de objeto que informa tipos de chaves e valores https://www.typescriptlang.org/docs/handbook/utility-types.html
      const errors: Record<string, string> = {};

      //Iremos agrupar os erros do yup para mandar como resposta
      yupError.inner.forEach(err => { // O inner é o array de erros
        if (err.path === undefined) return; // Se eu não tenho o path saia da função.
        errors[err.path] = err.message;
      });

      errorsResult[key] = errors; // Cada erro que tiver, será adicionado no objeto com os resultados lá em cima
    }
  });

  if (Object.entries(errorsResult).length === 0) {
    return next();
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
  }
};