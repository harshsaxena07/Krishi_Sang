export default function StatsCard({ title, value, subtitle }) {
  return (
    <div className="admin-card">
      <p className="admin-card-title">{title}</p>
      <h3 className="admin-card-value">{value}</h3>
      <p style={{ margin: "8px 0 0", color: "#666", fontSize: "13px" }}>{subtitle}</p>
    </div>
  );
}
