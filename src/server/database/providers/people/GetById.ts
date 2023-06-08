// Provider é o arquivo que irá manipular os dados no banco
import { ETableNames } from "../../ETableNames";
import { IPerson } from "../../models";
import { Knex } from "../../knex";

export const getById = async (id: number): Promise<IPerson | Error> => { // Busca uma pessoa pelo id
  try {
    const result = await Knex(ETableNames.person) // Seleciona a tabela
    .select('*'). // Seleciona as colunas
    where('id', '=', id)
    .first(); // Seleciona quem, nesse caso o primeiro, pq vem um array de valores

    if (result) return result;

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar o registro.')
  }
}