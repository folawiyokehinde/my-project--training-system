import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";

const COURSE_API = "http://localhost:5000/api/courses";
const INSTRUCTOR_API =
  "http://localhost:5000/api/instructors";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    duration: "",
    instructor_id: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(COURSE_API);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Unable to load courses:", error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch(INSTRUCTOR_API);
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
      course_name: "",
      description: "",
      duration: "",
      instructor_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(COURSE_API, {
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

      setMessage("Course added successfully.");
      closeForm();
      fetchCourses();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to add course:", error);
    }
  };

  const deleteCourse = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${COURSE_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || data.error || "Delete failed");
        return;
      }

      setMessage("Course deleted successfully.");
      fetchCourses();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to delete course:", error);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p>
            Manage coding courses offered by Melodia
            Coding Academy.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="summary-box">
        <div className="summary-icon">
          <BookOpen size={24} />
        </div>

        <div>
          <span>Total Courses</span>
          <strong>{courses.length}</strong>
        </div>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div>
            <h3>Academy Courses</h3>
            <p>
              Coding and software development courses.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Course</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Instructor</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td>#{course.course_id}</td>

                  <td>
                    <strong>
                      {course.course_name}
                    </strong>
                  </td>

                  <td>
                    {course.description || "—"}
                  </td>

                  <td>
                    {course.duration || "—"}
                  </td>

                  <td>
                    {course.instructor_name || "Not Assigned"}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteCourse(course.course_id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    No courses available.
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
                <h2>Add Course</h2>
                <p>
                  Create a new academy training course.
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
                  <label>Course Name *</label>

                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Python Programming"
                  />
                </div>

                <div className="form-group">
                  <label>Duration</label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 12 Weeks"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the course"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Instructor</label>

                  <select
                    name="instructor_id"
                    value={formData.instructor_id}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select instructor
                    </option>

                    {instructors.map((instructor) => (
                      <option
                        key={instructor.instructor_id}
                        value={instructor.instructor_id}
                      >
                        {instructor.first_name}{" "}
                        {instructor.last_name} —{" "}
                        {instructor.specialization}
                      </option>
                    ))}
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
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Courses;