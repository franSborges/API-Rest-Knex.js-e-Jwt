const User = require("../services/User");
const Tokens = require("../services/Tokens");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "";

class UserController {
  async listUsers(req, res) {
    const users = await User.findAll();
    res.status(200).json(users);
  }

  async findUser(req, res) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!id) {
      return res.status(400).json("The id field is mandatory");
    }
    
    if (user) {
      return res.status(200).json(user);

    } else {
      return res.status(404).json("User not found");
    }
  }

  async registerUser(req, res) {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
      return res.status(400).json("All fields are mandatory");
    }
    const emailExists = await User.findEmail(email);

    if (emailExists) {
      return res.status(406).json("E-mail already registered");
    }

    const result = await User.register(name, email, password)
    if (result) {
      return res.status(201).json("Registered User");
    } else {
      return res.status(400).json(result.error);
    }
  }
  
  async updateUser(req, res) {
    const { id, name, email, role } = req.body;
    const user = await User.findById(id);

    const emailExists = await User.findEmail(email);

    if (emailExists.status) {
      return res.status(406).json("E-mail already registered");
    }

    if (!user) {
      return res.status(404).json("User not found");
    }
   
    const result = await User.update(id, name, email, role);
    if (result) {
      return res.status(200).json("Updated User");
    } 
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const result = await User.delete(id)
    if (result) {
      return res.status(200).json("Deleted User");
    } 
  }

  async recoverPassword(req, res) {
    const { email } = req.body;

    const result = await Tokens.create(email);
    if (result.status) {
      console.log(result.token);
      return res.status(200).json(`${result.token}`);
     } else  {
     return res.status(404).json(result.error);
    }
  }

  async changePassword(req, res) {
    const { token, password } = req.body;
    
    const isTokenValid = await Tokens.validate(token);
    if (isTokenValid.status) {
      await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
      return res.status(200).json("password changed successfully")
    } else {
      return res.status(406).json("Invalid token");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (user != undefined) {
      const result = await bcrypt.compare(password, user.password);
     
     if (result) {
       const token = jwt.sign(
         {
           email: user.email,
           role: user.role
         },
         secret,
         {
           expiresIn: '1h'
         });
       return res.status(200).json(`login successfully, your token: ${token}`);
     } else {
       return res.status(406).json("Invalid token");
     }
     
    }
  }
}


module.exports = new UserController();