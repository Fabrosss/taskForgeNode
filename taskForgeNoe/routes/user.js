
const authorize = require('../util/authorize');
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
router.post('/login',userController.loginUser);
router.post('/logout', authorize('USER'),userController.logout);
router.get('/all', authorize('EDITOR'),userController.getAllUsers)
router.put('/newUser',authorize('ADMIN'), userController.newUser)
module.exports = router;
