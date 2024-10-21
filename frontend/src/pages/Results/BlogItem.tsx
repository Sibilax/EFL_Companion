import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogDetails from "../../components/BlogDetails";


 interface Blog {
  blog_id: number;
  blog_title: string;
  blog_content: string;
  blog_img?: string; 
}

const BlogItem = () => {
  const { blog_id } = useParams();  
  const [blog, setBlog] = useState<Blog | null>(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/blog/${blog_id}`
        );

        setBlog(response.data);  
      } catch (error) {
        setError("Error fetching blog");
      } finally {
        setLoading(false);  
      }
    };
    fetchBlog();  
  }, [blog_id]);  

  if (loading) return <p>Loading...</p>;  

  if (error) return <p className="error-message">{error}</p>;  

  return <BlogDetails blog={blog} />; 
};

export default BlogItem;
