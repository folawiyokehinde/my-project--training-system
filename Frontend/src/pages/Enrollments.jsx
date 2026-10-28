import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  ClipboardList,
} from "lucide-react";

const ENROLLMENT_API =
  "http://localhost:5000/api/enrollments";
const STUDENT_API =
  "http://localhost:5000/api/students";
const COURSE_API =
  "http://localhost:5000/api/courses";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    status: "Enrolled",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        enrollmentResponse,
        studentResponse,
        courseResponse,
      ] = await Promise.all([
        fetch(ENROLLMENT_API),
        fetch(STUDENT_API),
        fetch(COURSE_API),
      ]);

      setEnrollments(await enrollmentResponse.json());
      setStudents(await studentResponse.json());
      setCourses(await courseResponse.json());
    } catch (error) {
      console.error("Unable to load data:", error);
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
      student_id: "",
      course_id: "",
      status: "Enrolled",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(ENROLLMENT_API, {
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

      setMessage("Student enrolled successfully.");
      closeForm();
      fetchAllData();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to enroll student:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${ENROLLMENT_API}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || data.error || "Update failed");
        return;
      }

      setMessage("Enrollment status updated.");
      fetchAllData();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to update status:", error);
    }
  };

  const deleteEnrollment = async (id) => {
    const confirmed = window.confirm(
      "Delete this enrollment record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${ENROLLMENT_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || data.error || "Delete failed");
        return;
      }

      setMessage("Enrollment deleted successfully.");
      fetchAllData();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Unable to delete enrollment:", error);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Enrollments</h1>
          <p>
            Enroll students into coding courses and manage
            their enrollment status.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          New Enrollment
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="summary-box">
        <div className="summary-icon">
          <ClipboardList size={24} />
        </div>

        <div>
          <span>Total Enrollments</span>
          <strong>{enrollments.length}</strong>
        </div>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div>
            <h3>Enrollment Records</h3>
            <p>
              Students and their registered coding courses.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {enrollments.map((item) => (
                <tr key={item.enrollment_id}>
                  <td>#{item.enrollment_id}</td>

                  <td>
                    <strong>
                      {item.student_name}
                    </strong>
                  </td>

                  <td>{item.course_name}</td>

                  <td>
                    {item.enrollment_date
                      ? new Date(
                          item.enrollment_date
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          item.enrollment_id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Enrolled">
                        Enrolled
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteEnrollment(
                          item.enrollment_id
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {enrollments.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    No enrollment records available.
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
                <h2>New Enrollment</h2>
                <p>
                  Select a student and coding course.
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
                  <label>Student *</label>

                  <select
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select student
                    </option>

                    {students.map((student) => (
                      <option
                        key={student.student_id}
                        value={student.student_id}
                      >
                        {student.first_name}{" "}
                        {student.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Course *</label>

                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select course
                    </option>

                    {courses.map((course) => (
                      <option
                        key={course.course_id}
                        value={course.course_id}
                      >
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Enrolled">
                      Enrolled
                    </option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Completed">
                      Completed
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
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Enrollments;
