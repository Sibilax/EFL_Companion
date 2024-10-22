import { useState, useEffect } from "react";
import axios from "axios";
import BlogDetails from "../../components/BlogDetails";
import Loading from "../../components/Loading";
import "../../styles/Crud.scss";

const BlogCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "list" | "delete" | "update" | "detail"
  >("create");
  const [formData, setFormData] = useState<{
    blog_title: string;
    blog_content: string;
    blog_img: File | string | null;
  }>({
    blog_title: "",
    blog_content: "",
    blog_img: null,
  });

  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogId, setBlogId] = useState("");
  const [blogDetail, setBlogDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const adminToken = localStorage.getItem("adminToken");
  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  // Manejar cambios en el formulario de creación y actualización
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // carga de imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Obtengo el primer archivo seleccionado, index 0
    if (file) {
      setFormData((prev) => ({ ...prev, blog_img: file })); // Actualizo el estado con el archivo, copio todos los valores y agrego otro
    }
  };

  const handleCreate = async () => {
    const formattedFormData = new FormData();

    formattedFormData.append("blog_title", formData.blog_title.trim());
    formattedFormData.append("blog_content", formData.blog_content.trim());

    if (formData.blog_img) {
      formattedFormData.append("blog_img", formData.blog_img);
    }

    try {
      await axios.post("http://localhost:5000/blog", formattedFormData, config);
      alert("Blog created successfully");
      setFormData({ blog_title: "", blog_content: "", blog_img: null });
    } catch (error: any) {
      alert("Error creating the blog. Verify the data.");
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  const handleList = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/blogs", config);
      setBlogs(response.data);
    } catch (error: any) {
      alert("Error listing the blogs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/blog/${id}`);
      setBlogDetail(response.data);
    } catch (error: any) {
      alert("Error fetching blog details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/blog/${blogId}`, config);
      alert("Blog successfully deleted");
    } catch (error: any) {
      alert("Error deleting blog.");
    }
  };

  const handleUpdate = async () => {
    const updatedData: any = {};

    if (formData.blog_title) updatedData.blog_title = formData.blog_title;
    if (formData.blog_content) updatedData.blog_content = formData.blog_content;

    if (formData.blog_img instanceof File) {
      const file = formData.blog_img as File;
      const reader = new FileReader();
      reader.onloadend = async () => {
        updatedData.blog_img = reader.result as string;

        if (!blogId) {
          alert("Please provide the Blog ID to update.");
          return;
        }

        try {
          await axios.put(
            `http://localhost:5000/blog/${blogId}`,
            updatedData,
            config
          );
          alert("Blog successfully updated");
          setFormData({ blog_title: "", blog_content: "", blog_img: null });
          setBlogId("");
        } catch (error: any) {
          alert("Error updating the blog.");
        }
      };

      reader.readAsDataURL(file);
    } else {
      if (typeof formData.blog_img === "string") {
        updatedData.blog_img = formData.blog_img;
      }

      if (!blogId) {
        alert("Please provide the Blog ID to update.");
        return;
      }

      try {
        await axios.put(
          `http://localhost:5000/blog/${blogId}`,
          updatedData,
          config
        );
        alert("Blog successfully updated");
        setFormData({ blog_title: "", blog_content: "", blog_img: null });
        setBlogId("");
      } catch (error: any) {
        alert("Error updating blog.");
      }
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      handleList();
    }
  }, [activeTab]);

  return (
    <div className="crud-wrapper">
      <h1>Blog CRUD Panel</h1>

      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Create Blog</button>
        <button onClick={() => setActiveTab("list")}>Show Blogs</button>
        <button onClick={() => setActiveTab("delete")}>Delete Blog</button>
        <button onClick={() => setActiveTab("update")}>Update Blog</button>
        <button onClick={() => setActiveTab("detail")}>Show Blog Detail</button>
      </div>

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Create Blog</h2>
          <div className="input-group">
            <div className="input-group-textarea">
              <input
                type="text"
                name="blog_title"
                value={formData.blog_title}
                placeholder="Title"
                onChange={handleChange}
              />
              <textarea
                name="blog_content"
                value={formData.blog_content}
                placeholder=""
                onChange={handleChange}
                rows={5}
              />
              <input
                type="file"
                name="blog_img"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate}>Add Blog</button>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="crud-buttons">
          {loading ? (
            <Loading />
          ) : (
            <ul>
              {blogs.map((blog) => (
                <li key={blog.blog_id}>
                  <h3>{blog.blog_title}</h3>
                  <p>{blog.blog_content}</p>
                  {blog.blog_img && (
                    <img
                      src={blog.blog_img}
                      alt={`Image for ${blog.blog_title}`}
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete Blog</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Blog ID"
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleDelete}>Delete Blog</button>
          </div>
        </div>
      )}

      {activeTab === "update" && (
        <div className="crud-inputs">
          <h2>Update Blog</h2>
          <div className="input-group">
            <div className="input-group-textarea">
              <input
                type="text"
                placeholder="Blog ID"
                value={blogId}
                onChange={(e) => setBlogId(e.target.value)}
              />
              <input
                type="text"
                name="blog_title"
                value={formData.blog_title}
                placeholder="Title"
                onChange={handleChange}
              />
              <textarea
                name="blog_content"
                value={formData.blog_content}
                placeholder="Content"
                onChange={handleChange}
                rows={5}
              />
              <input
                type="file"
                name="blog_img"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="crud-buttons">
            <button onClick={handleUpdate}>Update Blog</button>
          </div>
        </div>
      )}

      {activeTab === "detail" && (
        <div className="crud-inputs">
          <h2>Blog Detail</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Blog ID"
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
            />
            <div className="crud-buttons">
              <button onClick={() => fetchBlogDetail(blogId)}>Get Blog</button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              blogDetail && <BlogDetails blog={blogDetail} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCrud;
