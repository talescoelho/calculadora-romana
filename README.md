# Calculadora Romana

Desafio da VilaApps que consiste em criar uma calculadora de números romanos.

### 🔧 Instalação

```bash
# Clone este repositório
$ git clone git@github.com:talescoelho/Blitz.git

# Instale as dependências
$ npm install

# Execute a aplicação
$ npm run dev
```

## 🚀 Utilizando

#### Utilize a rota "POST /users/register" para criar um novo usuário com o JSON:
```
body: {
  "name": "Fulano",
  "email": "fulado@email.com",
  "password": "123456789",
}
```

#### Utilize a rota "POST /users/login" para logar com um usuário existente, o retorno vai ser o token para fazer a autenticação para as rotas de "POST /romanos/soma" e "POST /romanos/subtracao". JSON:
```
body: {
  "email": "fulado@email.com",
  "password": "123456789",
}
```

#### Utilize a rota "POST /romanos/soma" e "POST /romanos/subtracao" para fazer as operações matemáticas com o JSON:
```
body: {
  "romans": ["V", "X", "I"],
}
```

## ⚙️ Executando os testes

```bash
# Execute os testes
$ npm run test

# Execute a cobertura dos testes
$ npm run test:dev
```

## 🛠️ Construído com

* [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Utilizado para encriptação de password
* [chai](https://www.chaijs.com/) - Chai é uma biblioteca de asserção BDD / TDD
* [chai-http](https://www.chaijs.com/plugins/chai-http/) - Teste de integração HTTP com asserções Chai.
* [dotenv](https://www.npmjs.com/package/dotenv) - Carrega variáveis de ambiente de um arquivo `.env` em `process.env`
* [email-validator](https://www.npmjs.com/package/email-validator) - Um módulo simples para validar um endereço de e-mail
* [express](https://expressjs.com/pt-br/) - O Express é um framework para aplicativo da web do Node.js
* [http-status-codes](https://www.npmjs.com/package/http-status-codes) - Constantes que enumeram os códigos de status HTTP.
* [joi](https://joi.dev/api/?v=17.4.2) - Utilizado para fazer a validação dos campos da API
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Uma implementação de JSON Web Tokens.
* [mongodb](https://www.mongodb.com/) - Banco de dados NoSQL
* [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) - Este pacote ativa um servidor MongoDB atual/real programaticamente de dentro do nodejs, para teste ou simulação durante o desenvolvimento.
* [nyc](https://www.npmjs.com/package/nyc) - Cobertura mapeada de origem de projetos Babel e TypeScript
* [sinon](https://sinonjs.org/) - Teste autônomo de spies, stubs e mocks para JavaScript. Funciona com qualquer estrutura de teste de unidade.

## ✒️ Autores

* **Tales Coelho** - *Projeto Completo* - [Github](https://github.com/talescoelho)

## 🎁 Expressões de gratidão

* Muito obrigado pela oportunidade, VilaApps!!
