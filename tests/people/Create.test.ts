import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('create - people', () => {
  let cityId: number | undefined = undefined;

  beforeAll(async () => { // Antes de testar, vamos criar a cidade que terá o cityId(obrigatório) da pessoa
    const cityRes = await testServer
      .post('/cities')
      .send({ name: 'city to test' });

    cityId = cityRes.body; // O id vem na resposta do create
  })


  it('should register a person', async () => {
    const res = await testServer.post('/people')
      .send({
        cityId,
        email: 'abc@gmail.com',
        fullName: 'abc'
      });

    // console.log(res.statusCode, cityId, res.body);

    expect(res.statusCode).toEqual(StatusCodes.CREATED); // Código de criação 201
    expect(typeof res.body).toEqual('number'); // O id será devolvido, por isso o number
  });

  it('should register another person', async () => {
    const res = await testServer.post('/people')
      .send({
        cityId,
        email: 'abcde@gmail.com',
        fullName: 'abcde'
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED); // Código de criação 201
    expect(typeof res.body).toEqual('number'); // O id será devolvido, por isso o number
  });

  it('should not register a person with same email as other person', async () => {
    const res = await testServer.post('/people')
      .send({
        cityId,
        email: 'sameEmail@gmail.com',
        fullName: 'abc'
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED); // Código de criação 201
    expect(typeof res.body).toEqual('number'); // O id será devolvido, por isso o number

    const res2 = await testServer.post('/people')
      .send({
        cityId,
        email: 'sameEmail@gmail.com',
        fullName: 'abc'
      });

    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Código de erro do servidor 500
    expect(res2.body).toHaveProperty('errors.default'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person with a very short string', async () => {
    const res = await testServer.post('/people')
      .send({ // Tenta criar com o fullName com 2 caracteres apenas, o mínimo é 3
        cityId,
        email: 'ab@gmail.com',
        fullName: 'ab'
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Código 400 de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.body.fullName'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person without fullName', async () => {
    const res = await testServer.post('/people')
      .send({ // Tenta criar sem o fullName 
        cityId,
        email: 'ab@gmail.com',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Código 400 de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.body.fullName'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person without email', async () => {
    const res = await testServer.post('/people')
      .send({ // Tenta criar sem o email
        cityId,
        fullName: 'ab'
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Código 400 de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.body.email'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person with invalid email', async () => {
    const res = await testServer.post('/people')
      .send({ // Tenta criar com email inválido(com espaço)
        cityId,
        email: 'ab c@gmail.com',
        fullName: 'ab'
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Código 400 de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.body.email'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person without cityId', async () => {
    const res = await testServer.post('/people')
      .send({ // Tenta criar sem o cityId
        email: 'abc@gmail.com',
        fullName: 'ab'
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Código 400 de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.body.cityId'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person with invalid cityId', async () => {
    const res = await testServer.post('/people')
      .send({ // Tenta criar com cityId inválido
        cityId: 99999, // cityId mockado
        email: 'abc@gmail.com',
        fullName: 'abc'
      });

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Código de erro de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.default'); // O erro será devolvido, com uma mensagem
  });

  it('should not register a person without properties', async () => {
    const res = await testServer.post('/people')
      .send({});

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Código 400 de erro na sintaxe da requisição
    expect(res.body).toHaveProperty('errors.body.cityId'); // O erro será devolvido, com uma mensagem
    expect(res.body).toHaveProperty('errors.body.email');
    expect(res.body).toHaveProperty('errors.body.fullName');
  });
});