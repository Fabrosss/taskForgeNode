const Task = require('../models/task');

exports.getAddTask = (req, res, next) => {

};

exports.postAddTask = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createTask({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log(result);
      console.log('Created Product');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditTask = (req, res, next) => {
  const prodId = req.params.taskId;
  req.user
    .getTasks({ where: { id: prodId } })
    // Product.findById(prodId)
    .then(tasks => {
      const task = tasks[0];
    })
    .catch(err => console.log(err));
};

exports.postEditTask = (req, res, next) => {
  const taskToEditId = req.body.taskId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
    Task.findByPk(taskToEditId)
    .then(task => {
      task.title = updatedTitle;
      task.price = updatedPrice;
      task.description = updatedDesc;
      task.imageUrl = updatedImageUrl;
      return task.save();
    })
    .catch(err => console.log(err));
};

exports.getTasks = (req, res, next) => {
  req.user
    .getTasks()
    .catch(err => console.log(err));
};

exports.postDeleteTask = (req, res, next) => {
  const taskToDeleteId = req.body.taskId;
    Task.findByPk(taskToDeleteId)
    .then(task => {
      return task.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT' + result);
    })
    .catch(err => console.log(err));
};
