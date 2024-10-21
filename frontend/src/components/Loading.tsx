import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div>
      <FaSpinner className="spinner" />  
      <p>Loading...</p> 
    </div>
  );
};

export default Loading;
