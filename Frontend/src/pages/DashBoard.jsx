import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  UserRoundCog,
  ClipboardCheck,
} from "lucide-react";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        studentsResponse,
        coursesResponse,
        instructorsResponse,
        enrollmentsResponse,
      ] = await Promise.all([
        fetch("http://localhost:5000/api/students"),
        fetch("http://localhost:5000/api/courses"),
        fetch("http://localhost:5000/api/instructors"),
        fetch("http://localhost:5000/api/enrollments"),
      ]);

      const studentsData = await studentsResponse.json();
      const coursesData = await coursesResponse.json();
      const instructorsData =
        await instructorsResponse.json();
      const enrollmentsData =
        await enrollmentsResponse.json();

      setStudents(studentsData);
      setCourses(coursesData);
      setInstructors(instructorsData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error("Unable to load dashboard:", error);
    }
  };

  const activeEnrollments = enrollments.filter(
    (item) =>
      item.status === "Enrolled" ||
      item.status === "In Progress"
  ).length;

  const cards = [
    {
      title: "Total Students",
      value: students.length,
      icon: <Users />,
      className: "blue",
    },
    {
      title: "Total Courses",
      value: courses.length,
      icon: <BookOpen />,
      className: "purple",
    },
    {
      title: "Total Instructors",
      value: instructors.length,
      icon: <UserRoundCog />,
      className: "orange",
    },
    {
      title: "Active Enrollments",
      value: activeEnrollments,
      icon: <ClipboardCheck />,
      className: "green",
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome to Melodia Coding Academy Training
            Management System.
          </p>
        </div>

        <div className="academy-badge">
          MCA
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.title}>
            <div>
              <p>{card.title}</p>
              <h2>{card.value}</h2>
              <span>Current academy records</span>
            </div>

            <div
              className={`stat-icon ${card.className}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="content-card">
          <div className="card-heading">
            <div>
              <h3>Recent Enrollments</h3>
              <p>
                Latest students enrolled in academy courses
              </p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.slice(0, 5).map((item) => (
                  <tr key={item.enrollment_id}>
                    <td>
                      <strong>{item.student_name}</strong>
                    </td>

                    <td>{item.course_name}</td>

                    <td>
                      <span
                        className={`status ${
                          item.status
                            ?.toLowerCase()
                            .replace(" ", "-")
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan="3">
                      No enrollment records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-card system-card">
          <h3>System Information</h3>

          <div className="info-item">
            <span>Organization</span>
            <strong>Melodia Coding Academy</strong>
          </div>

          <div className="info-item">
            <span>System</span>
            <strong>
              Training Management System
            </strong>
          </div>

          <div className="info-item">
            <span>Database</span>
            <strong>MySQL</strong>
          </div>

          <div className="info-item">
            <span>Backend</span>
            <strong>Node.js / Express</strong>
          </div>

          <div className="info-item">
            <span>Frontend</span>
            <strong>React</strong>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>
            System Operational
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;