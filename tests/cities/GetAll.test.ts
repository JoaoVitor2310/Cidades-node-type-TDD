import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Cities - GetAll', () => {

  it('Find all records', async () => {

    const res1 = await testServer
      .post('/cities')
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const foundRes = await testServer
      .get('/cities')
      .send();

    expect(Number(foundRes.header['x-total-count'])).toBeGreaterThan(0); // O número de registros encontrados no BANCO deve ser maior do que 0.
    expect(foundRes.statusCode).toEqual(StatusCodes.OK);
    expect(foundRes.body.length).toBeGreaterThan(0); // O número de registros encontrados na PÁGINA deve ser maior do que 0.
  });
});