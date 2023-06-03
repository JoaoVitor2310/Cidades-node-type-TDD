import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Cities - GetById', () => {

  it('Search for record by id', async () => {

    const res1 = await testServer
      .post('/cities')
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Primeiro cria o registro

    const resBuscada = await testServer
      .get(`/cities/${res1.body}`)
      .send();

    expect(resBuscada.statusCode).toEqual(StatusCodes.OK); // Depois espera uma resposta 200
    expect(resBuscada.body).toHaveProperty('name'); // E com um nome no corpo
  });
  
  it('Try to search record that doesnt exist', async () => {

    const res1 = await testServer
      .get('/cities/99999')
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Irá retornar um erro
    expect(res1.body).toHaveProperty('errors.default'); // Retorna um objeto com essas propriedades
  });
});