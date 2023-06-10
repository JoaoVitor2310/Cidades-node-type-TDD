import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex) {
  return knex.schema.createTable(
    ETableNames.person, table => {
      table.bigIncrements('id').primary().index(); // Coluna id será de incremento, chave primária e index de pesquisa.
      table.string('fullName').index().notNullable(); // Coluna nome completo será string, index de pesquisa e não nulo.
      table.string('email').unique().notNullable(); // Coluna email será string, único e não nulo.

      table
        .bigInteger('cityId') // Coluna cidadeId será inteiro, por causa do coluna id da cidade 
        .index() // Será index de pesquisa
        .notNullable() // Não nulo.
        .references('id') // Referencia a coluna id da tabela de cidades
        .inTable(ETableNames.city)  // Referencia a coluna id da tabela de cidades
        .onUpdate('CASCADE') // Isso aqui significa que se alterarem o valor da coluna id de cidades, o valor irá atualizar  para esse campo aqui.
        .onDelete('RESTRICT'); // Garante que o campo referenciado não poderá ser apagado por causa dessa relação, CASCADE iria apagar aqui tbm e SET NULL iria limpar aqui, NO ACTION manteria o valor.

      table.comment('Table used to record people names'); // Comentário da tabela.
    }).then(() => {
      console.log(`# Create table ${ETableNames.person}`);
    });

}


export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.person).then(() => { // Exclui a tabela de dados quando for solicitada.
    console.log(`# Dropped table ${ETableNames.person}`);
  });
}

