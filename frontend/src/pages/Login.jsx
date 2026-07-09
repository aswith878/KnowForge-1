import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserTag,
} from "react-icons/fa";

function Login() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const getErrorMessage = (error, fallback) => {
    if (!error) return fallback;

    if (typeof error === "string") return error;

    if (typeof error === "object") {
      if (error.message) return error.message;
      if (error.error) return error.error;
    }

    return fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      if (isSignup) {
        const result = await signup(email, password, {
          full_name: fullName,
          role,
        });

        if (result.success) {
          navigate("/dashboard");
        } else {
          setErrorMessage(
            getErrorMessage(result.error, "Unable to create account.")
          );
        }
      } else {
        const result = await login(email, password);

        if (result.success) {
          navigate("/dashboard");
        } else {
          setErrorMessage(
            getErrorMessage(result.error, "Unable to login.")
          );
        }
      }
    } catch (err) {
      setErrorMessage(
        getErrorMessage(err, "Unexpected error occurred.")
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">

      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>
      <div className="bg-circle bg-circle-3"></div>

      <div className="login-wrapper">

        {/* LEFT SIDE */}

        <div className="login-left">

          <div className="brand">

            <div className="brand-logo">
              KF
            </div>

            <div>

              <h1 className="logo">
                KnowForge <span>AI</span>
              </h1>

              <p className="company-tag">
                Industrial Knowledge Loss Prevention Platform
              </p>

            </div>

          </div>

          <div className="hero-content">

            <div className="hero-chip">
              Enterprise Artificial Intelligence Platform
            </div>

            <h2 className="hero-title">
              Preserve Critical
              <br />
              <span>Industrial Knowledge</span>
            </h2>

            <p className="hero-description">
              KnowForge AI securely captures expert knowledge,
              documents, procedures and troubleshooting
              experience before it is lost, enabling employees
              to instantly retrieve trusted information using
              Artificial Intelligence.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-right">

          <div className="login-card">

            <div className="login-glass">

              <div className="login-header">

                <h2>
                  {isSignup ? "Create Account" : "Welcome Back"}
                </h2>

                <p>
                  {isSignup
                    ? "Create your KnowForge AI account"
                    : "Sign in to continue"}
                </p>

              </div>

              {errorMessage && (
                <div className="error-box">
                  {errorMessage}
                </div>
              )}

              <form
                className="login-form"
                onSubmit={handleSubmit}
              >

                {isSignup && (

                  <div className="input-group">

                    <label>Full Name</label>

                    <div className="input-box">

                      <FaUser className="input-icon" />

                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value)
                        }
                        disabled={isLoading}
                      />

                    </div>

                  </div>

                )}
                                <div className="input-group">

                  <label>Email Address</label>

                  <div className="input-box">

                    <FaEnvelope className="input-icon" />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />

                  </div>

                </div>

                <div className="input-group">

                  <label>Password</label>

                  <div className="input-box">

                    <FaLock className="input-icon" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                </div>

                {isSignup && (

                  <div className="input-group">

                    <label>Role</label>

                    <div className="input-box">

                      <FaUserTag className="input-icon" />

                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="employee">Employee</option>
                        <option value="expert">Expert</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>

                    </div>

                  </div>

                )}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Please Wait..."
                    : isSignup
                    ? "Create Account"
                    : "Secure Login"}
                </button>

              </form>

              <div className="divider">

                <span></span>

                <p>OR</p>

                <span></span>

              </div>

              <button
                className="switch-btn"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setRole("employee");
                  setShowPassword(false);
                  setErrorMessage("");
                }}
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Create One"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;