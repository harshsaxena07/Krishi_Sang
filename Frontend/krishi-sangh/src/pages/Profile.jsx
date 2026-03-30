import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profileData } from "../data/profile";
import "../styles/pages/profile.css";

const API_BASE = "http://127.0.0.1:5001/api";

const fallbackProfile = {
  name: profileData?.name || "Farmer",
  phone: profileData?.phone || "",
  email: profileData?.email || "",
  location: [
    profileData?.village,
    profileData?.district,
    profileData?.state,
  ]
    .filter(Boolean)
    .join(", "),
  avatar: profileData?.image || "",
};

const fallbackTools = [
  {
    id: "local-1",
    name: "Mahindra Tractor 575",
    price_per_day: 2500,
    location: "Nashik, Maharashtra",
    image: "/images/Mahindra575DITractor.jpg",
    status: "approved",
  },
  {
    id: "local-2",
    name: "Rotavator Pro",
    price_per_day: 1800,
    location: "Nagpur, Maharashtra",
    image: "/images/fieldmaster.jpg",
    status: "pending",
  },
];

export default function Profile() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [formData, setFormData] = useState({
    name: fallbackProfile.name,
    phone: fallbackProfile.phone,
    location: fallbackProfile.location,
  });
  const [tools, setTools] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [toolsError, setToolsError] = useState("");
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError("");

      try {
        const res = await fetch(`${API_BASE}/user/profile`);

        if (!res.ok) {
          throw new Error("Profile endpoint unavailable");
        }

        const data = await res.json();
        const normalizedProfile = {
          name: data?.name || fallbackProfile.name,
          phone: data?.phone || "",
          email: data?.email || "",
          location:
            data?.location ||
            [data?.village, data?.district, data?.state].filter(Boolean).join(", "),
          avatar: data?.avatar || data?.image || fallbackProfile.avatar,
        };

        if (mounted) {
          setProfile(normalizedProfile);
          setFormData({
            name: normalizedProfile.name,
            phone: normalizedProfile.phone,
            location: normalizedProfile.location || "",
          });
        }
      } catch (error) {
        if (mounted) {
          setProfile(fallbackProfile);
          setFormData({
            name: fallbackProfile.name,
            phone: fallbackProfile.phone,
            location: fallbackProfile.location || "",
          });
          setProfileError("Profile API unavailable. Showing local data.");
        }
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    const fetchTools = async () => {
      setToolsLoading(true);
      setToolsError("");

      try {
        const res = await fetch(`${API_BASE}/user/tools`);

        if (!res.ok) {
          throw new Error("User tools endpoint unavailable");
        }

        const data = await res.json();
        const rawTools = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

        const normalizedTools = rawTools.map((tool, index) => ({
          id: tool.id || `tool-${index}`,
          name: tool.name || "Unnamed Tool",
          price_per_day: tool.price_per_day || tool.price || 0,
          location: tool.location || "Not specified",
          image: tool.image || "/images/default-tool.jpg",
          status: (tool.status || "approved").toLowerCase(),
        }));

        if (mounted) setTools(normalizedTools);
      } catch (error) {
        if (mounted) {
          setTools(fallbackTools);
          setToolsError("Tools API unavailable. Showing fallback data.");
        }
      } finally {
        if (mounted) setToolsLoading(false);
      }
    };

    fetchProfile();
    fetchTools();

    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveMessage({ type: "", text: "" });

    const payload = {
      name: formData.name?.trim(),
      phone: formData.phone?.trim(),
      location: formData.location?.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      setProfile((prev) => ({
        ...prev,
        name: payload.name || prev.name,
        phone: payload.phone || "",
        location: payload.location || "",
      }));

      setIsEditing(false);
      setSaveMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setProfile((prev) => ({
        ...prev,
        name: payload.name || prev.name,
        phone: payload.phone || prev.phone,
        location: payload.location || prev.location,
      }));
      setIsEditing(false);
      setSaveMessage({
        type: "error",
        text: "Could not save to server. Changes kept locally.",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteTool = (toolId) => {
    setTools((prev) => prev.filter((tool) => tool.id !== toolId));
    setSaveMessage({ type: "success", text: "Tool removed from dashboard view." });
  };

  const handleEditTool = () => {
    setSaveMessage({
      type: "error",
      text: "Tool edit API is not connected yet.",
    });
  };

  const avatarSrc =
    profile.avatar || "https://via.placeholder.com/140x140?text=Farmer";

  return (
    <div className="page profile-page">
      <h1>Farmer Profile Dashboard</h1>

      {saveMessage.text && (
        <div
          style={{
            marginBottom: "14px",
            padding: "10px 12px",
            borderRadius: "8px",
            border: `1px solid ${saveMessage.type === "success" ? "#81c784" : "#ef9a9a"}`,
            background: saveMessage.type === "success" ? "#e8f5e9" : "#ffebee",
            color: saveMessage.type === "success" ? "#1b5e20" : "#b71c1c",
          }}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="card profile-card">
        {profileLoading ? (
          <p style={{ margin: 0 }}>Loading profile...</p>
        ) : (
          <>
            <div className="profile-header">
              <img
                src={avatarSrc}
                alt="Profile"
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/140x140?text=Farmer";
                }}
              />
              <div>
                <h2>{profile.name || "Farmer"}</h2>
                <p className="profile-meta">{profile.phone || profile.email || "No contact added"}</p>
                <p className="profile-meta">{profile.location || "Location not available"}</p>
              </div>
            </div>

            {profileError && (
              <p style={{ color: "#c62828", marginBottom: "10px" }}>{profileError}</p>
            )}

            {isEditing ? (
              <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                <label>
                  <span style={{ display: "block", marginBottom: "6px" }}>Name</span>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span style={{ display: "block", marginBottom: "6px" }}>Phone</span>
                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  <span style={{ display: "block", marginBottom: "6px" }}>Location</span>
                  <input
                    className="form-input"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </label>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile.name || "",
                        phone: profile.phone || "",
                        location: profile.location || "",
                      });
                    }}
                    disabled={saveLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>

      <div className="card profile-card" style={{ marginTop: "18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>Your Added Tools</h2>
          <Link to="/add-tool" className="btn btn-secondary">
            Add New Tool
          </Link>
        </div>

        {toolsError && <p style={{ color: "#c62828" }}>{toolsError}</p>}

        {toolsLoading ? (
          <p>Loading tools...</p>
        ) : tools.length === 0 ? (
          <p>You haven't added any tools yet</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px",
              marginTop: "12px",
            }}
          >
            {tools.map((tool) => {
              const status = tool.status === "pending" ? "pending" : "approved";
              const statusBg = status === "pending" ? "#fff3e0" : "#e8f5e9";
              const statusColor = status === "pending" ? "#e65100" : "#1b5e20";

              return (
                <article key={tool.id} className="card" style={{ padding: "12px" }}>
                  <img
                    src={tool.image}
                    alt={tool.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                    onError={(e) => {
                      e.target.src = "/images/default-tool.jpg";
                    }}
                  />

                  <h3 style={{ margin: "0 0 6px" }}>{tool.name}</h3>
                  <p style={{ margin: "0 0 4px" }}>
                    <strong>Price:</strong> Rs {tool.price_per_day}/day
                  </p>
                  <p style={{ margin: "0 0 8px" }}>
                    <strong>Location:</strong> {tool.location}
                  </p>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: statusBg,
                      color: statusColor,
                      marginBottom: "10px",
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleEditTool}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleDeleteTool(tool.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
