import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex) {
  return knex.schema.createTable(
    ETableNames.city, table => {
      table.bigIncrements('id').primary().index(); // Coluna id será de incremento, chave primária e index de pesquisa.
      table.string('name', 150).checkLength('<=', 150).index().notNullable(); // Coluna nome será string, máx de 150 caracteres, index de pesquisa e não nulo.
      table.comment('Table used to record cities names'); // Comentário da tabela.
    }).then(() => {
    console.log(`# Create table ${ETableNames.city}`);
  });

}


export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.city).then(() => { // Exclui a tabela de dados quando for solicitada.
    console.log(`# Create table ${ETableNames.city}`);
  });
}

