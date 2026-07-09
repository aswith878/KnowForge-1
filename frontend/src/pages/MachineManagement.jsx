import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaPlus,
  FaCog,
  FaPlayCircle,
  FaTools,
  FaPowerOff,
  FaMapMarkerAlt,
  FaIndustry,
  FaEye,
} from "react-icons/fa";

import "../styles/machineManagement.css";

import AppLayout from "../components/layout/AppLayout";
import AddMachineModal from "../components/modals/AddMachineModal";

import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

function MachineManagement() {
  const navigate = useNavigate();

  const { role } = useAuth();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  async function fetchMachines() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .order("machine_id", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setMachines(data || []);
    }

    setLoading(false);
  }

  const filteredMachines = useMemo(() => {
    const value = search.toLowerCase();

    return machines.filter((machine) => {
      return (
        machine.machine_id?.toLowerCase().includes(value) ||
        machine.machine_name?.toLowerCase().includes(value) ||
        machine.department?.toLowerCase().includes(value) ||
        machine.location?.toLowerCase().includes(value) ||
        machine.manufacturer?.toLowerCase().includes(value)
      );
    });
  }, [machines, search]);

  const totalMachines = machines.length;

  const runningMachines = machines.filter(
    (m) => m.status === "Running"
  ).length;

  const maintenanceMachines = machines.filter(
    (m) => m.status === "Maintenance"
  ).length;

  const offlineMachines = machines.filter(
    (m) => m.status === "Offline"
  ).length;

  return (
    <AppLayout>

      <div className="machine-page">

        {/* ================= HEADER ================= */}

        <div className="machine-page-header">

          <div>

            <h1>Machine Management</h1>

            <p>
              Monitor and manage every industrial machine across
              your organization.
            </p>

          </div>

          {(role === "Expert" ||
            role === "Manager" ||
            role === "Admin") && (

            <button
              className="add-machine-btn"
              onClick={() => setShowModal(true)}
            >
              <FaPlus />

              Add Machine
            </button>

          )}

        </div>

        {/* ================= STATS ================= */}

        <div className="machine-stats">

          <div className="machine-stat-card total">

            <div className="stat-icon">
              <FaCog />
            </div>

            <div>

              <h2>{totalMachines}</h2>

              <p>Total Machines</p>

            </div>

          </div>

          <div className="machine-stat-card running">

            <div className="stat-icon">
              <FaPlayCircle />
            </div>

            <div>

              <h2>{runningMachines}</h2>

              <p>Running</p>

            </div>

          </div>

          <div className="machine-stat-card maintenance">

            <div className="stat-icon">
              <FaTools />
            </div>

            <div>

              <h2>{maintenanceMachines}</h2>

              <p>Maintenance</p>

            </div>

          </div>

          <div className="machine-stat-card offline">

            <div className="stat-icon">
              <FaPowerOff />
            </div>

            <div>

              <h2>{offlineMachines}</h2>

              <p>Offline</p>

            </div>

          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="machine-search-wrapper">

          <FaSearch className="search-icon" />

          <input
            className="machine-search"
            placeholder="Search by ID, Name, Department, Location or Manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* ================= MACHINE GRID ================= */}

        <div className="machines-grid">

          {loading ? (

            <div className="machine-loading">

              Loading Machines...

            </div>

          ) : filteredMachines.length === 0 ? (

            <div className="machine-loading">

              No Machines Found

            </div>

          ) : (

            filteredMachines.map((machine) => {

              const status = (machine.status || "").toLowerCase();

              return (

                <div
                  key={machine.id}
                  className={`machine-card ${status}`}
                >

                  <div className="machine-card-header">

                    <div>

                      <span className="machine-id">
                        {machine.machine_id}
                      </span>

                      <h3>
                        {machine.machine_name}
                      </h3>

                    </div>

                    <span
                      className={`status ${status}`}
                    >
                      {machine.status}
                    </span>

                  </div>

                  <div className="machine-info">

                    <div className="info-row">

                      <FaIndustry />

                      <span>
                        {machine.department}
                      </span>

                    </div>

                    <div className="info-row">

                      <FaMapMarkerAlt />

                      <span>
                        {machine.location || "Not Specified"}
                      </span>

                    </div>

                    <div className="info-row">

                      <strong>Manufacturer :</strong>

                      <span>
                        {machine.manufacturer || "-"}
                      </span>

                    </div>

                    <div className="info-row">

                      <strong>Model :</strong>

                      <span>
                        {machine.model || "-"}
                      </span>

                    </div>
                                        {/* Health Indicator */}

                    <div className="health-section">

                      <div className="health-header">

                        <span>Machine Health</span>

                        <strong>
                          {machine.status === "Running"
                            ? "100%"
                            : machine.status === "Maintenance"
                            ? "65%"
                            : machine.status === "Offline"
                            ? "20%"
                            : "80%"}
                        </strong>

                      </div>

                      <div className="health-bar">

                        <div
                          className={`health-fill ${status}`}
                          style={{
                            width:
                              machine.status === "Running"
                                ? "100%"
                                : machine.status === "Maintenance"
                                ? "65%"
                                : machine.status === "Offline"
                                ? "20%"
                                : "80%",
                          }}
                        ></div>

                      </div>

                    </div>

                  </div>

                  {/* Footer */}

                  <div className="machine-card-footer">

                    <button
                      className="view-machine-btn"
                      onClick={() =>
                        navigate(`/machines/${machine.machine_id}`)
                      }
                    >
                      <FaEye />

                      View Details
                    </button>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </div>

      {showModal && (

        <AddMachineModal
          onClose={() => {
            setShowModal(false);
            fetchMachines();
          }}
        />

      )}

    </AppLayout>

  );

}

export default MachineManagement;