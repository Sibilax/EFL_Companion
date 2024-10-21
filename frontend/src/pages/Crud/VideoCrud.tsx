import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "list" | "delete" | "update">("list");
  const [formData, setFormData] = useState({
    video_title: "",
    video_content: "",
    video_url: "",
  });
  const [videos, setVideos] = useState<any[]>([]);
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:5000/video", formData, config);
      alert("Video created successfully");

      setFormData({
        video_title: "",
        video_content: "",
        video_url: "",
      });
    } catch (error: any) {
      alert("Error creating video");
    }
  };

  const handleList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/videos", config);
      setVideos(response.data);
    } catch (error: any) {
      alert("Error fetching video list");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/video/${videoId}`, config);
      alert("Video deleted successfully");
    } catch (error: any) {
      alert("Error deleting video");
    }
  };

  const handleUpdate = async () => {
    const updatedData: any = {};

    if (formData.video_title) updatedData.video_title = formData.video_title;
    if (formData.video_content) updatedData.video_content = formData.video_content;
    if (formData.video_url) updatedData.video_url = formData.video_url;

    if (!videoId) {
      alert("Please provide the video ID to update.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/video/${videoId}`, updatedData, config);
      alert("Video updated successfully");

      setFormData({
        video_title: "",
        video_content: "",
        video_url: "",
      });
      setVideoId("");
    } catch (error: any) {
      alert("Error updating video");
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      handleList();
    }
  }, [activeTab]);

  return (
    <div className="crud-wrapper">
      <h1>Video CRUD Panel</h1>

      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Create Video</button>
        <button onClick={() => setActiveTab("list")}>Show Videos</button>
        <button onClick={() => setActiveTab("delete")}>Delete Video</button>
        <button onClick={() => setActiveTab("update")}>Update Video</button>
      </div>

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Create Video</h2>
          <div className="input-group">
            <input
              type="text"
              name="video_title"
              value={formData.video_title}
              placeholder="Video Title"
              onChange={handleChange}
            />
            <input
              type="text"
              name="video_content"
              value={formData.video_content}
              placeholder="Video Content"
              onChange={handleChange}
            />
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              placeholder="Video URL"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate}>Add Video</button>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="crud-buttons">
          <ul>
            {videos.map((video: any) => (
              <li key={video.id}>
                <p>
                  <strong>Title: </strong>
                  {video.video_title}
                </p>
                <p>
                  <strong>Content: </strong>
                  {video.video_content}
                </p>
                Link:{" "}
                <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                  Watch Video
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete Video</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Video ID"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleDelete}>Delete Video</button>
          </div>
        </div>
      )}

      {activeTab === "update" && (
        <div className="crud-inputs">
          <h2>Update Video</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Video ID"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
            />
            <input
              type="text"
              name="video_title"
              value={formData.video_title}
              placeholder="Video Title"
              onChange={handleChange}
            />
            <input
              type="text"
              name="video_content"
              value={formData.video_content}
              placeholder="Video Content"
              onChange={handleChange}
            />
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              placeholder="Video URL"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleUpdate}>Update Video</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCrud;
