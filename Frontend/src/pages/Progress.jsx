import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  X,
  TrendingUp,
} from "lucide-react";

const PROGRESS_API =
  "http://localhost:5000/api/progress";

const ENROLLMENT_API =
  "http://localhost:5000/api/enrollments";

function Progress() {
  const [progressRecords, setProgressRecords] =
    useState([]);

  const [enrollments, setEnrollments] =
    useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    enrollment_id: "",
    progress_percentage: "",
    remarks: "",
  };

  const [formData, setFormData] =
    useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressResponse, enrollmentResponse] =
        await Promise.all([
          fetch(PROGRESS_API),
          fetch(ENROLLMENT_API),
        ]);

      setProgressRecords(
        await progressResponse.json()
      );

      setEnrollments(
        await enrollmentResponse.json()
      );
    } catch (error) {
      console.error(
        "Unable to load progress:",
        error
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingId(record.progress_id);

    setFormData({
      enrollment_id: record.enrollment_id,
      progress_percentage:
        record.progress_percentage,
      remarks: record.remarks || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const percentage =
      Number(formData.progress_percentage);

    if (percentage < 0 || percentage > 100) {
      alert(
        "Progress percentage must be between 0 and 100."
      );
      return;
    }

    try {
      const url = editingId
        ? `${PROGRESS_API}/${editingId}`
        : PROGRESS_API;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            data.error ||
            "Operation failed"
        );
        return;
      }

      setMessage(
        editingId
          ? "Training progress updated."
          : "Training progress recorded."
      );

      closeForm();
      fetchData();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(
        "Unable to save progress:",
        error
      );
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Training Progress</h1>

          <p>
            Monitor students' progress in their coding
            training programmes.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Record Progress
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="summary-box">
        <div className="summary-icon">
          <TrendingUp size={24} />
        </div>

        <div>
          <span>Progress Records</span>
          <strong>
            {progressRecords.length}
          </strong>
        </div>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div>
            <h3>Student Training Progress</h3>
            <p>
              Current training performance and remarks.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Remarks</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {progressRecords.map((record) => (
                <tr key={record.progress_id}>
                  <td>
                    <strong>
                      {record.student_name}
                    </strong>
                  </td>

                  <td>{record.course_name}</td>

                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${record.progress_percentage}%`,
                          }}
                        ></div>
                      </div>

                      <span>
                        {record.progress_percentage}%
                      </span>
                    </div>
                  </td>

                  <td>
                    {record.remarks || "—"}
                  </td>

                  <td>
                    {record.last_updated
                      ? new Date(
                          record.last_updated
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditForm(record)
                      }
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {progressRecords.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    No progress records available.
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
                <h2>
                  {editingId
                    ? "Update Progress"
                    : "Record Progress"}
                </h2>

                <p>
                  Record the student's current training
                  performance.
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

                {!editingId && (
                  <div className="form-group full-width">
                    <label>
                      Student Enrollment *
                    </label>

                    <select
                      name="enrollment_id"
                      value={
                        formData.enrollment_id
                      }
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select enrollment
                      </option>

                      {enrollments.map(
                        (enrollment) => (
                          <option
                            key={
                              enrollment.enrollment_id
                            }
                            value={
                              enrollment.enrollment_id
                            }
                          >
                            {
                              enrollment.student_name
                            }{" "}
                            —{" "}
                            {
                              enrollment.course_name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                <div className="form-group full-width">
                  <label>
                    Progress Percentage *
                  </label>

                  <input
                    type="number"
                    name="progress_percentage"
                    min="0"
                    max="100"
                    value={
                      formData.progress_percentage
                    }
                    onChange={handleChange}
                    required
                    placeholder="e.g. 75"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Remarks</label>

                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="3"
                    placeholder="e.g. Student is progressing well"
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
                  {editingId
                    ? "Update Progress"
                    : "Save Progress"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Progress;