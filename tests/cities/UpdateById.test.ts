import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Cities - UpdateById', () => {

  it('Updates record', async () => {

    const res1 = await testServer
      .post('/cities')
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Cria registro primeiro

    const updateRes = await testServer
      .put(`/cities/${res1.body}`)
      .send({ name: 'Caxias' });

    expect(updateRes.statusCode).toEqual(StatusCodes.NO_CONTENT); // Recebe resposta sem conteúdo
  });
  
  it('Try to update record that doesnt exist', async () => {

    const res1 = await testServer
      .put('/cities/99999')
      .send({ name: 'Caxias' });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Recebe erro de servidor
    expect(res1.body).toHaveProperty('errors.default'); // Recebe erro
  });
});