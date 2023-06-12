// Provider é o arquivo que irá manipular os dados no banco

import { IUser } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { PasswordCrypto } from "../../../shared/services";

export const create = async(user: Omit<IUser, 'id'>): Promise< number | Error > => {
  try {
    const hashedPassword = await PasswordCrypto.hashPassword(user.password); // Cria o hash da senha para passar no provider
    
    
    const [result] = await Knex(ETableNames.user).insert({...user, password: hashedPassword}).returning('id'); // Insere no banco e recebe o resultado, o returning é do postgrees

    if (typeof result === 'object') { // O banco manda um objeto quando dá certo
      return result.id;
    } else if(typeof result === 'number'){
      return result;
    }
    
    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao cadastrar o registro');
  }
  
}