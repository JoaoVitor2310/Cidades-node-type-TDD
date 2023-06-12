import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "./JWTService";

export const ensureAuthenticated: RequestHandler = async (req, res, next) => { // RequestHandler é o tipo do middleware
  const {authorization} = req.headers;
  
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: 'Não autenticado' }
    });
  }
  
  const [type, token] = authorization.split(' '); // O tipo vem antes do espaço, e depois o token
  
  if(type !== 'Bearer'){
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Não autenticado'
      }
    })
  }

  const jwtData = JWTService.verify(token);

  if(jwtData === 'JWT_SECRET_NOT_FOUND'){ // Se não foi configurado o secret no servidor
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: 'Erro ao verificar o token, tente mais tarde.'
      }
    })
  } else if(jwtData === "INVALID_TOKEN"){ // Se o token não é válido
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Não autenticado'
      }
    })
  }

  req.headers.idUser = jwtData.uid.toString(); // Insere o id do usuário na requisição

  return next();
}