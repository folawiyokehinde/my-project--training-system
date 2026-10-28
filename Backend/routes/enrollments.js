const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL ENROLLMENTS
router.get("/", (req, res) => {
  const sql = `
    SELECT
      enrollments.enrollment_id,
      enrollments.student_id,
      enrollments.course_id,
      enrollments.enrollment_date,
      enrollments.status,

      CONCAT(
        students.first_name,
        ' ',
        students.last_name
      ) AS student_name,

      courses.course_name

    FROM enrollments

    JOIN students
      ON enrollments.student_id = students.student_id

    JOIN courses
      ON enrollments.course_id = courses.course_id

    ORDER BY enrollments.enrollment_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// CREATE ENROLLMENT
router.post("/", (req, res) => {
  const {
    student_id,
    course_id,
    status
  } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({
      message: "Student and course are required",
    });
  }

  const sql = `
    INSERT INTO enrollments
    (student_id, course_id, status)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      student_id,
      course_id,
      status || "Enrolled",
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Student enrolled successfully",
        enrollment_id: result.insertId,
      });
    }
  );
});

// UPDATE ENROLLMENT STATUS
router.put("/:id", (req, res) => {
  const { status } = req.body;

  const sql = `
    UPDATE enrollments
    SET status = ?
    WHERE enrollment_id = ?
  `;

  db.query(
    sql,
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Enrollment updated successfully",
      });
    }
  );
});

// DELETE ENROLLMENT
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM enrollments WHERE enrollment_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Enrollment deleted successfully",
      });
    }
  );
});

module.exports = router;