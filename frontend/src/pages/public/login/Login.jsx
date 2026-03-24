import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "/src/context/AuthContext";
import Loading from "/src/components/ui/Loading"
import notify from "../../../components/ui/notify/Notify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Label from "/src/components/ui/label/Label";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const [isHidden, setIsHidden] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const loggedUser = await login(email, password);
      if (!loggedUser) {
        notify("Login Failed", "error");
        return;
      }

      navigate(`/dashboard/${loggedUser._id}`);
      notify(`welcome, ${loggedUser.name}`, "success");
    } catch (error) {

      notify("Login Failed", "error");
    } finally {
      setLoading(false);
    }

  };

  return (
    !loading ? (<div className="login-container">
      <div className="login-card">
        <h3 className="login-title">Login</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Label>Email</Label>
        
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <Label>Password</Label>

            <input type={isHidden?"password":"text"} value={password} minLength={8} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
         
         {isHidden? <FaEyeSlash onClick={()=> setIsHidden(!isHidden)} className="eye-icon" />:<FaEye onClick={()=> setIsHidden(!isHidden)} className="eye-icon" />} 
           
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>

        </form>
      </div>
    </div>) : <Loading />
  );
};

export default Login;