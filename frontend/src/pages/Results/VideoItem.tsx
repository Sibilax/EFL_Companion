import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/VideoItem.scss";

interface Video {
  video_id: number;
  video_title: string;
  video_content?: string;
  video_url: string;
}

const VideoItem = () => {
  const { video_id } = useParams<{ video_id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/video/${video_id}`
        );
        setVideo(response.data);
      } catch (error) {
        setError("Error loading the video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [video_id]);

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found.</p>;

  //const embedUrl = `https://www.youtube.com/embed/${video.video_url}`;

  return (
    <div className="video-wrapper">
      <div className="video-wrapper-items">
        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : !video ? (
          <p>Video not found.</p>
        ) : (
          <>
            <h1>{video.video_title}</h1>
            <div className="video_iframe">
              <iframe
                src={`https://www.youtube.com/embed/${video.video_url}`}
                title={video.video_title}
                width="560"
                height="315"
                style={{ border: "none" }}
                allowFullScreen
              ></iframe>
            </div>
            {video.video_content && (
              <div
                className="video-content"
                dangerouslySetInnerHTML={{ __html: video.video_content }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoItem;
