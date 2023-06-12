import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex) {
  return knex.schema.createTable(
    ETableNames.user, table => {
      table.bigIncrements('id').primary().index(); // Coluna id será de incremento, chave primária e index de pesquisa.
      table.string('name').notNullable().checkLength('>=', 3); // Coluna nome será string, não nulo e maior que 3 caracteres.
      table.string('email').index().unique().notNullable().checkLength('>=', 5); // Coluna email será string, único, não nulo e maior que 5 caracteres.
      table.string('password').notNullable().checkLength('>=', 6); // Coluna senha será string, não nulo e maior que 6 caracteres.

     

      table.comment('Table used to record users names'); // Comentário da tabela.
    }).then(() => {
      console.log(`# Create table ${ETableNames.user}`);
    });

}


export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.user).then(() => { // Exclui a tabela de dados quando for solicitada.
    console.log(`# Dropped table ${ETableNames.user}`);
  });
}

