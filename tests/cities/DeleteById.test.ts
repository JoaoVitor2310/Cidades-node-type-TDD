import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';


describe('Cities - DeleteById', () => {
  
  let accessToken = '';

  beforeAll(async () => { // Cria o usuário para testar as rotas protegidas
    const email = 'delete-cities@gmail.com';
    const password = '1234567';
    await testServer.post('/signUp').send({
      name: 'Test',
      email,
      password
    });
    const signInRes = await testServer.post('/signIn').send({ email, password });
    accessToken = signInRes.body.accessToken;
  });

  it('Deletes record', async () => {

    const res1 = await testServer
      .post('/cities')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send({ name: 'Caxias do sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED); // Vamos criar para depois deletar

    const deletedRes = await testServer
      .delete(`/cities/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(deletedRes.statusCode).toEqual(StatusCodes.NO_CONTENT); // A resposta será sem conteúdo, depois de ter deletado
  });
  it('Try to delete record that doesnt exist', async () => {

    const res1 = await testServer // Id mockado que colocamos para dizer que não existe. 
      .delete('/cities/99999')
      .set({ Authorization: `Bearer ${accessToken}` }) // Insere o token de login nos headers
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default'); // Resposta terá um erro
  });
});