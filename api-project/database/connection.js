const knex = require('knex')({
  client: '',
  connection: {
    host : '',
    port : '',
    user : '',
    password : '',
    database : ''
  }
});

module.exports = knex;