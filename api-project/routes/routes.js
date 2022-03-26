const express = require("express");
const userController = require("../controllers/UserController");
const AdminAuth = require("../middleware/AdminAuth");

const app = express();

app.post("/user", userController.registerUser);
app.get("/user", AdminAuth, userController.listUsers);
app.get("/user/:id", AdminAuth, userController.findUser);
app.put("/user", AdminAuth, userController.updateUser);
app.delete("/user/:id", AdminAuth, userController.deleteUser);

app.post("/recoverpassword", userController.recoverPassword);
app.post("/changepassword", userController.changePassword);
app.post("/login", userController.login);

module.exports = app;