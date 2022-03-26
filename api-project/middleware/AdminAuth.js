const jwt = require("jsonwebtoken");
const secret = '';

module.exports = function (req, res, next) {
  const authToken = req.headers['authorization'];

  if (authToken != undefined) {
    const bearer = authToken.split(' ');
    const token = bearer[1]
    
    try {
      const decoded = jwt.verify(token, secret);

      if (decoded.role == 1) {
        next();
      }
    } catch (error) {
      return res.status(403).json(error,"you are not authenticated");
    }

  } else {
    return res.status(400).send();
  }
}