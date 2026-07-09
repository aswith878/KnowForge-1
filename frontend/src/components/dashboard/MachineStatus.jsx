import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/machineStatus.css";

import { supabase } from "../../services/supabase";

import {
  FaMicrochip,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

function MachineStatus() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachines();
  }, []);

  async function fetchMachines() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .order("machine_id", {
        ascending: true,
      });

    if (error) {
      console.error(error);
    } else {
      setMachines(data || []);
    }

    setLoading(false);
  }

  function getDisplayStatus(status) {
    if (!status) return "Offline";

    switch (status.toLowerCase()) {
      case "running":
        return "Online";

      case "maintenance":
        return "Maintenance";

      case "offline":
      case "stopped":
        return "Offline";

      default:
        return status;
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "Online":
        return <FaCheckCircle />;

      case "Maintenance":
        return <FaExclamationTriangle />;

      default:
        return <FaTimesCircle />;
    }
  }

  function getHealth(status) {
    switch (status?.toLowerCase()) {
      case "running":
        return 98;

      case "maintenance":
        return 72;

      case "offline":
      case "stopped":
        return 35;

      default:
        return 60;
    }
  }

  function getUptime(status) {
    switch (status?.toLowerCase()) {
      case "running":
        return "99.8%";

      case "maintenance":
        return "92.4%";

      case "offline":
      case "stopped":
        return "63.1%";

      default:
        return "--";
    }
  }

  return (
    <section className="machine-status-section">
      <div className="machine-header">
        <div>
          <h2>Machine Status</h2>

          <p>
            Live overview of machine health and availability
          </p>
        </div>

        <button
          className="machine-btn"
          onClick={() => navigate("/machines")}
        >
          View All
        </button>
      </div>

      <div className="machine-grid">
        {loading ? (
          <div className="machine-loading">
            Loading machines...
          </div>
        ) : machines.length === 0 ? (
          <div className="machine-loading">
            No machines available.
          </div>
        ) : (
          machines.map((machine) => {
            const displayStatus = getDisplayStatus(
              machine.status
            );

            const health = getHealth(machine.status);

            const uptime = getUptime(machine.status);

            return (
              <div
                key={machine.id}
                className={`machine-card ${machine.status
                  ?.toLowerCase()
                  .replace(/\s/g, "-")}`}
              >
                <div className="machine-top">
                  <div className="machine-icon">
                    <FaMicrochip />
                  </div>

                  <div>
                    <h3>{machine.machine_name}</h3>

                    <span
                      className={`status-badge ${displayStatus.toLowerCase()}`}
                    >
                      {getStatusIcon(displayStatus)}
                      {displayStatus}
                    </span>
                  </div>
                </div>

                <div className="machine-info">
                  <div className="machine-row">
                    <span>Health</span>

                    <strong>{health}%</strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${health}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="machine-footer">
                  <span>System Uptime</span>

                  <strong>{uptime}</strong>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default MachineStatus;