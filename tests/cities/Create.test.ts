import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('create - city', () => {
  it('should register a city', async () => {
    const res = await testServer.post('/cities')
      .send({
        name: 'Balneário Camboriú'
      });

    // expect(res.body).toHaveProperty('msg');
    expect(res.statusCode).toEqual(StatusCodes.CREATED); // C´ódigo de criação 201
    expect(typeof res.body).toEqual('number'); // O id será devolvido, por isso o number
  });

  it('should not register with a very short string', async () => {
    const res = await testServer.post('/cities')
      .send({
        name: 'Ba'
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.name'); // A resposta será um objeto de errors com uma msg
  });
});