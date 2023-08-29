const Task = require('../models/task');
const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs')
const {where} = require("sequelize");
module.exports = async function seedDatabase() {
    // Inicjalizacja zadań
    await createTaskIfNotFound(
        'Implementacja interfejsu',
        'Napisać klasę implementującą interfejs do zarządzania danymi',
        8,
        new Date(2023, 6, 8),
        new Date(2023, 6, 15)
    );
    await createTaskIfNotFound(
        'Optymalizacja algorytmu sortowania',
        'Znaleźć sposób na zoptymalizowanie sortowania złożoności O(n^2)',
        6,
        new Date(2023, 8, 12),
        new Date(2023, 8, 18)
    );
    await createTaskIfNotFound(
        'Tworzenie aplikacji mobilnej',
        'Rozpocząć rozwój aplikacji mobilnej przy użyciu frameworka Flutter',
        8,
        new Date(2023, 9, 13),
        new Date(2023, 9, 18)
    );
    await createTaskIfNotFound(
        'coś coś coś ',
        'Rozpocząć rozwój aplikacji mobilnej przy użyciu frameworka Flutter',
        8,
        new Date(2023, 10, 13),
        new Date(2023, 9, 18)
    );
    const tasks = await Task.findAll();
    const tasks2 = await Task.findAll( {where: {
        topic: 'coś coś coś '
        }})
    await createRole('ADMIN');
    await createRole("EDITOR")
    await createRole('USER');
    const roles1 = await Role.findAll();
    const roles2 = await Role.findOne({where: {name: "USER"}})
    await createUserIfNotFound('Test', 'test@test.pl', tasks, roles1);
    await createUserIfNotFound('teściowa', 'edytor@test.pl',tasks2, roles2);
};


async function createTaskIfNotFound(topic, description, hours, startingDate, endingDate) {
    try {
        const task = await Task.findOne({ where: { topic } });
        if (!task) {
            await Task.create({
                topic,
                description,
                hours,
                startingDate,
                endingDate
            });
            console.log(`Created task: ${topic}`);
        }
    } catch (error) {
        console.error(`Error creating task: ${error.message}`);
    }
}

async function createRole(roleName){
    try {
        await Role.create({
            name: roleName
        });
    } catch (error) {
        console.error(`Error creating role: ${error.message}`);
    }
}

async function createUserIfNotFound(name, email, tasks, roles) {
    try {
        let user = await User.findOne({ where: { name } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('test', 12); // Haszowanie hasła
            user = await User.create({
                name,
                surname: 'Test',
                password: hashedPassword, // Hash your password using bcrypt
                email: email,
            });
            await user.addTasks(tasks);
            await user.addRoles(roles);
        }
    } catch (error) {
        console.error(`Error creating user: ${error.message}`);
    }
}

