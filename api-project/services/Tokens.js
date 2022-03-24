const knex = require("../database/connection");
const User = require("./User");

class Tokens{
  async create(email) {
    try {
      const user = await User.findByEmail(email);
      if (user) {
        
        await knex.insert({
          token: Date.now(),
          user_id: user.id,
          used: false
        }).table("tokens");
        return;
      }

    } catch (err) {
      return err;
    }
  }
}


module.exports = new Tokens();