import { useEffect, useState } from "react";
import "../../styles/recentAlerts.css";
import { supabase } from "../../services/supabase";
import {
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function RecentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("company_announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setAlerts(data || []);
    }

    setLoading(false);
  }

  function getPriorityIcon(priority) {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return <FaExclamationCircle />;
      case "normal":
        return <FaInfoCircle />;
      case "low":
        return <FaCheckCircle />;
      default:
        return <FaInfoCircle />;
    }
  }

  if (loading) {
    return (
      <section className="recent-alerts">
        <div className="alerts-header">
          <div>
            <h2>Recent Updates</h2>
            <p>Latest announcements from the organization</p>
          </div>
        </div>

        <div className="loading-alerts">
          Loading recent updates...
        </div>
      </section>
    );
  }

  return (
    <section className="recent-alerts">
      <div className="alerts-header">
        <div>
          <h2>Recent Updates</h2>
          <p>Latest announcements from the organization</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="loading-alerts">
          No recent updates available.
        </div>
      ) : (
        <div className="recent-alerts-list">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card ${(alert.priority || "Normal").toLowerCase()}`}
            >
              <div className="alert-header">
                <div className="alert-title">
                  <div
                    className={`alert-icon ${(alert.priority || "Normal").toLowerCase()}`}
                  >
                    {getPriorityIcon(alert.priority)}
                  </div>

                  <div>
                    <h3>{alert.title}</h3>
                  </div>
                </div>

                <span
                  className={`priority-badge ${(alert.priority || "Normal").toLowerCase()}`}
                >
                  {alert.priority || "Normal"}
                </span>
              </div>

              <div className="alert-message">
                {alert.message}
              </div>

              <div className="alert-footer">
                <FaClock />

                <span>
                  {new Date(alert.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentAlerts;