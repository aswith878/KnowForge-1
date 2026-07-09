import "../styles/statcard.css";

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        <div className="stat-growth">
          +12%
        </div>

      </div>

      <div className="stat-content">

        <h4 className="stat-title">
          {title}
        </h4>

        <h2 className="stat-value">
          {value}
        </h2>

      </div>

      <div className="stat-progress">
        <div className="stat-progress-fill"></div>
      </div>

    </div>
  );
}

export default StatCard;