const express = require("express")
const usersRouter = express.Router()

const loginUser = require('../controller/users/loginUser.js');
const addUser = require("../controller/users/addUser.js");
const authUser = require("../middlewares/authUser.js");
const deleteUser = require("../controller/users/deleteUser.js");
const updateUser = require("../controller/users/updateUser.js");
const getUser = require("../controller/users/getUser.js");
const getAllUsers = require("../controller/users/getAllUsers.js");
const getMeUser = require ("../controller/users/getMeUser.js")
usersRouter.post("/", addUser);
usersRouter.post('/login', loginUser);
usersRouter.get("/getUser/:userId", authUser, getUser)
usersRouter.delete("/delete/:userDeleteId", authUser, deleteUser)
usersRouter.post('/update/:userId', authUser, updateUser)
usersRouter.get("/getAllUsers", authUser, getAllUsers)
usersRouter.get("/getMeUsers", authUser, getMeUser )

module.exports = usersRouter

