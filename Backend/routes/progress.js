const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET TRAINING PROGRESS
router.get("/", (req, res) => {
  const sql = `
    SELECT
      progress.progress_id,
      progress.enrollment_id,
      progress.progress_percentage,
      progress.remarks,
      progress.last_updated,

      CONCAT(
        students.first_name,
        ' ',
        students.last_name
      ) AS student_name,

      courses.course_name

    FROM progress

    JOIN enrollments
      ON progress.enrollment_id =
         enrollments.enrollment_id

    JOIN students
      ON enrollments.student_id =
         students.student_id

    JOIN courses
      ON enrollments.course_id =
         courses.course_id

    ORDER BY progress.progress_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// ADD PROGRESS
router.post("/", (req, res) => {
  const {
    enrollment_id,
    progress_percentage,
    remarks,
  } = req.body;

  const sql = `
    INSERT INTO progress
    (
      enrollment_id,
      progress_percentage,
      remarks
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      enrollment_id,
      progress_percentage,
      remarks,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Progress added successfully",
        progress_id: result.insertId,
      });
    }
  );
});

// UPDATE PROGRESS
router.put("/:id", (req, res) => {
  const {
    progress_percentage,
    remarks
  } = req.body;

  const sql = `
    UPDATE progress
    SET
      progress_percentage = ?,
      remarks = ?,
      last_updated = CURRENT_DATE
    WHERE progress_id = ?
  `;

  db.query(
    sql,
    [
      progress_percentage,
      remarks,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Progress updated successfully",
      });
    }
  );
});

module.exports = router;