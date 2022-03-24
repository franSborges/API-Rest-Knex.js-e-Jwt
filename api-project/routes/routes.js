const express = require("express")
const homecontroller = require("../controllers/HomeController");
const userController = require("../controllers/UserController");

const app = express();

app.post("/user", userController.registerUser);

app.get("/user", userController.listUsers);

app.get("/user/:id", userController.findUser);

app.put("/user", userController.updateUser);

app.delete("/user/:id", userController.deleteUser);

app.post("/recoverpassword", userController.recoverPassword);


module.exports = app;