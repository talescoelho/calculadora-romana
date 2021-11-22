const express = require('express');

const router = express.Router();
const controllersUsers = require('../controllers/controllersUsers');
// const middlewaresUsers = require('../middlewares/middlewaresUsers');

router.post('/users/register', controllersUsers.createUser);
router.post('/users/login', controllersUsers.logIn);

module.exports = router;
