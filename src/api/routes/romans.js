const express = require('express');

const router = express.Router();
const controllersRomans = require('../controllers/controllersRomans');
const middlewaresRomans = require('../middlewares/middlewaresRomans');

router.post('/romanos/soma', middlewaresRomans.verifyRegisterFields, controllersRomans.createUser);
router.post('/romanos/subtracao', middlewaresRomans.verifyLoginFields, controllersRomans.logIn);

module.exports = router;
