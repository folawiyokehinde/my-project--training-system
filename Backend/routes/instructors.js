const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL INSTRUCTORS
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM instructors ORDER BY instructor_id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(results);
    }
  );
});

// ADD INSTRUCTOR
router.post("/", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    specialization
  } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({
      message: "First name and last name are required",
    });
  }

  const sql = `
    INSERT INTO instructors
    (first_name, last_name, email, specialization)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, email, specialization],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Instructor added successfully",
        instructor_id: result.insertId,
      });
    }
  );
});

// DELETE INSTRUCTOR
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM instructors WHERE instructor_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Instructor deleted successfully",
      });
    }
  );
});

module.exports = router;