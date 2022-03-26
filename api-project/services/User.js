const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const Tokens = require("./Tokens");

class User {
  async findAll() {
    try {
      const result = await knex.select(["id", "name", "email", "role"]).table("users");
      return result;
    } catch (err) {
      return err;
    }
  }

  async findById(id) {
    try {
      const result = await knex.select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users")
      if (result.length > 0) {
        return result[0];
      }
    } catch (err) {
      return err;
    }
  }

  async findByEmail(email) {
    try {
      const result = await knex.select(["id", "name", "password", "email", "role"])
        .where({ email: email })
        .table("users");
      if (result.length > 0) {
        return result[0];
      }
    } catch (err) {
      return err;
    }
  }

  async register(name, email, password) {
    try {
      const hash = await bcrypt.hash(password, 20);
      const result = await knex.insert({ name, email, password: hash, role: 0 })
        .table("users");
      return result;
    } catch (err) {
      return {error: err};
    }
  }

  async findEmail(email) {
    try {
      const result = await knex.select("*").from("users").where({ email: email });
      if (result.length > 0) {
        return true;
      }
    } catch (err) {
      return { error: err };
    }
  }

  async update(id, name, email, role) {
    const user = await this.findById(id);
    const editUser = {};
    if (user) {
       editUser.name = name;
       editUser.email = email;
       editUser.role = role;
    }
    
    try {
      await knex.update(editUser).where({ id: id }).table("users");
      return {status: true};
    } catch (err) {
      return { error: err };
    }
  }

  async delete(id) {
    const user = this.findById(id);
    try {
      const result = await knex.delete(user)
        .where({ id: id })
        .table("users");
      return result;
    } catch (err) {
      return { error: err };
    }
  }

  async changePassword(newPassword, id, token) {
    try {
      const hash = await bcrypt.hash(newPassword, 20);
      await knex.update({ password: hash }).where({ id: id }).table("users");
      await Tokens.setUser(token);
      return;
    } catch (err) {
      return { error: err };
    }
  }
}

module.exports = new User();