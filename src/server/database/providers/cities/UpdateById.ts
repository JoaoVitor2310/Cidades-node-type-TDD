// Provider é o arquivo que irá manipular os dados no banco

import { ICity } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const updateById = async(id: number, city: Omit<ICity, 'id'>): Promise< void | Error > => {
  try {
    const result = await Knex(ETableNames.city) // Result irá receber o resultado da consulta no banco 'city'
    .update(city) // Atualiza no banco
    .where('id', '=', id); // Onde o id no banco é igual ao id na requisição

    if (result > 0) return;

    return new Error('Erro ao atualizar o registro.');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao atualizar o registro.')
  }
  
}