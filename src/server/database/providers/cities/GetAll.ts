// Provider é o arquivo que irá manipular os dados no banco

import { ICity } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<ICity[] | Error> => {
  try {
    const result = await Knex(ETableNames.city) // Result irá receber o resultado da consulta no banco 'city'
      .select('*') // Seleciona todas as colunas
      .where('id', '=', Number(id)) // Onde o id é igual ao id da requisição
      .orWhere('name', 'like', `%${filter}%`) // Ou, onde o nome for like(contém) o filtro de pesquisa da requisição
      .offset((page - 1) * limit) // Offset determina o início dos registros, se a página for 1, o offset será 0 e irá retornar da posição 0 até o limite
      .limit(limit); // Determina a última posição de registro, se o offset for 0 e o limit 10, então irá mostrar do 0 até o 9

    if (id > 0 && result.every(item => item.id !== id)) { // Se a busca é pelo id e não foi encontrado na busca anterior, busca de novo.
      const resultById = await Knex(ETableNames.city)
        .select('*') // Todas as colunas
        .where('id', '=', id) // Onde o id é igual oa id da requisição
        .first(); // Retorne o primeiro

        if(resultById) return [...result, resultById];
    }

    return result;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar os registros.')
  }

}