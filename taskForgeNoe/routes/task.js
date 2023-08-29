const path = require('path');
const auth = require('../util/auth');
const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();
// /admin/add-product => GET
router.get('/getTask/:id', auth, taskController.getTask);
router.get('/user/:id/:status', auth, taskController.getTaskByStatus);
router.get('/allTasks/:status', taskController.getAllTasks);
router.put('/edit', auth, taskController.editTask);
router.put('/new/:userAdded',auth, taskController.addTask);
router.delete('/delete/:id', auth, taskController.deleteTask);
module.exports = router;
