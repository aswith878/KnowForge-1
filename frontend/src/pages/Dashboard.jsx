import { useEffect, useState } from "react";
import {
  FaIndustry,
  FaBook,
  FaClipboardList,
  FaUsers,
  FaExclamationTriangle,
  FaRobot,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/dashboard.css";

import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/StatCard";
import MachineStatus from "../components/dashboard/MachineStatus";
import RecentAlerts from "../components/dashboard/RecentAlerts";

import { supabase } from "../services/supabase";

function Dashboard() {

  const [stats, setStats] = useState({
    machines: 0,
    knowledge: 0,
    sops: 0,
    employees: 0,
    risk: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      const machines = await supabase
        .from("machines")
        .select("*", {
          count: "exact",
          head: true,
        });

      const knowledge = await supabase
        .from("knowledge_library")
        .select("*", {
          count: "exact",
          head: true,
        });

      const sops = await supabase
        .from("knowledge_library")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("category", "SOP");

      const employees = await supabase
        .from("user_profiles")
        .select("*", {
          count: "exact",
          head: true,
        });

      const machineCount = machines.count ?? 0;
      const knowledgeCount = knowledge.count ?? 0;
      const sopCount = sops.count ?? 0;
      const employeeCount = employees.count ?? 0;

      let risk = 0;

      if (employeeCount > 0) {

        risk = Math.round(
          ((employeeCount - knowledgeCount) /
            employeeCount) *
            100
        );

        if (risk < 0) risk = 0;

      }

      setStats({
        machines: machineCount,
        knowledge: knowledgeCount,
        sops: sopCount,
        employees: employeeCount,
        risk,
      });

    } catch (err) {

      console.error(err);

    }

  }

  return (

    <AppLayout>

      <div className="dashboard">

        {/* =========================
            HERO
        ========================== */}

        <section className="dashboard-hero">

          <div>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              Monitor industrial assets,
              preserve expert knowledge,
              and track organizational health
              from one intelligent dashboard.
            </p>

          </div>

          <div className="hero-ai-card">

            <FaRobot className="hero-ai-icon" />

            <div>

              <h3>AI Assistant Ready</h3>

              <p>
                Search manuals, SOPs and
                expert knowledge instantly.
              </p>

            </div>

            <button>

              Open AI

              <FaArrowRight />

            </button>

          </div>

        </section>

        {/* =========================
            KPI CARDS
        ========================== */}

        <div className="stats-grid">

          <StatCard
            title="Machines"
            value={stats.machines}
            icon={<FaIndustry />}
            color="blue"
          />

          <StatCard
            title="Knowledge"
            value={stats.knowledge}
            icon={<FaBook />}
            color="purple"
          />

          <StatCard
            title="SOP Library"
            value={stats.sops}
            icon={<FaClipboardList />}
            color="green"
          />

          <StatCard
            title="Employees"
            value={stats.employees}
            icon={<FaUsers />}
            color="orange"
          />

          <StatCard
            title="Knowledge Risk"
            value={`${stats.risk}%`}
            icon={<FaExclamationTriangle />}
            color="red"
          />

        </div>

        {/* =========================
            SYSTEM OVERVIEW
        ========================== */}

        <div className="dashboard-grid">

                  {/* =========================
              SYSTEM OVERVIEW CARD
          ========================== */}

          <div className="dashboard-panel system-card">

            <div className="panel-header">

              <h2>System Overview</h2>

              <div className="live-status">

                <span className="live-dot"></span>

                Live

              </div>

            </div>

            <div className="overview-grid">

              <div className="overview-card">

                <span>Machine Availability</span>

                <h3>98%</h3>

              </div>

              <div className="overview-card">

                <span>Knowledge Coverage</span>

                <h3>{stats.knowledge}</h3>

              </div>

              <div className="overview-card">

                <span>Standard SOPs</span>

                <h3>{stats.sops}</h3>

              </div>

              <div className="overview-card">

                <span>Active Employees</span>

                <h3>{stats.employees}</h3>

              </div>

            </div>

          </div>

          {/* =========================
              KNOWLEDGE HEALTH
          ========================== */}

          <div className="dashboard-panel system-card">

            <div className="panel-header">

              <h2>Knowledge Health</h2>

              <span className="updated-badge">

                Updated Today

              </span>

            </div>

            <div className="knowledge-health">

              <h1>

                {100 - stats.risk}%

              </h1>

              <p>

                Overall Knowledge Preserved

              </p>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${100 - stats.risk}%`,
                  }}
                ></div>

              </div>

              <small>

                Overall knowledge retained across
                your organization.

              </small>

            </div>

          </div>

        </div>

        {/* =========================
            MACHINE STATUS
        ========================== */}

        <div className="dashboard-section">

          <MachineStatus />

        </div>

        {/* =========================
            RECENT ALERTS
        ========================== */}

        <div className="dashboard-section">

          <RecentAlerts />

        </div>
              </div>

    </AppLayout>

  );

}

export default Dashboard;