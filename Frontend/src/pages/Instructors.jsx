import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  UserRoundCog,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/instructors";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    specialization: "",
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error("Unable to load instructors:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeForm = () => {
    setShowForm(false);

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      specialization: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
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

      setMessage("Instructor added successfully.");
      closeForm();
      fetchInstructors();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to add instructor:", error);
    }
  };

  const deleteInstructor = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this instructor?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || data.error || "Delete failed");
        return;
      }

      setMessage("Instructor deleted successfully.");
      fetchInstructors();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to delete instructor:", error);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Instructors</h1>
          <p>
            Manage instructors and their areas of specialization.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Instructor
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="summary-box">
        <div className="summary-icon">
          <UserRoundCog size={24} />
        </div>

        <div>
          <span>Total Instructors</span>
          <strong>{instructors.length}</strong>
        </div>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div>
            <h3>Academy Instructors</h3>
            <p>
              Instructors currently registered in the system.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Instructor</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.instructor_id}>
                  <td>#{instructor.instructor_id}</td>

                  <td>
                    <strong>
                      {instructor.first_name}{" "}
                      {instructor.last_name}
                    </strong>
                  </td>

                  <td>
                    {instructor.email || "—"}
                  </td>

                  <td>
                    {instructor.specialization || "—"}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteInstructor(
                          instructor.instructor_id
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {instructors.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-table"
                  >
                    No instructors available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Add Instructor</h2>
                <p>
                  Register a new academy instructor.
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
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Development"
                  />
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
                  Add Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Instructors;