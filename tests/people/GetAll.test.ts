import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('People - GetAll', () => {

  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'getAll-people@gmail.com';
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

  it('Find all records', async () => {

    const res1 = await testServer // Faz a requisição
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ // Envia os dados para criar um exemplo e mostrar depois
        cityId,
        email: 'abc@gmail.com',
        fullName: 'abc'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const foundRes = await testServer
      .get('/people')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(Number(foundRes.header['x-total-count'])).toBeGreaterThan(0); // O número de registros encontrados no BANCO deve ser maior do que 0.
    expect(foundRes.statusCode).toEqual(StatusCodes.OK);
    expect(foundRes.body.length).toBeGreaterThan(0); // O número de registros encontrados na PÁGINA deve ser maior do que 0.
  });
});