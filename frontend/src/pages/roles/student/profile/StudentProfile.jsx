import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

import "./StudentProfile.css";

function StudentProfile() {

  const { user } = useAuth();


  return (

    <div className="profile-container">
      <h2 className="profile-title">Student Profile</h2>
      <div class="profile-card">
        <div class="profile-row">
          <span class="label">Name:</span>
          <span class="value">{user.name}</span>
        </div>
        <div class="profile-row">
          <span class="label">Email:</span>
          <span class="value">{user.email}</span>
        </div>
      </div>
      <Link to="/edit-profile" className="profile-btn">Update Profile</Link>

    </div>

  );

}

export default StudentProfile;