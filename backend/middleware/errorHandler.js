
module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");

    return res.status(400).json({ message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID or data format",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "This record already exists",
    });
  }

  res.status(500).json({
    message: "Something went wrong",
  });
};
