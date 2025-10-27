import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleDelete = (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}" (id: ${id})? Esta acción puede deshacerla borrando products_list en LocalStorage.`)) {
      return;
    }
    deleteProduct(id);
    setProducts(getProducts());
  };

  return (
    <div className="container mt-4">
      <h2>Administrar productos</h2>

      {products.length === 0 ? (
        <p>No hay productos.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th style={{ width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  
                  <td>{p.nombre}</td>
                  <td>${Number(p.precio).toFixed(2)}</td>
                  <td>{p.categoria}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/catalogo/${p.id}`)}>
                        Ver
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id, p.nombre)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <button className="btn btn-secondary me-2" onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
        <button className="btn btn-primary" onClick={() => navigate("/admin/agregar-producto")}>Agregar producto</button>
      </div>
    </div>
  );
}