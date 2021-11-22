const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const models = require('../api/models');
const server = require('../api/app');

chai.use(chaiHttp);

const { expect } = chai;
const SECRET_KEY = 'secretKey';

describe('Teste: Tasks', () => {
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    const OPTIONS = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connectionMock = await MongoClient.connect(URLMock, OPTIONS);

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });

  // Inserir users com sucesso
  describe('Quando inserir um usuário COM sucesso 1', () => {
    it('01 - caminho: POST "/users/register" Quando inserir um novo "usuário" com sucesso', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.OK);
      expect(newUser.body.user).to.have.property('name');
      expect(newUser.body.user).to.have.property('email');
      expect(newUser.body.user).to.have.property('userId');
      expect(newUser.body.user.name).to.be.equal('New User');
      expect(newUser.body.user.email).to.be.equal('new-user@email.com');
    });
  });

  // Inserir users sem sucesso campo "name"
  describe('Quando inserir um usuário SEM sucesso 2 ~ 4', () => {
    it('02 - caminho: POST "/users/register" Quando inserir um novo "usuário" sem o campo "name"', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'email': 'email@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"name" is required');
    });

    it('03 - caminho: POST "/users/register" Quando inserir um novo "usuário" com campo "name" vazio', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': '',
          'email': 'email@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"name" is not allowed to be empty');
    });

    it('04 - caminho: POST "/users/register" Quando inserir um novo "usuário" com campo "name" com menos de 3 caracteres', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'as',
          'email': 'email@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"name" length must be at least 3 characters long');
    });
  });

  // Inserir users sem sucesso campo "password"
  describe('Quando inserir um usuário SEM sucesso 5 ~ 7', () => {
    it('05 - caminho: POST "/users/register" Quando inserir um novo "usuário" sem o campo "password"', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@email.com',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" is required');
    });

    it('06 - caminho: POST "/users/register" Quando inserir um novo "usuário" com campo "password" vazio', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@email.com',
          'password': '',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" is not allowed to be empty');
    });

    it('07 - caminho: POST "/users/register" Quando inserir um novo "usuário" com campo "password" com menos de 5 caracteres', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@email.com',
          'password': '12345',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" length must be at least 6 characters long');
    });
  });

  // Inserir users sem sucesso campo "email"
  describe('Quando inserir um usuário SEM sucesso 8 ~ 12', () => {
    it('08 - caminho: POST "/users/register" Quando inserir um novo "usuário" sem o campo "email"', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" is required');
    });

    it('09 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" mal formatado', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': '@email.com',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" malformated');
    });

    it('10 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" mal formatado', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@.com',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" malformated');
    });

    it('11 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" mal formatado', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@email.',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" malformated');
    });

    it('12 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" existente', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'teste',
          'email': 'teste@email.com',
          'password': '123445',
        });

      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'teste',
          'email': 'teste@email.com',
          'password': '123445',
        });

      expect(newUser).to.have.status(StatusCodes.CONFLICT);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" already registered');
    });
  });

  // Logar com sucesso
  describe('Quando Logar com sucesso 13', () => {
    it('13 - caminho: POST "/users/login" Quando logar com sucesso', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const login = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '123456',
        });
      expect(login).to.have.status(StatusCodes.OK);
      expect(login.body).to.have.property('token');
    });
  });

  // Logar sem sucesso campo email
  describe('Quando inserir um usuário SEM sucesso 14 ~ 17', () => {
    it('14 - caminho: POST "/users/login" Quando logar um "usuário" sem o campo "email"', async () => {
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" is required');
    });

    it('15 - caminho: POST "/users/login" Quando logar um "usuário" com o campo "email" mal formatado', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': '@email.com',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" or "password" do not match');
    });

    it('16 - caminho: POST "/users/login" Quando logar um "usuário" com o campo "email" mal formatado', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@.com',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" or "password" do not match');
    });

    it('17 - caminho: POST "/users/login" Quando logar um "usuário" com o campo "email" mal formatado', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" or "password" do not match');
    });
  });

  // Logar sem sucesso campo password
  describe('Quando Logar um usuário SEM sucesso 18 ~ 20', () => {
    it('18 - caminho: POST "/users/login" Quando logar um "usuário" sem o campo "password"', async () => {
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'email@email.com',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" is required');
    });

    it('19 - caminho: POST "/users/login" Quando logar um "usuário" com campo "password" vazio', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" is not allowed to be empty');
    });

    it('20 - caminho: POST "/users/login" Quando logar um "usuário" com campo "password" errado', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const newUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '123456789',
        });
      expect(newUser).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" or "password" do not match');
    });
  });

  // Somando um ou mais números romanos
  describe('Quando Soma com sucesso 21', () => {
    it('21 - caminho: POST "/romanos/soma" Quando soma com sucesso', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const loggedUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '123456',
        });

      let sumRomans = await chai.request(server)
        .post('/romanos/soma')
        .set({ 'Authorization': `${loggedUser.body.token}` })
        .send({
          'romans': ["V", "V"],
        });

      expect(sumRomans).to.have.status(StatusCodes.OK);
      expect(sumRomans.body).to.have.property('result');
      expect(sumRomans.body).to.have.property('resultRomanos');
      expect(sumRomans.body).to.have.property('equacao');
      expect(sumRomans.body.result).to.be.equal(10);
      expect(sumRomans.body.resultRomanos).to.be.equal('X');
      expect(sumRomans.body.equacao).to.be.equal('V + V = X');

      sumRomans = await chai.request(server)
        .post('/romanos/soma')
        .set({ 'Authorization': `${loggedUser.body.token}` })
        .send({
          'romans': ["V", "V", "I", "V"],
        });
      expect(sumRomans).to.have.status(StatusCodes.OK);
      expect(sumRomans.body).to.have.property('result');
      expect(sumRomans.body).to.have.property('result');
      expect(sumRomans.body).to.have.property('resultRomanos');
      expect(sumRomans.body).to.have.property('equacao');
      expect(sumRomans.body.result).to.be.equal(16);
      expect(sumRomans.body.resultRomanos).to.be.equal('XVI');
      expect(sumRomans.body.equacao).to.be.equal('V + V + I + V = XVI');
    });
  });

  // Subtraindo um ou mais números romanos
  describe('Quando Subtraindo com sucesso 22', () => {
    it('22 - caminho: POST "/romanos/subtracao" Quando subtrai com sucesso', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const loggedUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '123456',
        });

      let subRomans = await chai.request(server)
        .post('/romanos/subtracao')
        .set({ 'Authorization': `${loggedUser.body.token}` })
        .send({
          'romans': ["X", "V"],
        });
      expect(subRomans).to.have.status(StatusCodes.OK);
      expect(subRomans.body).to.have.property('result');
      expect(subRomans.body).to.have.property('resultRomanos');
      expect(subRomans.body).to.have.property('equacao');
      expect(subRomans.body.result).to.be.equal(5);
      expect(subRomans.body.resultRomanos).to.be.equal('V');
      expect(subRomans.body.equacao).to.be.equal('X - V = V');

      subRomans = await chai.request(server)
        .post('/romanos/subtracao')
        .set({ 'Authorization': `${loggedUser.body.token}` })
        .send({
          'romans': ["XVII", "V", "I"],
        });

      expect(subRomans).to.have.status(StatusCodes.OK);
      expect(subRomans.body).to.have.property('result');
      expect(subRomans.body).to.have.property('resultRomanos');
      expect(subRomans.body).to.have.property('equacao');
      expect(subRomans.body.result).to.be.equal(11);
      expect(subRomans.body.resultRomanos).to.be.equal('XI');
      expect(subRomans.body.equacao).to.be.equal('XVII - V - I = V');
    });
  });

  // Subtraindo um ou mais números romanos sem sucesso
  describe('Quando Subtraindo sem sucesso 23', () => {
    it('23 - caminho: POST "/romanos/subtracao" Quando subtrai sem sucesso', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const loggedUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '123456',
        });

      let subRomans = await chai.request(server)
        .post('/romanos/subtracao')
        .set({ 'Authorization': `${loggedUser.body.token}` })
        .send({
          'romans': ["V", "X"],
        });
      expect(subRomans).to.have.status(StatusCodes.BAD_REQUEST);
      expect(subRomans.body).to.have.property('message');
      expect(subRomans.body.message).to.be.equal('números romanos não podem ser ZERO "0" ou NEGATIVOS');

      subRomans = await chai.request(server)
        .post('/romanos/subtracao')
        .set({ 'Authorization': `${loggedUser.body.token}` })
        .send({
          'romans': ["XVII", "XVII"],
        });

      expect(subRomans).to.have.status(StatusCodes.BAD_REQUEST);
      expect(subRomans.body).to.have.property('message');
      expect(subRomans.body.message).to.be.equal('números romanos não podem ser ZERO "0" ou NEGATIVOS');
    });
  });

  // somar ou subtrair sem sucesso, token
  describe('Quando Soma sem sucesso 24', () => {
    it('24 - caminho: POST "JWT mal formatado" Quando soma ou subtrai sem sucesso', async () => {
      await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'New User',
          'email': 'new-user@email.com',
          'password': '123456',
        });
      const loggedUser = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'new-user@email.com',
          'password': '123456',
        });

      const falseToken = 'falseToken';
      let subRomans = await chai.request(server)
        .post('/romanos/subtracao')
        .set({ 'Authorization': '' })
        .send({
          'romans': ["V", "X"],
        });

      expect(subRomans).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(subRomans.body).to.have.property('message');
      expect(subRomans.body.message).to.be.equal('missing auth token');

      subRomans = await chai.request(server)
        .post('/romanos/subtracao')
        .set({ 'Authorization': `${falseToken}` })
        .send({
          'romans': ["XVII", "XVII"],
        });

      expect(subRomans).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(subRomans.body).to.have.property('message');
      expect(subRomans.body.message).to.be.equal('jwt malformed');
    });
  });
});
