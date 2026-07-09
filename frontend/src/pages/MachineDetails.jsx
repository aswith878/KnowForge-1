import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

import "../styles/machineDetails.css";

function MachineDetails() {
  const { machineId } = useParams();

  const navigate = useNavigate();

  const { role } = useAuth();

  const [machine, setMachine] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMachine();
  }, []);

  async function loadMachine() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .eq("machine_id", machineId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setMachine(data);
    setLoading(false);
  }

  async function deleteMachine() {
    const answer = window.confirm("Delete this machine?");

    if (!answer) return;

    const { error } = await supabase
      .from("machines")
      .delete()
      .eq("id", machine.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Machine deleted successfully.");

    navigate("/machines");
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="machine-details-page">
          <h2>Loading Machine...</h2>
        </div>
      </AppLayout>
    );
  }

  if (!machine) {
    return (
      <AppLayout>
        <div className="machine-details-page">
          <h2>Machine Not Found</h2>

          <button
            className="back-btn"
            onClick={() => navigate("/machines")}
          >
            Back
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="machine-details-page">
        <div className="machine-card">
          <div className="machine-header">
            <div>
              <h1>{machine.machine_name}</h1>

              <p>
                <strong>Machine ID:</strong> {machine.machine_id}
              </p>
            </div>

            <span
              className={`status ${machine.status
                ?.toLowerCase()
                .replace(/\s/g, "-")}`}
            >
              {machine.status}
            </span>
          </div>

          <div className="machine-grid">
            <div>
              <strong>Department</strong>
              <p>{machine.department}</p>
            </div>

            <div>
              <strong>Location</strong>
              <p>{machine.location || "Not Available"}</p>
            </div>

            <div>
              <strong>Manufacturer</strong>
              <p>{machine.manufacturer || "Not Available"}</p>
            </div>

            <div>
              <strong>Model</strong>
              <p>{machine.model || "Not Available"}</p>
            </div>

            <div>
              <strong>Created On</strong>
              <p>
                {machine.created_at
                  ? new Date(machine.created_at).toLocaleDateString()
                  : "Not Available"}
              </p>
            </div>
          </div>

          <div className="machine-description">
            <h3>Description</h3>

            <p>
              {machine.description || "No description available."}
            </p>
          </div>

          <div className="machine-buttons">
            <button
              className="back-btn"
              onClick={() => navigate("/machines")}
            >
              ← Back
            </button>

            {(role === "Admin" || role === "Expert") && (
              <button
                className="delete-btn"
                onClick={deleteMachine}
              >
                Delete Machine
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default MachineDetails;