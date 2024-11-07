import "../styles/BlogDetails.scss";

interface BlogProps {
  blog: {
    blog_id: number;
    blog_title: string;
    blog_content: string;
    blog_img?: string;
  } | null;
}

const BlogDetails: React.FC<BlogProps> = ({ blog }) => {
  if (!blog) return <p>Blog not found.</p>;

  // Si la cadena ya contiene el prefijo 'data:image/png;base64,', no se añade de nuevo.
  const imageUrl =
    blog.blog_img && blog.blog_img.startsWith("data:image/")
      ? blog.blog_img
      : `data:image/png;base64,${blog.blog_img}`;

  return (
    <div className="blog_item_result_wrapper">
        <div className="blog_item_result_container">
          <h1>{blog.blog_title}</h1>

          {imageUrl && (
            <div className="blog_item_img">
              <img
                src={imageUrl}
                alt={`Image: ${blog.blog_title}`}
                style={{ width: "500px", height: "auto", objectFit: "cover" }}
              />
            </div>
          )}

          <p>{blog.blog_content}</p>
        </div>
    </div>
  );
};

export default BlogDetails;
