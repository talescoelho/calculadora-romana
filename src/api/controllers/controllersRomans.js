const { StatusCodes } = require('http-status-codes');
const servicesRomans = require('../services/servicesRomans');

const somaRomans = async (req, res) => {
  const { romans } = req.body;
  const response = servicesRomans.somaRomans(romans);
  return res.status(StatusCodes.OK).json(response);
};

const subtracaoRomans = async (req, res) => {
  const { romans } = req.body;
  const response = servicesRomans.subtracaoRomans(romans);
  if (response.message) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: response.message });
  }
  return res.status(StatusCodes.OK).json(response);
};

module.exports = {
  somaRomans,
  subtracaoRomans,
};
