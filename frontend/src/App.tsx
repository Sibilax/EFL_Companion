import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/App.scss";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { SplashPage, Quizzes, Videos, Contact, Blogs, Home } from "./pages/Nav";
import { LoginAdmin, Login, SignUp } from "./pages/Auth";
import { Results, VideoItem, BlogItem } from "./pages/Results";
import { AdminPanel } from "./pages/Crud";

const App: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false); // Estado inicial para el login de usuarios
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false); // Estado para el login de administradores

  // Efecto para comprobar el token de login al cargar la app
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken) {
      setIsUserLoggedIn(true);
    }

    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Función para verificar si se debe mostrar el footer
  const shouldShowFooter = () => {
    return (
      location.pathname !== "/login" && // No mostrar footer en la página de login
      location.pathname !== "/signup" // No mostrar footer en la página de signup
    );
  };

  return (
    <Router>
      {/* Navbar, la renderizo fuera de las rutas para que esté siempre visible */}
      <NavBar
        isUserLoggedIn={isUserLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      <Routes>
        {/* Ruta principal: página que se muestra si el usuario no está logueado */}
        <Route path="/" element={<SplashPage />} />

        {/* Rutas de login y signup */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsUserLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsUserLoggedIn} />}
        />

        {/* Rutas protegidas para usuarios logueados */}
        <Route
          path="/home"
          element={
            isUserLoggedIn || isAdminLoggedIn ? (
              <Home /> // Si el usuario está logueado, muestra la página de inicio
            ) : (
              <Navigate to="/" />
            ) // Si no está logueado, redirige a la página splash
          }
        />

        <Route
          path="/blogs"
          element={
            isUserLoggedIn || isAdminLoggedIn ? <Blogs /> : <Navigate to="/" />
          }
        />

        <Route
          path="/contact"
          element={
            isUserLoggedIn || isAdminLoggedIn ? (
              <Contact />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/videos"
          element={
            isUserLoggedIn || isAdminLoggedIn ? <Videos /> : <Navigate to="/" />
          }
        />

        <Route path="/video/:video_id" element={<VideoItem />} />

        <Route
          path="/quizzes"
          element={
            isUserLoggedIn || isAdminLoggedIn ? (
              <Quizzes />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/results" element={<Results />} />
        <Route path="/blog/:blog_id" element={<BlogItem />} />

        {/* Ruta para el login de administrador */}
        <Route
          path="/admin/login"
          element={<LoginAdmin setIsLoggedIn={setIsAdminLoggedIn} />} 
        />

        {/* Rutas protegidas */}
        {isAdminLoggedIn && (
          <>
            <Route path="/admin/panel" element={<AdminPanel />} />
          </>
        )}
      </Routes>

      {/* Mostrar el footer según la ruta */}
      {shouldShowFooter() && <Footer />}
    </Router>
  );
};

export default App;
