
const Task = require("../models/Task");

const FIELDS = [
  "title",
  "description",
  "dueAt",
  "priority",
  "status",
];

const pick = (body = {}) => {
  const data = {};

  FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

// Search and get all tasks
exports.getTasks = async (req, res, next) => {
  try {
    const filter = {
      user: req.user._id,
    };

    const query = String(req.query.q || "").trim();

    if (query) {
      const safeQuery = query.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(safeQuery, "i");

      filter.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    const tasks = await Task.find(filter).sort({
      dueAt: 1,
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Create task
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...pick(req.body),
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      pick(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
