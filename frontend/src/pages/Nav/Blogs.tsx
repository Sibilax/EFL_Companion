import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import "../../styles/Blogs.scss";

interface Blog {
  blog_id: number;
  blog_title: string;
  blog_content: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    if (loading || !loadMore) return;
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/blogs", {
        params: { limit, offset },
      });

      const newBlogs = response.data;

      if (newBlogs.length === 0) {
        setLoadMore(false); // Detener la carga si no hay más blogs
      }

      setBlogs((prevBlogs) => [
        ...prevBlogs,
        ...newBlogs.filter(
          (newBlog: Blog) =>
            !prevBlogs.some((prevBlog) => prevBlog.blog_id === newBlog.blog_id)
        ),
      ]);

      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      setError("Error loading blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Carga inicial de blogs una vez
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        !loading &&
        loadMore &&
        scrollTop + windowHeight >= documentHeight - 100
      ) {
        fetchBlogs();
      }
    };

    // event listener solo si aún hay más para cargar
    /*if (loadMore) {
      window.addEventListener("scroll", handleScroll);
    }*/

    window.removeEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, loadMore]);

  return (
    <div className="blogs-wrapper">
      <div className="blogs-container">
        <h1>Blogs</h1>
        {blogs.map((blog) => (
          <div key={blog.blog_id} className="blog-item">
            <h2>{blog.blog_title}</h2>
            <p>{blog.blog_content.slice(0, 1000)}...</p>
            <Link to={`/blog/${blog.blog_id}`}>Read More</Link>
          </div>
        ))}
        {loading && (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading...</p>
          </div>
        )}
        {!loadMore && <p>No more blogs to load.</p>}{" "}
      </div>
    </div>
  );
};

export default Blogs;
