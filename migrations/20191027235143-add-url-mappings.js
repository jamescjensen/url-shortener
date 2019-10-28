'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('urlmapping', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    shortpath: {
      type: 'string',
      notNull: true,
    },
    originalurl: {
      type: 'string',
      notNull: true,
    },
    custom: 'boolean',
    created: {
      type: 'date',
      notNull: true,
    }
  }).then(() => {
    db.addIndex(
      'urlmapping',
      'shortpath-index',
      ['shortpath']
    ).then(() => {
      db.addIndex(
        'urlmapping',
        'originalurl-index',
        ['originalurl'],
        callback
      );
    });
  });
};

exports.down = function(db, callback) {
  db.removeIndex('urlmapping', 'originalurl-index').then(() => {
    db.removeIndex('urlmapping', 'shortpath-index').then(() => {
      db.dropTable('urlmapping', callback);
    });
  });
};

exports._meta = {
  "version": 1
};
