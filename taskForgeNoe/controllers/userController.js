const Task = require('../models/task');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
exports.loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({
            where: {email: email}
        });

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({message: "Incorrect password"})
        }
        const token = jwt.sign(
            {userId: user.id},
            'secret-ke'
        )
        user.password = undefined;
        res.setHeader('Authorization', `Bearer ${token}`);
        const tasks = await user.getTasks();
        const roles = await user.getRoles();
        res.status(200).json({ user, tasks, roles, token})
    } catch (err) {
        res.status(500).json({message: "Error fetching user and tasks: " + err.message});
    }
}
exports.cos = function (req, res) {
    res.status(200).json({ message: "Umiesz w autoryzacje" });
}
exports.logout = (req, res) => {
    res.setHeader('Authorization', '');
    res.status(200).json({message:"Wylogowano pomyślnie"});
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json({users});
    }catch(err) {
       res.status(500).json({message: "Cannot fetch all users: " + err.message});
    }
}
exports.newUser = async (req, res) => {
    try{
        const userToMake = req.body;
        const ifUserExists = await User.findOne({
            where: {
                email: userToMake.email,
            }
        });
        if(ifUserExists){
            res.status(400).json({message: "User already exist!"})
        }
        const hashedPassword = await bcrypt.hash(userToMake.password, 12);
        const user = await User.create({
            name: userToMake.name,
            surname: userToMake.surname,
            email: userToMake.email,
            password: hashedPassword
        })
        const roles = await Role.findAll({
            where: {
                name: userToMake.roles,
            }
        })
        user.addRoles(userToMake.roles);
        user.save();
        res.status(200).json({ message: "User created successfully." });
    }catch (error) {
        res.status(500).json({message: "Cannot add user: " + error.message});
    }
}