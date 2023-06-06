// Provider é o arquivo que irá manipular os dados no banco

import { ICity } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const create = async(city: Omit<ICity, 'id'>): Promise< number | Error > => {
  try {
    const [result] = await Knex(ETableNames.city).insert(city).returning('id'); // Insere no banco e recebe o resultado, o returning é do postgrees

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