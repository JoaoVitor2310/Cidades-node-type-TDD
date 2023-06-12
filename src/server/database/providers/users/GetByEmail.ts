// Provider é o arquivo que irá manipular os dados no banco
import { ETableNames } from "../../ETableNames";
import { IUser } from "../../models";
import { Knex } from "../../knex";

export const getByEmail = async (email: string): Promise<IUser | Error> => {
  try {
    const result = await Knex(ETableNames.user) // Seleciona a tabela
    .select('*'). // Seleciona as colunas
    where('email', '=', email)
    .first(); // Seleciona quem, nesse caso o primeiro, pq vem um array de valores

    if (result) return result;

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar o registro.')
  }
}