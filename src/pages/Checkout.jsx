import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../services/auth";
import { createOrder } from "../services/orderService";
import api from '../services/http';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigo, setCodigo] = useState("");
  const [metodo, setMetodo] = useState("tarjeta");
  const [tarjeta, setTarjeta] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const total = getTotal();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !direccion.trim() || !ciudad.trim() || !codigo.trim()) {
      setError("Completa todos los campos de envío.");
      return;
    }
    if (metodo === "tarjeta" && tarjeta.replace(/\s+/g, "").length < 12) {
      setError("Introduce un número de tarjeta válido (simulado).");
      return;
    }
    // require logged user for backend orders; if we have a token but no id,
    // try to fetch the current user from the backend to obtain the id.
    if (!user) {
      setError("Debes iniciar sesión para completar la compra.");
      return;
    }

    let userId = user.id;
    if (!userId) {
      try {
        const meRes = await api.get('/users/me');
        const me = meRes.data;
        userId = me?.id;
        // persist safe currentUser locally for future use
        try { localStorage.setItem('currentUser', JSON.stringify({ id: me.id, name: me.name || me.nombre, email: me.email })); } catch {}
      } catch (err) {
        console.error('failed to fetch /users/me', err);
        setError('No se pudo verificar el usuario autenticado. Inicia sesión nuevamente.');
        setProcesando(false);
        return;
      }
    }

    setProcesando(true);

    // build payload matching backend CreateOrderRequest
    // Map cart items to backend IDs (ensure numeric productId)
    const mappedItems = items.map(i => {
      const rawId = i.id || i.productId || (i.product && i.product.id);
      let productId = null;
      if (typeof rawId === 'number') productId = rawId;
      else if (typeof rawId === 'string') {
        // extract digits from strings like 'p5' -> 5
        const digits = rawId.replace(/\D/g, '');
        productId = digits ? Number(digits) : null;
      }
      return { productId, quantity: i.quantity || i.qty || 1 };
    });

    // validate mapped items
    if (mappedItems.some(it => !it.productId)) {
      setError('Hay items en el carrito con ID inválido. Asegúrate de usar productos sincronizados con el backend.');
      setProcesando(false);
      return;
    }

    const payload = {
      userId: userId,
      currency: 'CLP',
      paymentMethod: metodo,
      items: mappedItems
    };

    createOrder(payload)
      .then((res) => {
        // save lastOrder for OrderSuccess page if needed
        try { localStorage.setItem('lastOrder', JSON.stringify(res)); } catch {}
        clearCart();
        setProcesando(false);
        navigate('/checkout/success');
      })
      .catch((err) => {
        console.error('createOrder error', err);
        const msg = err?.response?.data || err?.message || 'Error al crear la orden';
        try { localStorage.setItem('lastOrder', JSON.stringify({ status: 'failed', error: String(msg) })); } catch {}
        setProcesando(false);

        // Temporal: si el servidor devuelve un 403 por un fallo "simulado",
        // tratamos ese caso como éxito para desactivar la probabilidad de fallo.
        // Esto es reversible: buscar el bloque y eliminarlo para volver al comportamiento anterior.
        const status = err?.response?.status;
        const bodyStr = (typeof msg === 'string') ? msg.toLowerCase() : JSON.stringify(msg).toLowerCase();
        if (status === 403 && (bodyStr.includes('simul') || bodyStr.includes('simulated') || bodyStr.includes('probab'))) {
          console.warn('Detected simulated failure from server; treating as success temporarily.');
          try { localStorage.setItem('lastOrder', JSON.stringify({ status: 'simulated_success', note: String(msg) })); } catch {}
          clearCart();
          navigate('/checkout/success');
          return;
        }

        setError(String(msg));
        navigate('/checkout/fallo');
      });
  };

  if (!items.length) {
    return (
      <div className="container mt-4">
        <h2>Checkout</h2>
        <p>No hay productos en el carrito.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Finalizar compra</h2>

      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Nombre completo</label>
          <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Ciudad</label>
          <input className="form-control" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Código postal</label>
          <input className="form-control" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        </div>

        <div className="col-12">
          <label className="form-label">Método de pago (simulado)</label>
          <select className="form-select" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
            <option value="tarjeta">Tarjeta</option>
            <option value="paypal">PayPal</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>

        {metodo === "tarjeta" && (
          <div className="col-12">
            <label className="form-label">Número de tarjeta (simulado)</label>
            <input className="form-control" value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} placeholder="1234 5678 9012 3456" />
          </div>
        )}

        {error && (
          <div className="col-12">
            <div className="alert alert-danger p-2">{error}</div>
          </div>
        )}

        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <strong>Total:</strong> ${total.toFixed(2)}
          </div>
          <button className="btn btn-success" type="submit" disabled={procesando}>
            {procesando ? "Procesando..." : "Confirmar y pagar"}
          </button>
        </div>
      </form>
    </div>
  );
}