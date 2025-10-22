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
        <button className="btn btn-primary mt-3" onClick={() => navigate("/blog")}>
          Volver al blog
        </button>
      </div>
    );
  }

  
  const paragraphs = post.content.trim().split("\n").filter(Boolean);

  return (
    <div className="container my-4">
      <div className="mb-3">
        <Link to="/blog" className="btn btn-outline-light btn-sm">← Volver al blog</Link>
      </div>

      <span className="badge bg-secondary mb-2">{post.category}</span>
      <h2>{post.title}</h2>
      <small className="text-muted">{formatDate(post.date)}</small>

      {post.cover ? (
        <img src={post.cover} alt={post.title} className="img-fluid rounded my-3" />
      ) : null}

      <div className="lead">
        {paragraphs.map((line, i) => <p key={i}>{line}</p>)}
      </div>
    </div>
  );
}
