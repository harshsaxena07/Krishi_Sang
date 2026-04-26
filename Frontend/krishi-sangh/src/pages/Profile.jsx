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
      <div className="profile-page__intro">
        <h1>Farmer Profile Dashboard</h1>
        <p>Manage your profile details and track the tools you have listed.</p>
      </div>

      {saveMessage.text && (
        <div className={`profile-alert profile-alert--${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      <section className="profile-section" aria-labelledby="profile-section-title">
        <div className="profile-section__heading">
          <h2 id="profile-section-title">Profile Section</h2>
        </div>

        <div className="card profile-card profile-card--hero">
          {profileLoading ? (
            <p className="profile-state-text">Loading profile...</p>
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
                <div className="profile-header__content">
                  <h3>{profile.name || "Farmer"}</h3>
                  <p className="profile-meta">{profile.phone || profile.email || "No contact added"}</p>
                  <p className="profile-meta">{profile.location || "Location not available"}</p>
                </div>
              </div>

              {profileError && (
                <p className="profile-warning">{profileError}</p>
              )}

              {isEditing ? (
                <div className="profile-form">
                  <label>
                    <span>Name</span>
                    <input
                      className="form-input"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label>
                    <span>Phone</span>
                    <input
                      className="form-input"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label>
                    <span>Location</span>
                    <input
                      className="form-input"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </label>

                  <div className="profile-form__actions">
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
      </section>

      <section className="profile-section profile-section--tools" aria-labelledby="tools-section-title">
        <div className="profile-section__heading profile-section__heading--tools">
          <div>
            <h2 id="tools-section-title">Your Added Tools</h2>
            <p>Review availability, approval status, and listing details.</p>
          </div>
          <Link to="/add-tool" className="btn btn-secondary profile-add-tool">
            Add New Tool
          </Link>
        </div>

        <div className="card profile-card profile-card--tools">
          {toolsError && <p className="profile-warning">{toolsError}</p>}

          {toolsLoading ? (
            <p className="profile-state-text">Loading tools...</p>
          ) : tools.length === 0 ? (
            <p className="profile-state-text">You haven't added any tools yet</p>
          ) : (
            <div className="tools-grid">
              {tools.map((tool) => {
                const status = tool.status === "pending" ? "pending" : "approved";

                return (
                  <article key={tool.id} className="tool-card">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="tool-card__image"
                      onError={(e) => {
                        e.target.src = "/images/default-tool.jpg";
                      }}
                    />

                    <div className="tool-card__body">
                      <div className="tool-card__main">
                        <h3>{tool.name}</h3>
                        <p className="tool-card__price">Rs {tool.price_per_day}/day</p>
                        <p className="tool-card__location">{tool.location}</p>
                      </div>

                      <span className={`status-badge status-badge--${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>

                      <div className="tool-card__actions">
                        <button
                          type="button"
                          className="btn tool-action tool-action--edit"
                          onClick={handleEditTool}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn tool-action tool-action--delete"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
