import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/students";

function Students() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchStudents();
  }, []);

  // READ STUDENTS
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Unable to fetch students:", error);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // OPEN ADD FORM
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (student) => {
    setEditingId(student.student_id);

    setFormData({
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      email: student.email || "",
      phone: student.phone || "",
      gender: student.gender || "",
    });

    setShowForm(true);
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // CREATE OR UPDATE STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Operation failed");
        return;
      }

      setMessage(
        editingId
          ? "Student updated successfully."
          : "Student added successfully."
      );

      closeForm();
      fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Unable to save student:", error);
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Delete failed");
        return;
      }

      setMessage("Student deleted successfully.");
      fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Unable to delete student:", error);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>
            Register and manage students of Melodia Coding
            Academy.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="summary-box">
        <div className="summary-icon">
          <Users size={24} />
        </div>

        <div>
          <span>Total Registered Students</span>
          <strong>{students.length}</strong>
        </div>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div>
            <h3>Student Records</h3>
            <p>
              Students currently registered at the academy.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Date Registered</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td>#{student.student_id}</td>

                  <td>
                    <strong>
                      {student.first_name}{" "}
                      {student.last_name}
                    </strong>
                  </td>

                  <td>{student.email}</td>

                  <td>
                    {student.phone || "—"}
                  </td>

                  <td>
                    {student.gender || "—"}
                  </td>

                  <td>
                    {student.date_registered
                      ? new Date(
                          student.date_registered
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        title="Edit student"
                        onClick={() =>
                          openEditForm(student)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-btn"
                        title="Delete student"
                        onClick={() =>
                          deleteStudent(
                            student.student_id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    No students have been registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Student"
                    : "Register Student"}
                </h2>

                <p>
                  {editingId
                    ? "Update the student's information."
                    : "Enter the student's information below."}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>

                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>

                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="student@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select gender
                    </option>
                    <option value="Male">
                      Male
                    </option>
                    <option value="Female">
                      Female
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingId
                    ? "Update Student"
                    : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Students;