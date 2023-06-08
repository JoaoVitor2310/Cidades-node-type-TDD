// Provider é o arquivo que irá manipular os dados no banco

import { IPerson } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const getAll = async (page: number, limit: number, filter: string): Promise<IPerson[] | Error> => {
  try {
    const result = await Knex(ETableNames.person) // Result irá receber o resultado da consulta no banco 'person'
      .select('*') // Seleciona todas as colunas
      .where('fullName', 'like', `%${filter}%`) // Onde o nome for like(contém) o filtro de pesquisa da requisição
      .offset((page - 1) * limit) // Offset determina o início dos registros, se a página for 1, o offset será 0 e irá retornar da posição 0 até o limite
      .limit(limit); // Determina a última posição de registro, se o offset for 0 e o limit 10, então irá mostrar do 0 até o 9

    return result;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar os registros.')
  }

}