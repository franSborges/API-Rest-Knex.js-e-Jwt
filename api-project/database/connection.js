const knex = require("knex")({
    client: '',
    connection: {
      host : '',
      user : '',
      password : '3',
      database : ''
    }
  });

module.exports = knex;