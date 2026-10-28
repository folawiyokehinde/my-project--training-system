import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserRoundCog,
  ClipboardList,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

function Sidebar() {
  const links = [
    {
      path: "/",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/students",
      name: "Students",
      icon: <Users size={20} />,
    },
    {
      path: "/courses",
      name: "Courses",
      icon: <BookOpen size={20} />,
    },
    {
      path: "/instructors",
      name: "Instructors",
      icon: <UserRoundCog size={20} />,
    },
    {
      path: "/enrollments",
      name: "Enrollments",
      icon: <ClipboardList size={20} />,
    },
    {
      path: "/progress",
      name: "Training Progress",
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={28} />
        </div>

        <div>
          <h2>Melodia</h2>
          <span>Coding Academy</span>
        </div>
      </div>

      <div className="menu-label">MAIN MENU</div>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Training Management</p>
        <span>System v1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;