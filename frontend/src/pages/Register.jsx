import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

import {
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaClock
} from "react-icons/fa";

import "../../styles/recentAlerts.css";

function RecentAlerts() {

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {

    setLoading(true);

    const { data, error } = await supabase
      .from("company_announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) {
      setAnnouncements(data || []);
    }

    setLoading(false);
  }

  const getPriorityIcon = (priority) => {

    switch ((priority || "").toLowerCase()) {

      case "high":
        return <FaExclamationTriangle />;

      case "low":
        return <FaCheckCircle />;

      default:
        return <FaInfoCircle />;
    }

  };

  return (

    <div className="recent-alerts">

      <div className="alerts-header">

        <div>

          <h2>Recent Alerts</h2>

          <p>Latest announcements and company updates</p>

        </div>

        <div className="alerts-icon">

          <FaBell />

        </div>

      </div>

      {loading ? (

        <div className="recent-empty">

          Loading Updates...

        </div>

      ) : announcements.length === 0 ? (

        <div className="recent-empty">

          No announcements available.

        </div>

      ) : (

        <div className="alerts-timeline">
                    {announcements.map((item) => (

            <div
              key={item.id}
              className="alert-card"
            >

              <div
                className={`alert-icon ${item.priority?.toLowerCase()}`}
              >
                {getPriorityIcon(item.priority)}
              </div>

              <div className="alert-content">

                <div className="alert-top">

                  <h3>{item.title}</h3>

                  <span
                    className={`priority ${item.priority?.toLowerCase()}`}
                  >
                    {item.priority || "Normal"}
                  </span>

                </div>

                <p>{item.message}</p>

                <div className="alert-footer">

                  <span>

                    <FaClock />

                    {new Date(item.created_at).toLocaleDateString()}

                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default RecentAlerts;
        