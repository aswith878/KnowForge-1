import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/sidebar.css";

import {
  FaHome,
  FaBook,
  FaIndustry,
  FaRobot,
  FaBullhorn,
  FaBolt,
  FaUserShield,
} from "react-icons/fa";

function Sidebar() {
  const { role } = useAuth();

  return (
    <aside className="sidebar">

      <div>

        <div className="sidebar-header">

          <div className="sidebar-logo">
            <FaBolt />
          </div>

          <div>

            <h2 className="sidebar-title">
              KnowForge AI
            </h2>

            <p className="sidebar-subtitle">
              Enterprise Platform
            </p>

          </div>

        </div>

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            className="nav-link"
          >
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/knowledge-library"
            className="nav-link"
          >
            <FaBook />
            <span>Knowledge Library</span>
          </NavLink>

          <NavLink
            to="/machines"
            className="nav-link"
          >
            <FaIndustry />
            <span>Machines</span>
          </NavLink>

          <NavLink
            to="/ai-chat"
            className="nav-link"
          >
            <FaRobot />
            <span>AI Assistant</span>
          </NavLink>

          <NavLink
            to="/updates"
            className="nav-link"
          >
            <FaBullhorn />
            <span>Updates</span>
          </NavLink>

        </nav>

      </div>

      <div className="sidebar-footer">

        <FaUserShield className="footer-icon" />

        <small>Logged in as</small>

        <h4>{role}</h4>

      </div>

    </aside>
  );
}

export default Sidebar;