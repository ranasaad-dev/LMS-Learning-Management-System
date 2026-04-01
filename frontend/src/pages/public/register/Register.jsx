import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "/src/context/AuthContext";
import notify from "../../../components/ui/notify/Notify";
import { FaEye, FaEyeSlash } from "react-icons/fa"
import Label from "/src/components/ui/label/Label";
import './Register.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confimPassword, setConfirmPassword] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [isCPHidden, setIsCPHidden] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confimPassword) {

      try {
        await register(name, email, password);
        navigate("/login");
        notify("Successfuly registred", "success");
      } catch {

        notify("Registration failed", "error");
      }

    } else {

      notify("password didn;t matched.", "warning");
    }

  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h3 className="register-title">Register</h3>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <Label className="dark">Name</Label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <Label className="dark">Email</Label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <Label className="dark">Password</Label>
            <input type={isHidden?"password":"text"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          {isHidden ? <FaEyeSlash onClick={() => setIsHidden(!isHidden)} className="eye-icon-password" /> : <FaEye onClick={() => setIsHidden(!isHidden)} className="eye-icon-password" />}
          </div>


          <div className="form-group">
            <Label className="dark">Confirm Password</Label>
            <input type={isCPHidden?"password":"text"} minLength={8} value={confimPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {isCPHidden ? <FaEyeSlash onClick={() => setIsCPHidden(!isCPHidden)} className="eye-icon-confirm" /> : <FaEye onClick={() => setIsCPHidden(!isCPHidden)} className="eye-icon-confirm" />}
          </div>


          <button type="submit" className="register-btn">
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;