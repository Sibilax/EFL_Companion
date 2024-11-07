import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import "../../styles/Videos.scss";

interface Video {
  video_id: number;
  video_title: string;
  video_url: string;
  video_content: string;
}

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 10; // Number of videos to load per request
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/videos", {
        params: { limit, offset },
      });

      const newVideos = response.data;

      setError(null);

      // Remover duplicados al actualizar edo. Le paso una funcion como estado ((prevVideos) => { ... }); q incluye los valores q ya tiene almacenados
      setVideos((prevVideos) => {
        const allVideos = [...prevVideos, ...newVideos]; //desestructuro esos valores y los nuevos y los almaceno en un nuevo array
        const uniqueVideos = allVideos.filter(
          //se filtra el nuevo array(self) por elemento actual(v) e index para verificar q sea único
          (v, index, self) =>
            index === self.findIndex((t) => t.video_id === v.video_id) //compara el video actual (v) con el del array(t) y si está repetido continua avanzando, cuando aparece uno q no coincide(es nuevo) lo agrega a al array uniquevideos
        );
        return uniqueVideos; //retorna el resultado sin duplicados
      });

      setOffset((prevOffset) => prevOffset + limit);
      setHasMore(newVideos.length === limit);
    } catch (error: any) {
      setError("Failed to load videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 // MArgen para evitar llamnadas anticipadas
      ) {
        fetchVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); //

  return (
    <div className="videos-wrapper">
      <h1>Videos</h1>
      {error && <p className="error-message">{error}</p>}

      {videos.map((video) => (
        <div key={video.video_id} className="video-item">
          <h2>{video.video_title}</h2>
          <div
            className="video-content-summary"
            dangerouslySetInnerHTML={{
              __html: video.video_content.slice(0, 500) + "...",
            }}
          />
          <Link to={`/video/${video.video_id}`}>Watch video</Link>
        </div>
      ))}

      {loading && (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Videos;
