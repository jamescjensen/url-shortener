'use strict';

const createShortURL = require('../../lib/create-short-url');

/**
  * Functions in a127 controllers used for operations should take two parameters:
 * @param {int} req a handle to the request object.
 * @param {int} res a handle to the response object.
 */
function generate(req, res, next) {
  const url = req.swagger.params.url.value;

  createShortURL.create(url).then((responseURL) => {
    res.json({
      shortURL: responseURL,
    });
  }).catch((error) => {
    next(error);
  });
}

module.exports = {
  generate: generate,
};
