'use strict';

const config = require('config');
const postgres = require('./database/postgres');
const randomString = require('randomstring');

async function create(url) {
  // check if we've already generated a url for this one
  const alreadyStoredURL = await postgres.getGeneratedShortURL(url);

  if (alreadyStoredURL) {
    return buildURL(alreadyStoredURL);
  }

  let generatedString = randomString.generate(7);

  // check if generated url already exists in database
  let storedURL = await postgres.getOriginalURLFromShort(generatedString);
  for (let i = 8; storedURL != null; i++) {
    generatedString = randomString.generate(i);
    storedURL = await postgres.getOriginalURLFromShort(generatedString);
  }

  await postgres.addURLMapping(generatedString, url, false);
  return buildURL(generatedString);
}

async function addCustom(url, shortPath) {
  
  // check if a url already exists at this path
  let storedURL = await postgres.getOriginalURLFromShort(shortPath);

  if (storedURL) {
    if (storedURL === url) {
      return buildURL(shortPath);
    }
    else {
      throw new Error('A URL has already been stored with the requested path.');
    }
  }

  await postgres.addURLMapping(shortPath, url, true);
  return buildURL(shortPath);
}

function buildURL(shortPath) {
  const hostname = config.get('hostname');
  const port = config.get('dockerPort') || config.get('port');

  return `${hostname}:${port}/go/${shortPath}`;
}

module.exports = {
  create: create,
  addCustom: addCustom,
};
