import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ActionCard from "../components/admin/ActionCard";
import StatsCard from "../components/admin/StatsCard";
import "../styles/admin.css";

export default function AdminDashboard() {
  const { user } = useUser();
  const name = user?.firstName || "Admin";

  // Greeting
  const hour = new Date().getHours();
  let greeting = "Welcome";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // ✅ DYNAMIC STATS STATE
  const [stats, setStats] = useState([
    { title: "Pending Tools", value: "...", subtitle: "Awaiting admin review" },
    { title: "Pending Loans", value: "...", subtitle: "Require approval action" },
    { title: "Active Schemes", value: "...", subtitle: "Currently visible to users" },
  ]);

  // ✅ LOAD STATS (CACHE + API)
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // 🔥 1. Load from localStorage (instant UI)
      const cached = localStorage.getItem("admin_stats");

      if (cached) {
        const parsed = JSON.parse(cached);
        setStats(formatStats(parsed));
      }

      // 🔥 2. Fetch fresh data from backend
      const res = await fetch("http://localhost:5001/api/admin/dashboard-stats");

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      // 🔥 3. Update UI + cache
      setStats(formatStats(data));
      localStorage.setItem("admin_stats", JSON.stringify(data));

    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  // ✅ FORMAT FUNCTION
  const formatStats = (data) => [
    {
      title: "Pending Tools",
      value: data.pendingTools ?? 0,
      subtitle: "Awaiting admin review",
    },
    {
      title: "Pending Loans",
      value: data.pendingLoans ?? 0,
      subtitle: "Require approval action",
    },
    {
      title: "Active Schemes",
      value: data.activeSchemes ?? 0,
      subtitle: "Currently visible to users",
    },
  ];

  // Actions
  const actions = [
    {
      title: "Tool Approval",
      description: "Review recently submitted tools and approve valid listings.",
      ctaLabel: "Review Tools",
      to: "/admin/tools",
    },
    {
      title: "Loan Approval",
      description: "Check pending loan requests and approve eligible applications.",
      ctaLabel: "Review Loans",
      to: "/admin/loans",
    },
    {
      title: "Add Scheme",
      description: "Publish a new government or private farming support scheme.",
      ctaLabel: "Manage Schemes",
      to: "/admin/schemes",
    },
    {
      title: "Add Loan",
      description: "Create a new loan option and make it available to farmers.",
      ctaLabel: "Add Loan Data",
      to: "/admin/add-loan",
    },
  ];

  const recentActivities = [
    "Scheme 'Kisan Solar Support' was updated.",
    "2 new tool submissions are waiting for approval.",
    "Loan request #LN-204 marked for manual review.",
    "Admin profile settings were updated successfully.",
  ];

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "#222",
      }}
    >
      {/* Header */}
      <section style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: 0, color: "#1b5e20" }}>
          {greeting}, {name}
        </h1>
        <p style={{ margin: "8px 0 0", color: "#666" }}>{today}</p>
        <p style={{ margin: "8px 0 0", color: "#666" }}>
          Manage tools, loans, and schemes efficiently from your admin dashboard.
        </p>
      </section>

      {/* Stats */}
      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ margin: "0 0 14px", color: "#2e7d32" }}>Overview</h2>
        <div className="admin-grid">
          {stats.map((item) => (
            <StatsCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
            />
          ))}
        </div>
      </section>

      {/* Actions */}
      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ margin: "0 0 14px", color: "#2e7d32" }}>Admin Actions</h2>
        <div className="admin-grid">
          {actions.map((item) => (
            <ActionCard
              key={item.title}
              title={item.title}
              description={item.description}
              ctaLabel={item.ctaLabel}
              to={item.to}
            />
          ))}
        </div>
      </section>

      {/* Activity */}
      <section style={{ marginBottom: "8px" }}>
        <h2 style={{ margin: "0 0 14px", color: "#2e7d32" }}>Recent Activity</h2>
        <div className="admin-card" style={{ backgroundColor: "#e8f5e9" }}>
          {recentActivities.length === 0 ? (
            <p style={{ margin: 0, color: "#666" }}>
              No recent actions yet. Activity will appear here.
            </p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "18px", color: "#222" }}>
              {recentActivities.map((activity) => (
                <li key={activity} style={{ marginBottom: "8px" }}>
                  {activity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}