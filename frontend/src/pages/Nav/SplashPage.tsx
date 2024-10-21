import WelcomeMessage from "../../components/Welcome_Message";
import splashImage from "../../assets/splash.svg";
import "../../styles/SplashPage.scss";

const SplashPage: React.FC = () => {
  return (
    <div className="splash-midsection-wrapper">
      <div className="splash-welcome-message">
        <WelcomeMessage />
      </div>

      <div className="splash-img">
        <img src={splashImage} alt="img" />
      </div>
    </div>
  );
};

export default SplashPage;
