import { useState, useEffect } from "react";
import axios from "axios";

// Define el tipo para los tags
interface Tag {
  tag_id: number;
  tag_name: string;
  resource_type?: string;
}

const TagCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "get" | "delete" | "list"
  >("create");
  const [formData, setFormData] = useState({
    tag_name: "",
    resource_type: "",
    resource_id: "",
  });
  const [currentTagId, setCurrentTagId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string>("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [specificTag, setSpecificTag] = useState<Tag | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const adminToken = localStorage.getItem("adminToken");

  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Crear tag
  const handleCreate = async () => {
    try {
      await axios.post(
        "http://localhost:5000/tag",
        {
          tag_name: formData.tag_name,
          resource: formData.resource_type,
          resource_id: formData.resource_id,
        },
        config
      );
      alert("Tag created successfully");
      resetForm();
    } catch {
      alert("Error creating tag");
    }
  };

  const fetchAllTags = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tags", config);
      if (response.data && Array.isArray(response.data)) {
        setAllTags(response.data); // Almaceno los tags obtenidos
        setErrorMessage(null); // Limpiar mensaje de error
      } else {
        alert("No tags found.");
      }
    } catch {
      alert("Error getting tags.");
    }
  };

  const fetchSpecificTag = async () => {
    if (!currentTagId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/tag/${currentTagId}`,
        config
      );
      if (response.data) {
        setSpecificTag(response.data);
        setErrorMessage(null);
      } else {
        alert("Tag not found.");
      }
    } catch {
      alert("Error getting tag.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/tag/${id}`, config);
      alert("Tag deleted successfully");
      fetchAllTags();
      setDeleteId(""); // Limpiar campo después de eliminar
    } catch {
      alert("Error deleting tag");
    }
  };

  const resetForm = () => {
    setFormData({
      tag_name: "",
      resource_type: "",
      resource_id: "",
    });
    setCurrentTagId(null);
    setActiveTab("create");
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchAllTags();
    }
  }, [activeTab]);

  return (
    <div className="crud-wrapper">
      <h1>Tags CRUD Panel</h1>
      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Create Tag</button>
        <button onClick={() => setActiveTab("list")}>Show tags</button>
        <button onClick={() => setActiveTab("delete")}>Delete Tag</button>
        <button onClick={() => setActiveTab("get")}>Get Tag by ID</button>
      </div>

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Create Tag</h2>
          <div className="input-group">
            <input
              type="text"
              name="tag_name"
              value={formData.tag_name}
              placeholder="Tag name"
              onChange={handleChange}
            />
            <select
              name="resource_type"
              value={formData.resource_type}
              onChange={handleChange}
            >
              <option value="">Select resource</option>
              <option value="curso">Course</option>
              <option value="blog">Blog</option>
              <option value="video">Video</option>
              <option value="pregunta">Question</option>
            </select>
            <input
              type="text"
              name="resource_id"
              value={formData.resource_id}
              placeholder="Resource ID"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate}>Add Tag</button>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="crud-list">
          <h2>List of Tags</h2>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <ul>
            {allTags.length > 0 &&
              allTags.map((tag) => (
                <li key={tag.tag_id}>
                  <strong>ID:</strong> {tag.tag_id} {" - "}
                  <strong>Name:</strong> {tag.tag_name} {" - "}
                  <strong>Type of resource:</strong>{" "}
                  {tag.resource_type || "N/A"}
                </li>
              ))}
          </ul>
        </div>
      )}

      {activeTab === "get" && (
        <div className="crud-inputs">
          <h2>Get Tag by ID</h2>
          <div className="input-group">
            <input
              type="text"
              value={currentTagId || ""}
              placeholder="Tag ID"
              onChange={(e) => setCurrentTagId(Number(e.target.value))}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={fetchSpecificTag}>Get Tag</button>
          </div>
          {specificTag && (
            <div>
              <p>
                <strong>Tag:</strong> {specificTag.tag_name}
              </p>
            </div>
          )}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      )}

      {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete Tag by ID</h2>
          <div className="input-group">
            <input
              type="text"
              value={deleteId}
              placeholder="Tag ID"
              onChange={(e) => setDeleteId(e.target.value)}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={() => handleDelete(Number(deleteId))}>
              Delete Tag
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagCrud;
