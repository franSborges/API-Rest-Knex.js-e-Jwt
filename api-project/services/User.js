const knex = require("../database/connection");
const bcrypt = require("bcrypt");

class User {
  async findAll() {
    try {
      const result = await knex.select(['id', 'name', 'email', 'role'])
        .table('users');
      return result;
    } catch (err) {
      return err;
    }
  }

  async findById(id) {
    try {
      const result = await knex.select(['id', 'name', 'email', 'role'])
        .where({ id: id })
        .table('users')
      if (result.length > 0) {
        return result[0];
      }
    } catch (err) {
      return err;
    }
  }

  async findByEmail(email) {
    try {
      const result = await knex.select(['id', 'name', 'email', 'role'])
        .where({ email: email })
        .table('users')
      if (result.length > 0) {
        return result[0];
      }
    } catch (err) {
      return err;
    }
  }

  async register(name, email, password) {
    try {
      const hash = await bcrypt.hash(password, 10);

      await knex.insert({ name, email, password: hash, role: 0 }).table('users');
    } catch (err) {
      return err;
    }
  }

  async findEmail(email) {
    try {
      const result = await knex.select('*').from('users').where({ email: email });
      if (result.length > 0) {
        return true;
      }
    } catch (err) {
      return err;
    }
  }

  async update(id, name, email, role) {
    const user = await this.findById(id);
    const update = {};
    if (user) {
      update.name = name;
      update.email = email;
      update.role = role;
    }

    try {
      const verifyEmail = await knex.select('*').from('users').where({ email: email });
      if (verifyEmail.length > 0) {
        return true;
      }
      const result = await knex.update(update)
        .where({ id: id })
        .table('users');
      return result;
    } catch (err) {
      return err;
    }
  }

  async delete(id) {
    const user = this.findById(id);
    try {
      const result = await knex.delete(user)
        .where({ id: id })
        .table('users');
      return result;
    } catch (err) {
      return err;
    }
  }
}

module.exports = new User();