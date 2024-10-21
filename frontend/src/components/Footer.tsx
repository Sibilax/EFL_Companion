import { useLocation } from "react-router-dom";
import "../styles/Footer.scss";
import { FaClock, FaLaptop, FaChalkboardTeacher } from "react-icons/fa";

const Footer: React.FC = () => {
  const location = useLocation(); // Obtengo la ruta actual

  //en la SplashPage renderizo:
  if (location.pathname === "/") {
    return (
      <div className="footer-wrapper">
        <div className="footer-messages">
          <FaLaptop size={25} color="#2F1C6a"/>
          <h1>Learn from home</h1>
        </div>
        <div className="footer-messages">
          <FaClock size={20} color="#2F1C6a"/>
          <h1>Work at your own pace</h1>
        </div>
        <div className="footer-messages">
          <FaChalkboardTeacher size={25} color="#2F1C6a"/>
          <h1>Challenge yourself</h1>
        </div>
      </div>
    );
  }

  // en cualquier otra página (excepto login/signup):
  return (
    <div className="footer-wrapper">
      <div className="footer-messages">
        <h1>Explore our content and learn more!</h1>
      </div>
    </div>
  );
};

export default Footer;
