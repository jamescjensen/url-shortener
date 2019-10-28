'use strict';

const { Pool } = require('pg');
const config = require('config');

const pool = new Pool({
  user: config.get('postgres.user'),
  host: config.get('postgres.host'),
  port: config.get('postgres.port'),
  password: config.get('postgres.password'),
  database: config.get('postgres.database'),
});

async function getGeneratedShortURL(originalURL) {
  const queryResult = await pool.query('SELECT shortpath FROM urlmapping WHERE originalURL = $1 AND custom=false', [originalURL]);

  if (queryResult.rows.length > 0) {
    return queryResult.rows[0].shortpath;
  }

  return null;
}

async function getOriginalURLFromShort(shortPath) {
  const queryResult = await pool.query('SELECT originalurl FROM urlmapping WHERE shortpath = $1', [shortPath]);

  if (queryResult.rows.length > 0) {
    return queryResult.rows[0].originalurl;
  }

  return null;
}

async function addURLMapping(shortPath, originalURL, custom) {
  const sysdate = new Date();
  return pool.query('INSERT into urlmapping (shortpath, originalurl, custom, created) VALUES ($1, $2, $3, $4)', [shortPath, originalURL, custom, sysdate]);
}

async function logAccess(shortPath) {
  const sysdate = new Date();
  return pool.query('INSERT into accesslog (shortpath, created) VALUES ($1, $2)', [shortPath, sysdate]);
}

async function getCreationDate(shortPath) {
  const queryResult = await pool.query('SELECT created FROM urlmapping WHERE shortpath = $1', [shortPath]);
  if (queryResult.rows.length > 0) {
    return queryResult.rows[0].created;
  }

  return null;
}

async function getViewsPerDay(shortPath) {
  const queryResults = await pool.query('SELECT count(*), created FROM accesslog WHERE shortpath = $1 GROUP BY accesslog.created', [shortPath]);
  return queryResults.rows;
}

module.exports = {
  getGeneratedShortURL: getGeneratedShortURL,
  getOriginalURLFromShort: getOriginalURLFromShort,
  addURLMapping: addURLMapping,
  logAccess: logAccess,
  getCreationDate: getCreationDate,
  getViewsPerDay: getViewsPerDay,
};
