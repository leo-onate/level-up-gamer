import { Link } from "react-router-dom";
import { formatDate } from "../data/blogs";

export default function BlogCard({ post }) {
  return (
    <div className="card bg-dark text-white h-100">
      {post.cover ? (
        <img src={post.cover} className="card-img-top" alt={post.title} />
      ) : null}
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2">{post.category}</span>
        <h5 className="card-title">{post.title}</h5>
        <small className="text-muted">{formatDate(post.date)}</small>
        <p className="card-text mt-2">{post.excerpt}</p>
        <div className="mt-auto">
          <Link to={`/blog/${post.id}`} className="btn btn-primary w-100">
            Leer más
          </Link>
        </div>
      </div>
    </div>
  );
}
