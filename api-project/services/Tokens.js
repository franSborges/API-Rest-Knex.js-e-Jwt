const knex = require("../database/connection");
const User = require("./User");
const jwt = require("jsonwebtoken");
const secret = "";

class Tokens{
  async create(email) {
    try {
      const user = await User.findByEmail(email);

      const token = jwt.sign({
        id: user.id,
        name: user.name,
        email: user
      }, secret, {
        expiresIn: "2h"
      });

      if (user) {
        await knex.insert({
          token: token,
          user_id: user.id,
          used: false
        }).table("tokens");

        return {status: true, token: token};
      }
    } catch (err) {
      return { error: err };
    }
  }

  async validate(token) {
    try {
      const verifyToken = await knex.select("*").where({ token: token }).table("tokens");
      if (verifyToken.length > 0) {
        const result = verifyToken[0];
        if (result.used) {
          return {status: false};
        } else {
          return {status: true, token: result};
        }
      }
    } catch (err) {
      return { error: err };
    }
  }

  async setUser(token) {
    try {
      const result = await knex.update({ used: true }).where({ token: token }).table("tokens");
      return result;
    } catch (err) {
      return { error: err };
    }
  }
}

module.exports = new Tokens();