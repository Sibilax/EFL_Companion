import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.scss";
import loginImage from "../../assets/login.svg";
import { FaEnvelope, FaLock, FaAt } from "react-icons/fa";

interface AdminLoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const loginResponse = await axios.post("http://localhost:5000/login", {
        admin_email: email, 
        admin_pwd: password, 
      });

      if (loginResponse.status === 200) {
        // Almacenar el token JWT en localStorage con una clave específica para admin
        localStorage.setItem("adminToken", loginResponse.data.token); //  "adminToken" para diferenciarlo del token de usuario

        setIsLoggedIn(true); 
        navigate("/admin/panel"); 
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Mostrar mensaje de error específico del backend
      } else if (error.response && error.response.status === 500) {
        setError("Server error, please try again later."); // Error de servidor
      } else {
        setError("Login failed. Please check your credentials and try again."); // Error general
      }
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-image-section">
        <img src={loginImage} alt="Admin Login" />
      </div>
  
      <div className="form-section">
        <form onSubmit={handleLogin}>
          <div className="form-header">
            <h1>Admin Login</h1>
            <p>Welcome back, Admin!</p>
          </div>
  
          <div className="input-group">
            <FaAt />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              required
            />
          </div>
  
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              required
            />
          </div>
  
          <button type="submit"> <FaEnvelope /> Login</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
  
};

export default AdminLogin;
