
const express = require('express');
const taskController = require('../controllers/taskController');
const authorize = require("../util/authorize");

const router = express.Router();
// /admin/add-product => GET
router.get('/getTask/:id',authorize('EDITOR'),  taskController.getTask);
router.get('/user/:id/:status',authorize('USER'),  taskController.getTaskByStatus);
router.get('/allTasks/:status',authorize('EDITOR'), taskController.getAllTasks);
router.put('/edit',authorize('EDITOR'), taskController.editTask);
router.put('/new/:userAdded',authorize('EDITOR'), taskController.addTask);
router.delete('/delete/:id', authorize('EDITOR'), taskController.deleteTask);
module.exports = router;
