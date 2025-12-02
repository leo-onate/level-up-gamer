import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProductById, getProducts as getLocalProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  // Solo admin (tipo 2) puede eliminar productos
  const canDelete = currentUser && currentUser.tipo === 2;

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.items || [];
        setProducts(list);
      })
      .catch(() => {
        // fallback to local storage
        setProducts(getLocalProducts());
      });
    return () => { mounted = false; };
  }, []);

  const handleDelete = (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}" (id: ${id})? Esta acción puede deshacerla borrando products_list en LocalStorage.`)) {
      return;
    }
    // attempt backend delete, fallback to local delete behavior
    deleteProductById(id).then(() => {
      // refetch list
      fetchProducts().then((d) => setProducts(Array.isArray(d) ? d : d.items || [])).catch(() => setProducts(getLocalProducts()));
    }).catch(() => {
      // if backend delete fails, try local storage delete (legacy)
      // local delete: read list, filter out id and save
      const list = getLocalProducts().filter(p => String(p.id) !== String(id));
      localStorage.setItem('products_list', JSON.stringify(list));
      setProducts(list);
    });
  };

  return (
    <div className="container mt-4">
      <div className="dark-container">
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
                      <button className="btn btn-sm btn-view" onClick={() => navigate(`/catalogo/${p.id}`)}>
                        Ver
                      </button>
                      {canDelete && (
                        <button className="btn btn-sm btn-delete" onClick={() => handleDelete(p.id, p.nombre)}>
                          Eliminar
                        </button>
                      )}
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
    </div>
  );
}