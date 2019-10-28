'use strict';

const dbMigrate = require('db-migrate');

function init() {
  const migrate = dbMigrate.getInstance(true);

  return migrate.up();
}

module.exports = {
  init: init
};
