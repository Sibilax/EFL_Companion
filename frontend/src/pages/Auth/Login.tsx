import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.scss";
import loginImage from "../../assets/login.svg";
import { FaEnvelope, FaLock, FaAt } from "react-icons/fa";



interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");  
  const [password, setPassword] = useState<string>("");  
  const [error, setError] = useState<string | null>(null);  
  const navigate = useNavigate(); 

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  

    try {
       
      const loginResponse = await axios.post("http://localhost:5000/login", {
        user_email: email,
        user_pwd: password,
      });

      if (loginResponse.status === 200) {
         
        localStorage.setItem("userToken", loginResponse.data.token);
        setIsLoggedIn(true);  

        navigate("/home");  
      }
    } catch (error: any) {
       
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-image-section">
        <img src={loginImage} alt="img" />
      </div>
  
      <div className="form-section">
        <form onSubmit={handleLogin}>
          <div className="form-header">
            <h1>
              Login
            </h1>
            <p>Good to have you back!</p>
          </div>
  
          <div className="input-group">
            <FaAt />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
  
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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

export default Login;
