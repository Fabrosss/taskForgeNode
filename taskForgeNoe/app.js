const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Task = require('./models/task');
const User = require('./models/user');
const Role = require('./models/role');
const seedDatabase = require('./util/seed')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
Role.belongsToMany(User, {through:'UserRoles'});
User.belongsToMany(Role, {through:'UserRoles'});
Task.belongsToMany(User, {through: 'UserTasks'});
User.belongsToMany(Task, { through: 'UserTasks' });


const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200', // Domena twojej strony front-endowej
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: 'Authorization',
    credentials: true, // Umożliwia przesyłanie ciasteczek i nagłówków uwierzytelniania
    preflightContinue: false, //
}));

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.use(errorController.get404);


app.use((req, res, next) => {
    User.findByPk(1, { include: Task }) // Include associated tasks
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});
sequelize
  .sync({force: true})
  .then(() => {
    return User.findByPk(1);
  })
  .then(() => {
      seedDatabase();
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
