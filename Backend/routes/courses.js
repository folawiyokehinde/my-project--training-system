const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL COURSES
router.get("/", (req, res) => {
  const sql = `
    SELECT
      courses.*,
      CONCAT(
        instructors.first_name,
        ' ',
        instructors.last_name
      ) AS instructor_name
    FROM courses
    LEFT JOIN instructors
      ON courses.instructor_id = instructors.instructor_id
    ORDER BY courses.course_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// ADD COURSE
router.post("/", (req, res) => {
  const {
    course_name,
    description,
    duration,
    instructor_id,
  } = req.body;

  if (!course_name) {
    return res.status(400).json({
      message: "Course name is required",
    });
  }

  const sql = `
    INSERT INTO courses
    (course_name, description, duration, instructor_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      course_name,
      description,
      duration,
      instructor_id || null,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Course added successfully",
        course_id: result.insertId,
      });
    }
  );
});

// DELETE COURSE
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM courses WHERE course_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Course deleted successfully",
      });
    }
  );
});

module.exports = router;