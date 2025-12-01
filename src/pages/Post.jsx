import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlogById } from "../services/blogsService";

// Útil para formatear la fecha
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const data = await fetchBlogById(id);
        setPost(data);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Error al cargar el artículo');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container my-5">
        <h4>{error || 'Artículo no encontrado'}</h4>
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
      <small className="post-date">{formatDate(post.publishedDate)}</small>
      {post.author && <div className="text-muted mt-1">Por {post.author}</div>}

      {post.image ? (
        <div className="post-cover-container my-3">
          <img src={post.image} alt={post.title} className="post-cover" />
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
