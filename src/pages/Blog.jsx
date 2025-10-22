import { useMemo, useState } from "react";
import BlogCard from "../components/BlogCard";
import { blogPosts } from "../data/blogs";

export default function Blog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");

  const categories = useMemo(() => {
    const set = new Set(blogPosts.map(p => p.category));
    return ["Todas", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return blogPosts.filter(p => {
      const matchesCat = cat === "Todas" || p.category === cat;
      const qlc = q.trim().toLowerCase();
      const matchesQ = !qlc ||
        p.title.toLowerCase().includes(qlc) ||
        p.excerpt.toLowerCase().includes(qlc);
      return matchesCat && matchesQ;
    });
  }, [q, cat]);

  return (
    <div className="container my-4">
      <h2 className="mb-3">Blog</h2>

      {/* filtros simples */}
      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <input
          className="form-control"
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
