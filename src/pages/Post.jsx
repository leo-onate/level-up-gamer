import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts, formatDate } from "../data/blogs";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="container my-5">
        <h4>Artículo no encontrado</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/blogs")}>
          Volver al blog
        </button>
      </div>
    );
  }

  
  const paragraphs = post.content.trim().split("\n").filter(Boolean);

  return (
    <div className="container my-4">
      <div className="mb-3">
        <Link to="/blogs" className="btn category-btn mb-3">
          <span className="back-arrow" aria-hidden>←</span>
          Volver al blog
        </Link>
      </div>

      <span className="badge bg-secondary mb-2 blog-badge">{post.category}</span>
      <h2>{post.title}</h2>
      <small className="post-date">{formatDate(post.date)}</small>

      {post.cover ? (
        <div className="post-cover-container my-3">
          <img src={post.cover} alt={post.title} className="post-cover" />
        </div>
      ) : null}

      <div className="post-content-container">
        <div className="lead">
          {paragraphs.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  );
}
