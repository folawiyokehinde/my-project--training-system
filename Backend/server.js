const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");
const instructorRoutes = require("./routes/instructors");
const enrollmentRoutes = require("./routes/enrollments");
const progressRoutes = require("./routes/progress");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to Melodia Coding Academy Training Management System API",
  });
});

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Melodia Training System server running on port ${PORT}`
  );
});