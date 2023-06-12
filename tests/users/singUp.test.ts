import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('User - SignUp', () => {
  
  it('Should register user 1', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'João Gouveia',
        email: 'joaogouveia@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  
  it('Should register user 2', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'John Victor',
        email: 'johnvictor@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  
  it('Should not register user with duplicate email', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'John Victor',
        email: 'johnvictorduplicado@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Primeiro cria um usuário
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'John Victor',
        email: 'johnvictorduplicado@gmail.com',
      });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR); // Depois recebe erro cadastrando o mesmo usuário
    expect(res2.body).toHaveProperty('errors.default');
  });
  
  it('Should not register user without email', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'João Gouveia',
        // email: 'joaogouveia@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Should not register user without name', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        // name: 'João Gouveia',
        email: 'joaogouveia@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.name');
  });

  it('Should not register user without password', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        // password: '123456',
        name: 'João Gouveia',
        email: 'joaogouveia@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Should not register user with invalid email', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'João Gouveia',
        email: 'joaogouveia gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Should not register user with short email(less than 6)', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123',
        name: 'João Gouveia',
        email: 'joaogouveia@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Should not register user with short name(less than 3)', async () => {
    const res1 = await testServer
      .post('/signUp')
      .send({
        password: '123456',
        name: 'Ju',
        email: 'joaogouveia@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.name');
  });
});