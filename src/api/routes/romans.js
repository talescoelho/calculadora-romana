const express = require('express');

const router = express.Router();
const controllersRomans = require('../controllers/controllersRomans');
const middlewaresRomans = require('../middlewares/middlewaresRomans');

router.post('/romanos/soma',
  middlewaresRomans.validToken,
  middlewaresRomans.verifyromansFields,
  controllersRomans.somaRomans
);

router.post('/romanos/subtracao',
  middlewaresRomans.validToken,
  middlewaresRomans.verifyromansFields,
  controllersRomans.subtracaoRomans
);

module.exports = router;
