import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.scss";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // Hook para la redirección

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // elimino los espacios vacíos al final de la cadena query para garantizar q siempre haya algo q buscar, el espacio entre palabras se mantiene, solo se quitan el inicial y final
      navigate(`/results?query=${encodeURIComponent(query)}`); // Redirige a /results con el query en la URL
    }
    setQuery("");
  };

  const handleIconClick = (e: React.MouseEvent<SVGElement>) => {
    //debo indicar el evento y el tipo de dato(icono)
    e.preventDefault(); // Evita comportamiento predeterminado al darse el evento (refrescar)
    if (query.trim()) {
      navigate(`/results?query=${encodeURIComponent(query)}`); // Redirige a /results con el query en la URL
    }
    setQuery("");
  };

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSearch} className="searchbar-form">
        <div className="input-wrapper">
          <FaSearch className="search-icon" onClick={handleIconClick} />{" "}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)} //al darse el evento, se ejecuta la función parte del hook y se actualiza el edo al valor actual
            placeholder="Search"
            className="search-input"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
