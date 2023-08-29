const Task = require('../models/task');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const {Sequelize} = require('sequelize');
exports.getTask = async (req, res, next) => {

    const id = req.params.id;

    try{
        const task = await Task.findOne({
            where: {id:id}
        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({task:task});

    } catch(e){
        res.status(500).json({message: "Error fetching task: " + e.message})
    }
}
exports.getTaskByStatus = async (req, res, next) => {
    const userId = req.params.id;
    const status = req.params.status;

    try{
        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: {
                model: Task,
            }
        });
        if(!user){
            res.status(404).json({message: "User not found!"})
        }
        const tasks = await user.getTasks();
        const today = new Date();
        let filteredTasks;

        switch (status) {
            case 'past':
                filteredTasks = tasks.filter(task => new Date(task.endingDate) < today);
                break;
            case 'present':
                filteredTasks = tasks.filter(task => new Date(task.startingDate) <= today && new Date(task.endingDate) >= today);
                break;
            case 'future':
                filteredTasks = tasks.filter(task => new Date(task.startingDate) > today);
                break;
            default:
                filteredTasks = tasks;
                break;
        }

        res.status(200).json({tasks: filteredTasks})
    }catch(e){
        console.log({message: "Error fetching tasks: " + e.message});
    }
}
exports.editTask = async (req, res) => {
    console.log({message: "req" + req.body});
    const taskId = req.body.id;
    const updateTask = req.body;

    try{
        const task = await Task.findByPk(taskId);
        if(!task){
            res.status(404).json({message: "Task not found"})
        }
        task.topic = updateTask.topic;
        task.description  = updateTask.description;
        task.hours  = updateTask.hours;
        task.startingDate  = updateTask.startingDate;
        task.endingDate  = updateTask.endingDate;
        await task.save();
        res.status(200).json({message: 'Task updated successfully', updateTask})
    }catch(e){
        console.log({message: "Error fetching tasks: " + e.message})
    }
}
exports.addTask = async (req,res) => {
    const newTask = req.body;
    console.log(newTask);
    try {
        const user = await User.findOne({
            where: {
                name: newTask.user
            }
        })
        if(!user){
            res.status(404).json({message: 'User not found'})
        }
        const task = await Task.create({
            topic: newTask.topic,
            description: newTask.description,
            hours: newTask.hours,
            startingDate: newTask.startingDate,
            endingDate: newTask.endingDate,

        });
        user.addTasks(task);

    }catch (error){
        console.log({message: error})
    }
}
exports.deleteTask = async (req, res, next) => {
    const taskId = req.params.id; // Assuming the task id is provided in the URL

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Find all users associated with the task
        const users = await task.getUsers();

        // Remove the task from each user
        for (const user of users) {
            await user.removeTask(task);
        }

        // Delete the task
        await task.destroy();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log({ message: "Error deleting task: " + error.message });
        res.status(500).json({ message: "Error deleting task: " + error.message });
    }
}
exports.getAllTasks= async (req, res) => {
    const status = req.params.status;
    try {
        const tasks = await Task.findAll()
        const today = new Date();
        let filteredTasks;

        switch (status) {
            case 'past':
                filteredTasks = tasks.filter(task => new Date(task.endingDate) < today);
                break;
            case 'present':
                filteredTasks = tasks.filter(task => new Date(task.startingDate) <= today && new Date(task.endingDate) >= today);
                break;
            case 'future':
                filteredTasks = tasks.filter(task => new Date(task.startingDate) > today);
                break;
            default:
                filteredTasks = tasks;
                break;
        }

        res.status(200).json({tasks: filteredTasks})
    }catch(err) {
        res.status(500).json({message: "Cannot fetch all users: " + err.message});
    }
}


