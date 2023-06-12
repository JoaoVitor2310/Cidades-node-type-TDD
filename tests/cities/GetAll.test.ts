import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - GetAll', () => {
  
  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'getAll-cities@gmail.com';
    const password = '1234567';
    await testServer.post('/signUp').send({
      name: 'Test',
      email,
      password
    });
    const signInRes = await testServer.post('/signIn').send({ email, password });
    accessToken = signInRes.body.accessToken;
  });

  it('Find all records', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const foundRes = await testServer
      .get('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(Number(foundRes.header['x-total-count'])).toBeGreaterThan(0); // O número de registros encontrados no BANCO deve ser maior do que 0.
    expect(foundRes.statusCode).toEqual(StatusCodes.OK);
    expect(foundRes.body.length).toBeGreaterThan(0); // O número de registros encontrados na PÁGINA deve ser maior do que 0.
  });
});