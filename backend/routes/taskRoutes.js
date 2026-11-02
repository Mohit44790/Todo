
const express = require("express");

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getTasks)
  .post(createTask);

router.route("/:id")
  .get(validateId, getTask)
  .patch(validateId, updateTask)
  .delete(validateId, deleteTask);

module.exports = router;
