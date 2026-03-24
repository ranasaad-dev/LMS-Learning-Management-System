import { useEffect, useState } from "react";
import { FaTrash, FaUserEdit, FaSearch, FaPlus } from "react-icons/fa";
import adminService from "../../../../services/adminService";
import { Link, useParams } from "react-router-dom";
import Label from "/src/components/ui/label/Label";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const { id } = useParams();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data || []);
        setFilteredUsers(data || []);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users on search
  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminService.deleteUser(userId);
      const updatedUsers = users.filter((u) => u._id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Update role
  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingUserId(userId);
      await adminService.updateUser(userId, { role });
      const updatedUsers = users.map((u) => (u._id === userId ? { ...u, role } : u));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setMessage({ type: "success", text: `Role updated to "${role}" successfully!` });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update role. Try again." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.createUser(newUser);
      // Refresh list
      const data = await adminService.getUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
      setShowAddUser(false);
      setNewUser({ name: "", email: "", password: "", role: "student" });
      setMessage({ type: "success", text: "User created successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create user",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="manage-users-loading">Loading users...</div>;

  return (
    <div className="manage-users">
      {message.text && <div className={`role-message ${message.type}`}>{message.text}</div>}

      <h1 className="manage-users-title">Manage Users</h1>

      {/* Toolbar with Add User and Search */}
      <div className="user-manage-bar">
        
      <div className="users-toolbar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
        <button className="add-btn" onClick={() => setShowAddUser(true)}>
        <FaPlus /> Add User
        </button>
        
      </div>
      {error && <div className="manage-users-error">{error}</div>}

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={`role-badge ${user.role}`}
                  disabled={updatingUserId === user._id}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="actions">
        
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New User</h3>
            <form className="add-user-form" onSubmit={handleAddUser}>
              <div className="form-group">
                <Label>Name</Label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <Label>Email</Label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <Label>Password</Label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <Label>Role</Label>
                <select
                  value={newUser.role}
                  class="role-badge role-select"
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="add-btn" disabled={saving}>
                  {saving ? "Saving..." : "Create User"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddUser(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;