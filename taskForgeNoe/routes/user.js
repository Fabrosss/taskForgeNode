const path = require('path');
const auth = require('../util/auth');
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
router.post('/login',userController.loginUser);
router.post('/logout', userController.logout);
router.get('/all',auth, userController.getAllUsers)
router.put('/newUser',auth, userController.newUser)
module.exports = router;
