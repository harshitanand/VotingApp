'use strict';

const { POSTGRES_HOST, POSTGRES_PORT } = process.env;

let dbHost = POSTGRES_HOST;
const dbPort = POSTGRES_PORT || 5432;

if (!dbHost) {
  if (process.env.DOCKER) {
    dbHost = 'postgresql';
  } else {
    dbHost = 'localhost';
  }
}

module.exports = {
  postgreDS: {
    host: dbHost,
    port: dbPort,
    database: 'votingapp',
    username: 'root',
    password: 'postgre',
    name: 'postgreDS',
    connector: 'postgresql',
    debug: true,
  },
  postgreDSReadOnly: {
    host: dbHost,
    port: dbPort,
    database: 'votingapp',
    username: 'readonly_user',
    password: 'postgre',
    name: 'postgreDS',
    connector: 'postgresql',
    debug: true,
  },
};
