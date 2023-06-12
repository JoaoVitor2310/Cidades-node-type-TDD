import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('create - city', () => {
  
  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'create-cities@gmail.com';
    const password = '1234567';
    await testServer.post('/signUp').send({
      name: 'Test',
      email,
      password
    });
    const signInRes = await testServer.post('/signIn').send({ email, password });
    accessToken = signInRes.body.accessToken;
  });

  it('should not register a city without accessToken', async () => {
    const res = await testServer.post('/cities')
      .send({
        name: 'Balneário Camboriú'
      });

    expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED); // Código de criação 201
    expect(res.body).toHaveProperty('errors.default'); // O id será devolvido, por isso o number
  });

  it('should register a city', async () => {
    const res = await testServer.post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({
        name: 'Balneário Camboriú'
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED); // Código de criação 201
    expect(typeof res.body).toEqual('number'); // O id será devolvido, por isso o number
  });

  it('should not register with a very short string', async () => {
    const res = await testServer.post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({
        name: 'Ba'
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.name'); // A resposta será um objeto de errors com uma msg
  });
});