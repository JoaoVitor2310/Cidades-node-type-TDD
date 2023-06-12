import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('People - UpdateById', () => {

  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'updateById-people@gmail.com';
    const password = '1234567';
    await testServer.post('/signUp').send({
      name: 'Test',
      email,
      password
    });
    const signInRes = await testServer.post('/signIn').send({ email, password });
    accessToken = signInRes.body.accessToken;
  });

  let cityId: number | undefined = undefined;

  beforeAll(async () => { // Antes de testar, vamos criar a cidade que terá o cityId(obrigatório) da pessoa
    const cityRes = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'city to test' });

    cityId = cityRes.body;
  })

  it('Updates record', async () => {

    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({
        cityId,
        email: 'abc@gmail.com',
        fullName: 'abc'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Cria registro primeiro

    const updateRes = await testServer
      .put(`/people/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({
        cityId,
        email: 'abcdefghi@gmail.com',
        fullName: 'abcdefghi'
      });

    expect(updateRes.statusCode).toEqual(StatusCodes.ACCEPTED); // Recebe resposta sem conteúdo
  });

  it('Try to update record that doesnt exist', async () => {

    const res1 = await testServer
      .put('/people/99999')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ // Envia os dados para criar um exemplo e editar depois
        cityId,
        email: 'abcde@gmail.com',
        fullName: 'abcde'
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Recebe erro de servidor
    expect(res1.body).toHaveProperty('errors.default'); // Recebe erro
  });
});