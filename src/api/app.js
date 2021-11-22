const express = require('express');
const users = require('./routes/users');
const romans = require('./routes/romans');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_, res) => res.status(200).send('Bem vindo a calculadora de números romanos!'));

app.use('/', users);
app.use('/', romans);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
