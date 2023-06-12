import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Users - SignIn', () => {
  beforeAll(async () => { // Vamos cadastrar o usuário para fazer testes
    await testServer.post('/signUp').send({
      name: 'João',
      password: '123456',
      email: 'joao@gmail.com',
    });
  });

  it('Should login', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        password: '123456',
        email: 'joao@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('accessToken'); // Devolve o token de login
  });

  it('Should not login with wrong password', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        password: '1234567',
        email: 'joao@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default'); // Devolve essas propriedades no erro
  });

  it('Should not login with wrong email', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        password: '123456',
        email: 'joaoooo@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Should not login with email in invalid format', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        password: '123456',
        email: 'joao gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Yup irá devolver bad request 400
    expect(res1.body).toHaveProperty('errors.body.email'); // Com mensagem de email
  });

  it('Should not login with short password', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        password: '12',
        email: 'joao@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Yup irá devolver bad request 400
    expect(res1.body).toHaveProperty('errors.body.password'); // Com mensagem de senha
  });

  it('Should not login without password', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        email: 'joao@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Yup irá devolver bad request 400
    expect(res1.body).toHaveProperty('errors.body.password'); // Com mensagem de senha
  });

  it('Should not login without email', async () => {
    const res1 = await testServer
      .post('/signIn')
      .send({
        password: '123456',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST); // Yup irá devolver bad request 400
    expect(res1.body).toHaveProperty('errors.body.email'); // Com mensagem de senha
  });
});