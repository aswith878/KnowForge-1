import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

import UpdateCard from "../components/UpdateCard";

import AnnouncementModal from "../components/modals/AnnouncementModal";
import MaintenanceModal from "../components/modals/MaintenanceModal";
import KnowledgeTransferModal from "../components/modals/KnowledgeTransferModal";

import {
  FaBullhorn,
  FaTasks,
  FaClipboardCheck,
  FaSearch,
} from "react-icons/fa";

import "../styles/updates.css";

function Updates() {
  const { role } = useAuth();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showAnnouncementModal, setShowAnnouncementModal] =
    useState(false);

  const [showMaintenanceModal, setShowMaintenanceModal] =
    useState(false);

  const [showKnowledgeModal, setShowKnowledgeModal] =
    useState(false);

  useEffect(() => {
    loadUpdates();
  }, [role]);

  async function loadUpdates() {
    setLoading(true);

    let table = "";

    switch (role) {
      case "Employee":
        table = "company_announcements";
        break;

      case "Expert":
        table = "knowledge_transfer_requests";
        break;

      case "Manager":
        table = "maintenance_tasks";
        break;

      case "Admin":
        table = "company_announcements";
        break;

      default:
        table = "company_announcements";
    }

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
    } else {
      setUpdates(data || []);
    }

    setLoading(false);
  }

  const filteredUpdates = useMemo(() => {
    if (!search) return updates;

    return updates.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.title?.toLowerCase().includes(keyword) ||
        item.message?.toLowerCase().includes(keyword) ||
        item.priority?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword)
      );
    });
  }, [updates, search]);

  const pendingCount = updates.filter(
    (u) =>
      u.status === "Pending" ||
      u.status === "pending"
  ).length;

  const completedCount = updates.filter(
    (u) =>
      u.status === "Completed" ||
      u.status === "completed"
  ).length;

  const approvedCount = updates.filter(
    (u) =>
      u.status === "Approved" ||
      u.status === "approved"
  ).length;

  const totalCount = updates.length;

  return (
    <AppLayout>
      <div className="updates-page">

        {/* ================= HEADER ================= */}

        <div className="updates-header">

          <div>

            <h1>Updates Center</h1>

            <p>

              {role === "Employee" &&
                "Stay informed with company announcements, SOP updates and notifications."}

              {role === "Expert" &&
                "Manage knowledge transfer requests assigned to you."}

              {role === "Manager" &&
                "Monitor and assign maintenance activities across machines."}

              {role === "Admin" &&
                "Manage announcements and monitor organization updates."}

            </p>

          </div>

          <div className="header-buttons">

            {role === "Admin" && (
              <button
                className="action-btn"
                onClick={() =>
                  setShowAnnouncementModal(true)
                }
              >
                + New Announcement
              </button>
            )}

            {role === "Manager" && (
              <button
                className="action-btn"
                onClick={() =>
                  setShowMaintenanceModal(true)
                }
              >
                + Assign Maintenance
              </button>
            )}

            {role === "Expert" && (
              <button
                className="action-btn"
                onClick={() =>
                  setShowKnowledgeModal(true)
                }
              >
                + Knowledge Transfer
              </button>
            )}

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="updates-stats">

          <div className="stat-card">
            <FaBullhorn className="stat-icon" />

            <div>
              <h2>{totalCount}</h2>
              <p>Total Updates</p>
            </div>
          </div>

          <div className="stat-card">
            <FaTasks className="stat-icon pending" />

            <div>
              <h2>{pendingCount}</h2>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <FaClipboardCheck className="stat-icon approved" />

            <div>
              <h2>{approvedCount}</h2>
              <p>Approved</p>
            </div>
          </div>

          <div className="stat-card">
            <FaClipboardCheck className="stat-icon completed" />

            <div>
              <h2>{completedCount}</h2>
              <p>Completed</p>
            </div>
          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search updates..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>
                {/* ================= CONTENT ================= */}

        {loading ? (

          <div className="loading-box">

            <div className="loading-spinner"></div>

            <h2>Loading Updates...</h2>

            <p>Please wait while we fetch the latest information.</p>

          </div>

        ) : filteredUpdates.length === 0 ? (

          <div className="empty-box">

            <div className="empty-icon">
              📢
            </div>

            <h2>No Updates Found</h2>

            <p>
              {search
                ? "No updates match your search."
                : "You're all caught up. New updates will appear here."}
            </p>

          </div>

        ) : (

          <>

            <div className="updates-summary">

              <div>
                <h3>
                  Showing {filteredUpdates.length} of {updates.length} Updates
                </h3>

                <p>
                  Latest updates based on your role.
                </p>

              </div>

            </div>

            <div className="updates-grid">

              {filteredUpdates.map((item) => (

                <UpdateCard
                  key={item.id}
                  update={item}
                  role={role}
                />

              ))}

            </div>

          </>

        )}
              {/* ================= MODALS ================= */}

      {showAnnouncementModal && (
        <AnnouncementModal
          onClose={() => setShowAnnouncementModal(false)}
          onSuccess={() => {
            setShowAnnouncementModal(false);
            loadUpdates();
          }}
        />
      )}

      {showMaintenanceModal && (
        <MaintenanceModal
          onClose={() => setShowMaintenanceModal(false)}
          onSuccess={() => {
            setShowMaintenanceModal(false);
            loadUpdates();
          }}
        />
      )}

      {showKnowledgeModal && (
        <KnowledgeTransferModal
          onClose={() => setShowKnowledgeModal(false)}
          onSuccess={() => {
            setShowKnowledgeModal(false);
            loadUpdates();
          }}
        />
      )}

      </div>
    </AppLayout>
  );
}

export default Updates;