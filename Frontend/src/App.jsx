import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/DashBoard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import Enrollments from "./pages/Enrollments";
import Progress from "./pages/Progress";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/students"
              element={<Students />}
            />
            <Route
              path="/courses"
              element={<Courses />}
            />
            <Route
              path="/instructors"
              element={<Instructors />}
            />
            <Route
              path="/enrollments"
              element={<Enrollments />}
            />
            <Route
              path="/progress"
              element={<Progress />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;