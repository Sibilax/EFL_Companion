import Logo from "./Logo";
import SiteName from "./SiteName";
import SearchBar from "./SearchBar";
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/NavBar.scss";
import Burger from "./Burger";

interface NavBarProps {
  isUserLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: React.FC<NavBarProps> = ({
  isUserLoggedIn,
  isAdminLoggedIn,
  setIsUserLoggedIn,
  setIsAdminLoggedIn,
}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para redirección
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (isUserLoggedIn) {
      setIsUserLoggedIn(false);
      localStorage.removeItem("userToken");
    } else if (isAdminLoggedIn) {
      setIsAdminLoggedIn(false);
      localStorage.removeItem("adminToken");
    }
    setTimeout(() => navigate("/"), 0);
  };

  let navbarContent;

  if (
    !isUserLoggedIn &&
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/signup")
  ) {
    // Navbar para la splashpage, login y signup cuando el usuario NO está logueado
    navbarContent = (
      <div className="navbar-splash">
        <div className="navbar-splash-name">
          <SiteName />
        </div>
        <div className="navbar-splash-auth-links">
          <NavLink
            to="/signup"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Sign Up
          </NavLink>
          <hr />
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Log In
          </NavLink>
        </div>
      </div>
    );
  } else if (isUserLoggedIn || isAdminLoggedIn) {
    // Navbar para cuando el usuario está logueado
    navbarContent = (
      <>
        <div className={`navbar-nav-links-wrapper ${menuOpen ? "open" : ""}`}>
          {" "}
          {/*para dar estilos*/}
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/quizzes"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quizzes
          </NavLink>
          <NavLink
            to="/videos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Videos
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact
          </NavLink>
        </div>

        {/* Renderiza la barra de búsqueda y el botón de logout */}
        <div className="navbar-searchbar">
          <SearchBar />
        </div>
        <div className="navbar-signout">
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </>
    );
  } else {
    navbarContent = null;
  }

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-logo">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Logo size={80} />
        </NavLink>
      </div>

      <Burger isOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      {/*Paso props al componente burger, */}

      {navbarContent}
    </nav>
  );
};

export default NavBar;
