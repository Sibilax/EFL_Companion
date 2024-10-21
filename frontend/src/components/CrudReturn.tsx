import { useNavigate } from "react-router-dom";

const CrudReturn: React.FC = () => {
  const navigate = useNavigate();  

  const handleBack = () => {
    navigate("/admin/panel");  
  };

  return (
    <div className="crud-return">
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default CrudReturn;
