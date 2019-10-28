'use strict';

const postgres = require('../../lib/database/postgres');

/**
  * Functions in a127 controllers used for operations should take two parameters:
 * @param {int} req a handle to the request object.
 * @param {int} res a handle to the response object.
 */
function redirect(req, res, next) {
  const path = req.swagger.params.path.value;
  postgres.getOriginalURLFromShort(path).then((responseURL) => {
    if (responseURL) {
      postgres.logAccess(path).then(()=>{}).finally(() => {
        // in a finally because if we error while logging access, it's not the end of the world
        res.redirect(responseURL);
      });
    }
    else {
      next(new Error('There is no URL stored with this path!'));
    }
  }).catch((error) => {
    next(error);
  });
}

module.exports = {
  redirect: redirect,
};
