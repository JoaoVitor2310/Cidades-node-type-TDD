// Provider é o arquivo que irá manipular os dados no banco

import { IPerson } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const create = async (person: Omit<IPerson, 'id'>): Promise<number | Error> => {
  try {
    const [{ count }] = await Knex(ETableNames.city) // / Conta todos os dados da tabela e guarda em count, por isso o: * as count no final
      .where('id', '=', person.cityId) // Procura se a cidade da pessoa existe, já que a pessao TEM que ter uma cidade cadastrada
      .count<[{ count: number }]>('* as count'); //Tipagem "estranha" por conta do knex


    console.log(count);
    if (count === 0) {
      return new Error('A cidade usada no cadastro não foi encontrada.');
    }

    const [result] = await Knex(ETableNames.person).insert(person).returning('id'); // Insere no banco e recebe o resultado, o returning é do postgrees

    if (typeof result === 'object') { // O banco manda um objeto quando dá certo
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }

    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao cadastrar o registro');
  }

}