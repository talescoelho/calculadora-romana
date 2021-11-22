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
  let createUser = {};
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    const OPTIONS = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connectionMock = await MongoClient.connect(URLMock, OPTIONS);

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    createUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'User Teste Create',
          'email': 'user@email.com',
          'password': '123456',
        });
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
          'name': 'user',
          'email': 'email@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.OK);
      expect(newUser.body.user).to.have.property('name');
      expect(newUser.body.user).to.have.property('email');
      expect(newUser.body.user).to.have.property('userId');
      expect(newUser.body.user.name).to.be.equal('user');
      expect(newUser.body.user.email).to.be.equal('email@email.com');
    });
  });

  // Inserir users sem sucesso campo "name"
  describe('Quando inserir um usuário SEM sucesso 2 ~ 3', () => {
    it('02 - caminho: POST "/users/register" Quando inserir um novo "usuário" sem o campo "name"', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'email': 'email@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"name" precisa de');
    });

    it('03 - caminho: POST "/users/register" Quando inserir um novo "usuário" com campo "name" vazio ou com menos de 3 caracteres', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': '',
          'email': 'email@email.com',
          'password': '123456',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"name" com menos de 3 caracteres');
    });
  });

  // Inserir users sem sucesso campo "password"
  describe('Quando inserir um usuário SEM sucesso 4 ~ 5', () => {
    it('04 - caminho: POST "/users/register" Quando inserir um novo "usuário" sem o campo "password"', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@email.com',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" precisa de');
    });

    it('05 - caminho: POST "/users/register" Quando inserir um novo "usuário" com campo "password" vazio ou com menos de 5 caracteres', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': '',
          'email': 'email@email.com',
          'password': '1234',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"password" com menos de 3 caracteres');
    });
  });

  // Inserir users sem sucesso campo "email"
  describe('Quando inserir um usuário SEM sucesso 6 ~ 9', () => {
    it('06 - caminho: POST "/users/register" Quando inserir um novo "usuário" sem o campo "email"', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" precisa de');
    });

    it('07 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" mal formatado', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': '@email.com',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" mal formatado');
    });

    it('08 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" mal formatado', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@.com',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" mal formatado');
    });

    it('09 - caminho: POST "/users/register" Quando inserir um novo "usuário" com o campo "email" mal formatado', async () => {
      const newUser = await chai.request(server)
        .post('/users/register')
        .send({
          'name': 'user',
          'email': 'email@email.',
          'password': '123445',
        });
      expect(newUser).to.have.status(StatusCodes.BAD_REQUEST);
      expect(newUser.body).to.have.property('message');
      expect(newUser.body.message).to.be.equal('"email" mal formatado');
    });
  });

  // Logar com sucesso
  describe('Quando Logar com sucesso 10', () => {
    it('10 - caminho: POST "/users/login" Quando inserir um novo "usuário" com sucesso', async () => {
      const login = await chai.request(server)
        .post('/users/login')
        .send({
          'email': 'user@email.com',
          'password': '123456',
        });
      expect(login).to.have.status(StatusCodes.OK);
      expect(login.body.user).to.have.property('token');
    });
  });
});
