// Provider é o arquivo que irá manipular os dados no banco
import { ETableNames } from "../../ETableNames";
import { ICity } from "../../models";
import { Knex } from "../../knex";

export const getById = async (id: number): Promise<ICity | Error> => {
  try {
    const result = await Knex(ETableNames.city) // Seleciona a tabela
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