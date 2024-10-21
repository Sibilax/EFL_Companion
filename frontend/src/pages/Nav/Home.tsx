import Course from "../../components/Course";
import "../../styles/Home.scss";

const Home: React.FC = () => {
  return (
    <div className="home-wrapper">
      <div className="home-component">
        <Course />
      </div>
    </div>
  );
};

export default Home;
