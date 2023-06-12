import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('People - GetById', () => {

  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'getById-people@gmail.com';
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


  it('Search for record by id', async () => {

    const res1 = await testServer
      .post('/people')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ // Envia os dados para criar um exemplo e procurar depois
        cityId,
        email: 'abc@gmail.com',
        fullName: 'abc'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Primeiro cria o registro

    const foundRes = await testServer
      .get(`/people/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(foundRes.statusCode).toEqual(StatusCodes.OK); // Depois espera uma resposta 200
    expect(foundRes.body).toHaveProperty('fullName'); // E com um nome no corpo
  });

  it('Try to search record that doesnt exist', async () => {

    const res1 = await testServer
      .get('/people/99999') // Id mockado que colocamos para dizer que não existe. 
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Irá retornar um erro
    expect(res1.body).toHaveProperty('errors.default'); // Retorna um objeto com essas propriedades
  });
});