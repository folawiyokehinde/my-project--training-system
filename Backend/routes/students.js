const express = require("express");
const router = express.Router();
const db = require("../config/db");


const students = [
    
]

// GET ALL STUDENTS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM students ORDER BY student_id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Unable to retrieve students",
        error: err.message,
      });
    }

    res.json(results);
  });
});


// GET ONE STUDENT
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM students WHERE student_id = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Unable to retrieve student",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(results[0]);
  });
});


// ADD STUDENT
router.post("/", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    gender,
  } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({
      message: "First name, last name and email are required",
    });
  }

  const sql = `
    INSERT INTO students
    (first_name, last_name, email, phone, gender)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, email, phone, gender],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Unable to add student",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Student added successfully",
        student_id: result.insertId,
      });
    }
  );
});


// UPDATE STUDENT
router.put("/:id", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    gender,
  } = req.body;

  const sql = `
    UPDATE students
    SET first_name = ?,
        last_name = ?,
        email = ?,
        phone = ?,
        gender = ?
    WHERE student_id = ?
  `;

  db.query(
    sql,
    [
      first_name,
      last_name,
      email,
      phone,
      gender,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Unable to update student",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      res.json({
        message: "Student updated successfully",
      });
    }
  );
});


// DELETE STUDENT
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM students WHERE student_id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Unable to delete student",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  });
});


module.exports = router;