import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/productService";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    imagen: "", 
    precio: "",
    descripcion: "",
    oferta: false,
    categoria: "",
  });
  const [error, setError] = useState("");

  const handleChange = (k) => (e) => {
    const val = k === "oferta" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: val }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre.trim()) return setError("Nombre requerido.");
    if (form.precio === "" || isNaN(Number(form.precio))) return setError("Precio válido requerido.");

    // addProduct devuelve el producto creado incluyendo su id
    const nuevo = addProduct({
      nombre: form.nombre.trim(),
      imagen: form.imagen.trim(),
      precio: Number(form.precio),
      descripcion: form.descripcion.trim(),
      oferta: !!form.oferta,
      categoria: form.categoria.trim(),
    });

    // navegar al detalle del producto creado para ver el ID (no editable)
    if (nuevo && nuevo.id) {
      navigate(`/catalogo/${nuevo.id}`);
      return;
    }

    // fallback
    navigate("/catalogo");
  };

  return (
    <div className="container mt-4">
      <h2>Agregar producto</h2>
      <form onSubmit={onSubmit} className="row g-3" style={{ maxWidth: 800 }}>
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={handleChange("nombre")} />
        </div>

        <div className="col-12">
          <label className="form-label">Imagen (nombre de archivo en assets o URL)</label>
          <input className="form-control" value={form.imagen} onChange={handleChange("imagen")} placeholder="ej: teclado-z.jpg o /assets/img/teclado-z.jpg" />
        </div>

        <div className="col-md-4">
          <label className="form-label">Precio</label>
          <input className="form-control" value={form.precio} onChange={handleChange("precio")} />
        </div>

        <div className="col-md-8">
          <label className="form-label">Categoría</label>
          <input className="form-control" value={form.categoria} onChange={handleChange("categoria")} />
        </div>

        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" value={form.descripcion} onChange={handleChange("descripcion")} />
        </div>

        <div className="col-auto d-flex align-items-center">
          <input id="oferta" type="checkbox" checked={form.oferta} onChange={handleChange("oferta")} />
          <label htmlFor="oferta" className="ms-2">En oferta</label>
        </div>

        {error && <div className="col-12"><div className="alert alert-danger p-2">{error}</div></div>}

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-success" type="submit">Crear producto</button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}