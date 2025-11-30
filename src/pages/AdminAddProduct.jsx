import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
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

    (async () => {
      try {
        const payload = {
          name: form.nombre.trim(),
          image: "Starmie.jpg",
          price: Number(form.precio),
          description: form.descripcion.trim(),
          oferta: !!form.oferta,
          category: form.categoria.trim(),
          stock: 0,
        };
        const nuevo = await createProduct(payload);
        if (nuevo && (nuevo.id || nuevo._id)) {
          const id = nuevo.id || nuevo._id;
          navigate(`/catalogo/${id}`);
          return;
        }
        navigate("/catalogo");
      } catch (err) {
        console.error('Crear producto error', err);
        setError('No se pudo crear el producto.');
      }
    })();
  };

  return (
    <div className="container mt-4">
      <h2>Agregar producto</h2>
      <form onSubmit={onSubmit} className="row g-3" style={{ maxWidth: 800 }}>
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={handleChange("nombre")} />
        </div>

        {/* Eliminado el campo de imagen: se usa 'Starmie.jpg' por defecto */}

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