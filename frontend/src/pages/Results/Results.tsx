import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../../styles/Results.scss";

interface Blog { //definir el tipo de objeto
  id: number;
  title: string;
}

interface Video {
  id: number;
  title: string;
}

const Results: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);  
  const [limit] = useState(10); 
  const [offset, setOffset] = useState(0); 
  const [hasMore, setHasMore] = useState(true); //verifico si hay más para cargar así puedo hacer scroll infinito
  const [error, setError] = useState<string | null>(null);  

  const location = useLocation(); //hook para almacenar ubicacion actual para obtener el término de bíúsqueda desde la url
  const query = new URLSearchParams(location.search).get("query"); //location.search  Accede a la parte de la URL que contiene los parámetros después del signo de interrogación
  //new URLSearchParams(location.search) convierte esos parámetros en un objeto y get("query") obtiene de ese objeto el valor asociado al parámetro de búsqueda
  const fetchResults = async (reset = false) => {
    //reset false para que no se reinicie la busqueda desde 0
    if (!query || loading) return; //verificación, devuelve true si al menos una es cierta (si query es falso o está cargando se da un retorno anticipado, no se ejecuta el resto)

    setLoading(true); //si query existe o si no está cargando se actualiza el valor
    setError(null); // restablece el error si existía algún error anterior

    try {
      const response = await axios.get("http://localhost:5000/search", {
        params: {
          //envío los parametros de la query
          query,
          limit,
          offset: reset ? 0 : offset,  
        },
      });

      const newBlogs = response.data.blogs; // almaceno la respuesta de la api
      const newVideos = response.data.videos;

      if (reset) {
        //si hago una busqueda se muestran los resultados y sí se hace una nueva, se remplazan esos resultados viejos por los nuevos de la busqueda nueva
        setBlogs(newBlogs);
        setVideos(newVideos);
        setOffset(limit);
      } else {
        //de lo contrario al hacer scroll se concatenan resultados nuevos a los que ya habína venido de la solcitud get inicial
        setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
        setOffset(offset + limit);
      }

      setHasMore(newBlogs.length > 0 || newVideos.length > 0); //mientras la api devuelva resultados (mayor q 0), sethasmore se mantiene truthy
    } catch (error) {
      setError("Unable to load the results. Please try again later.");
    } finally {
      //independientemente de si la solicitud a la API fue exitosa o falló
      setLoading(false); //pasar el setLoading a false, actualiza el estado y el spinner ya no va a funcionar pq la app ya no está en modo carga
    }
  };

  useEffect(() => {
    //equivalente a componentDidMount, se ejecuta si hay un cambio en las props o el edo. Toma dos args, una funciòn callback y opcional un array de dependencias que si se deja vacío solo se ejecuta una vez tras montarse el compnente([])
    if (query) {
      //cada vez que haya un valor de búsqueda
      fetchResults(true); //se ejecuta la solicitu get
    }
  }, [query]); //tiene query como dependencias, por lo q cada vez que este valor cambie, esta solicitud get se va a ejecutar (si fuera vacío el array, solo se ejecutaría una vez)

  useEffect(() => {
    //al montar el componente o cambia alguna de las dependencias (offset y hasmore en este caso)
    const handleScroll = () => {
      //ejecuto esta función con el scroll infinito
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight //si el usuario no ha llegado al final, la función se detiene con retorno anticipado (para que no siga cargando sin sentido)
      )
        return;
      if (hasMore) {
        // no uso else porque asi no se ejecuta más codigo si se cumple la condicion anterior y hay retrno anticipado
        fetchResults(); //si no hay retorno anticipado, porque se sigue scrolleando  y hay mas resultados, traerlos
      }
    };

    window.addEventListener("scroll", handleScroll); //agrego un event listener para cuando se monta el componente
    return () => window.removeEventListener("scroll", handleScroll); //   función de limpieza o cleanup function paras q al desmontar el componente se elimine el listener
  }, [offset, hasMore]); //array de dependencias es el segundo argumento de useEffect. Si hay cambios al actualizar el offset(nueva busqueda, reset o se cargan mas resultados se ejecuta este efecto)

  return (
    <div className="results-container">
      <h2>Results for: {query}</h2>
      {error && <p className="error-text">{error}</p>}
  
      {blogs.map((blog) => (
        <div key={blog.id} className="result-item">
          <Link to={`/blog/${blog.id}`}>
            <h3>{blog.title}</h3>
            <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
      ))}
  
      {videos.map((video) => (
        <div key={video.id} className="result-item">
          <Link to={`/video/${video.id}`}>
            <h3>{video.title}</h3>
            <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
      ))}
  
      {loading && <p className="loading-text">Loading...</p>}
    </div>
  );
  
};

export default Results;
