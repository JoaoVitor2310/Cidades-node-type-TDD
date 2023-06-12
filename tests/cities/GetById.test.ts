import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Cities - GetById', () => {

  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'betById-cities@gmail.com';
    const password = '1234567';
    await testServer.post('/signUp').send({
      name: 'Test',
      email,
      password
    });
    const signInRes = await testServer.post('/signIn').send({ email, password });
    accessToken = signInRes.body.accessToken;
  });
  
  it('Search for record by id', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Primeiro cria o registro

    const resBuscada = await testServer
      .get(`/cities/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(resBuscada.statusCode).toEqual(StatusCodes.OK); // Depois espera uma resposta 200
    expect(resBuscada.body).toHaveProperty('name'); // E com um nome no corpo
  });
  
  it('Try to search record that doesnt exist', async () => {

    const res1 = await testServer
      .get('/cities/99999')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Irá retornar um erro
    expect(res1.body).toHaveProperty('errors.default'); // Retorna um objeto com essas propriedades
  });
});