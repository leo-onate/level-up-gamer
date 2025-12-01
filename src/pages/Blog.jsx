import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { fetchBlogs, fetchBlogCategories } from "../services/blogsService";

export default function Blog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["Todas"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [blogsData, categoriesData] = await Promise.all([
          fetchBlogs(),
          fetchBlogCategories()
        ]);
        setBlogs(blogsData);
        setCategories(["Todas", ...categoriesData]);
      } catch (err) {
        console.error('Error loading blogs:', err);
        setError('Error al cargar los blogs');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = blogs.filter(p => {
    const matchesCat = cat === "Todas" || p.category === cat;
    const qlc = q.trim().toLowerCase();
    const matchesQ = !qlc ||
      p.title.toLowerCase().includes(qlc) ||
      p.excerpt.toLowerCase().includes(qlc);
    return matchesCat && matchesQ;
  });

  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-3">Blog</h2>

      {/* filtros simples */}
      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <input
          className="form-control blog-search"
          placeholder="Buscar (título o resumen)..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="form-select w-auto" value={cat} onChange={(e)=>setCat(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* lista */}
      <div className="row g-3">
        {filtered.map(p => (
          <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
            <BlogCard post={p} />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted">No se encontraron artículos.</p>
        )}
      </div>
    </div>
  );
}
