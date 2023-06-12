import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Cities - UpdateById', () => {

  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'updateById-cities@gmail.com';
    const password = '1234567';
    await testServer.post('/signUp').send({
      name: 'Test',
      email,
      password
    });
    const signInRes = await testServer.post('/signIn').send({ email, password });
    accessToken = signInRes.body.accessToken;
  });
  
  it('Updates record', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Cria registro primeiro

    const updateRes = await testServer
      .put(`/cities/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'Caxias' });

    expect(updateRes.statusCode).toEqual(StatusCodes.ACCEPTED); // Recebe resposta sem conteúdo
  });
  
  it('Try to update record that doesnt exist', async () => {

    const res1 = await testServer
      .put('/cities/99999')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'Caxias' });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Recebe erro de servidor
    expect(res1.body).toHaveProperty('errors.default'); // Recebe erro
  });
});