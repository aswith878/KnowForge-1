import "../styles/navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaBolt,
  FaBell,
  FaSearch,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const role =
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    "Employee";

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <header className="navbar">

      <div className="navbar-left">

        <div className="logo-box">
          <FaBolt />
        </div>

        <div>
          <h2 className="navbar-logo">
            KnowForge AI
          </h2>

          <span className="company-title">
            Industrial Knowledge Management Platform
          </span>
        </div>

      </div>

      <div className="navbar-center">

        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search knowledge, SOPs, manuals..."
          />

        </div>

      </div>

      <div className="navbar-right">

        <button className="notification-btn">
          <FaBell />
          <span className="notification-dot"></span>
        </button>

        <div
          className="user-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        >

          <FaUserCircle className="user-avatar" />

          <div className="user-info">

            <span className="user-role">
              {role}
            </span>

            <span className="user-email">
              {user?.email}
            </span>

          </div>

          <FaChevronDown className="dropdown-arrow" />

          {showDropdown && (

            <div className="dropdown-menu">

              <div className="dropdown-header">

                <FaUserCircle className="dropdown-avatar" />

                <div>

                  <h4>{role}</h4>

                  <p>{user?.email}</p>

                </div>

              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;