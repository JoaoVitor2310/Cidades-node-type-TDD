// Arquivo para gerenciar o JWT
import * as jwt from 'jsonwebtoken';

interface IJWTData {
  uid: number;
}

export const signIn = (data: IJWTData): string | 'JWT_SECRET_NOT_FOUND' => { // Gera o token
  if(!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND'; // Se não tiver o secret, retorna uma mensagem

  return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '7d'}); // Gera o token, expirando em 7 dias
}



export const verify = (token: string): IJWTData | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' => { // Verifica o token
  if(!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND'; // Se não tiver o secret, retorna uma mensagem

try {
  const decoded =  jwt.verify(token, process.env.JWT_SECRET)
  
  if(typeof decoded === 'string'){
    return 'INVALID_TOKEN';
  }

  return decoded as IJWTData;
} catch (error) {
  return 'INVALID_TOKEN';
}


}

export const JWTService = {
  signIn,
  verify
}