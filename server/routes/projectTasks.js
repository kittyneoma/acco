const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation } = require('../middleware/validator');

// agrega rutas de tareas al router de proyectos
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

module.exports = router;