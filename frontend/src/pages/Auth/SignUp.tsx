import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import signUp from "../../assets/register.svg";
import { FaEnvelope, FaLock, FaAt, FaUser } from "react-icons/fa";
const Register = ({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (value: boolean) => void;
}) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [message, setMessage] = useState("")

  const navigate = useNavigate(); //hook de React Router

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    try {
      const response = await axios.post("http://localhost:5000/register", {
        user_name: userName,
        user_pwd: userPwd,
        user_email: userEmail,
      });

      if (response.status === 201) {
        


        const loginResponse = await axios.post("http://localhost:5000/login", {
          user_name: userName, 
          user_pwd: userPwd,
          user_email: userEmail,
        });

        if (loginResponse.status === 200) {
          // Guardo el token en localStorage para manejar la autenticación
          localStorage.setItem("token", loginResponse.data.token); // localStorage.setItem() se usa para almacenar un par clave-valor en localStorage, la api del navegador
          

          setIsLoggedIn(true); 
          navigate("/home");
        }
      }
    } catch (error) {
      setMessage("Registration could not be completed. Please check your details.");
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-section">
        <form onSubmit={handleRegister}>
          <div className="form-header">
            <h1>Register</h1>
            <p>Welcome aboard!</p>
          </div>
  
          <div className="input-group">
            <FaUser />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
  
          <div className="input-group">
            <FaAt />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
  
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
  
          <p className="password-requirements">
            Password must be 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.
          </p>

          {message && <p className="error-message">{message}</p>}
  
          <button type="submit">
            <FaEnvelope />
            Register
          </button>
        </form>
      </div>
  
      <div className="form-image-section">
        <img src={signUp} alt="Sign Up" />
      </div>
    </div>
  );
  
  
};

export default Register;
