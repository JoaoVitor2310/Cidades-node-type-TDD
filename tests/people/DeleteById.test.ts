import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';


describe('People - DeleteById', () => {

  let cityId: number | undefined = undefined;

  beforeAll(async () => { // Antes de testar, vamos criar a cidade que terá o cityId(obrigatório) da pessoa
    const cityRes = await testServer
      .post('/cities')
      .send({ name: 'city to test' });

    cityId = cityRes.body;
  })



  it('Deletes record', async () => {

    const res1 = await testServer
      .post('/people')
      .send({ // Envia os dados para criar um exemplo e deletar depois
        cityId,
        email: 'abc@gmail.com',
        fullName: 'abc'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Vamos criar para depois deletar

    const deletedRes = await testServer
      .delete(`/people/${res1.body}`)
      .send();

    expect(deletedRes.statusCode).toEqual(StatusCodes.NO_CONTENT); // A resposta será sem conteúdo, depois de ter deletado
  });

  it('Try to delete record that doesnt exist', async () => {

    const res1 = await testServer // Id mockado que colocamos para dizer que não existe. 
      .delete('/people/99999')
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default'); // Resposta terá um erro
  });
});