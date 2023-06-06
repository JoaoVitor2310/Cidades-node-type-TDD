// Provider é o arquivo que irá manipular os dados no banco

import { ICity } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const count = async (filter = ''): Promise<number | Error> => { // Calcula os registros que ainda serão mostrados nas próximas páginas
  try {
    const [{ count }] = await Knex(ETableNames.city) // Result irá receber o resultado da consulta no banco 'city'
      .where('name', 'like', `%${filter}%`) // Onde o nome for like(contém) o filtro de pesquisa da requisição
      .select('*') // Seleciona todas as colunas
      .count<[{ count: number }]>('* as count'); //

    if (Number.isInteger(Number(count))) return Number(count);

    return new Error('Erro ao consultar a quantidade total de registros.');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar a quantidade total de registros.');
  }

}