// Provider é o arquivo que irá manipular os dados no banco

import { IPerson } from "../../models";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const updateById = async(id: number, person: Omit<IPerson, 'id'>): Promise< void | Error > => {
  try {
    const [{ count }] = await Knex(ETableNames.city) // / Conta todos os dados da tabela e guarda em count, por isso o: * as count
    .where('id', '=', person.cityId) // Procura se a cidade da pessoa existe, já que a pessao TEM que ter uma cidade cadastrada
    .count<[{ count: number }]>('* as count'); //Tipagem "estranha" por conta do knex
    
    if(count === 0){ // Se for 0 é pq a pessoa não tem cidade cadastrada
      return new Error('A cidade usada no cadastro não foi encontrada.');
    }
    
    const result = await Knex(ETableNames.person) // Result irá receber o resultado da consulta no banco 'person'
    .update(person) // Atualiza no banco
    .where('id', '=', id); // Onde o id da pessoa é igual o id da requisição

    if (result > 0) return;

    return new Error('Erro ao atualizar o registro.');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao atualizar o registro.')
  }
  
}