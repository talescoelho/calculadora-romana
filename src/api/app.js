const express = require('express');
const users = require('./routes/users');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Bem vindo a calculadora de números romanos!'));

app.use('/', users);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
