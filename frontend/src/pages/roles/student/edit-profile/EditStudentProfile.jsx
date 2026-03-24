import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import apiClient from "../../../../services/apiClient"; // Axios instance
import notify from "../../../../components/ui/notify/Notify";
import authService from "../../../../services/authService";
import Label from "/src/components/ui/label/Label";
import "./EditStudentProfile.css";

function EditStudentProfile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentPassword) {
      notify("Please enter your current password", "warning");
      return;
    }
  
    const updateData = {
      name: name,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    if (Object.keys(updateData).length === 0) {
      notify("No changes detected", "info");
      return;
    }
  
    setLoading(true);
  
    try {
      const updatedUser = await authService.updateProfile(user._id, updateData);

      setUser(updatedUser);
  
      notify("Profile updated successfully", "success");
  
      setCurrentPassword("");
      setNewPassword("");
  
    } catch (err) {
      notify(err.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Edit Profile</h2>
      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-group">
            <Label>Name</Label>
            <input className="inputComponent" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="profile-group">
            <Label>Email</Label>
            <input className="inputComponent" type="email" value={user.email} disabled />
          </div>

          <div className="profile-group">
            <Label>Current Password</Label>
            <input className="inputComponent" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Required if changing password" />
          </div>

          <div className="profile-group">
            <Label>New Password</Label>
            <input className="inputComponent" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave empty if not changing" />
          </div>

          <button type="submit" className="profile-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditStudentProfile;