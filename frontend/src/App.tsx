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
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

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

  const shouldShowFooter = () => {
    return location.pathname !== "/login" && location.pathname !== "/signup";
  };

  return (
    <Router>
      <NavBar
        isUserLoggedIn={isUserLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsUserLoggedIn={setIsUserLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      <Routes>
        <Route path="/" element={<SplashPage />} />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsUserLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsUserLoggedIn} />}
        />

        <Route
          path="/home"
          element={
            isUserLoggedIn || isAdminLoggedIn ? <Home /> : <Navigate to="/" />
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

        <Route
          path="/admin/login"
          element={<LoginAdmin setIsLoggedIn={setIsAdminLoggedIn} />}
        />

        {isAdminLoggedIn && (
          <>
            <Route path="/admin/panel" element={<AdminPanel />} />
          </>
        )}
      </Routes>

      {shouldShowFooter() && <Footer />}
    </Router>
  );
};

export default App;
