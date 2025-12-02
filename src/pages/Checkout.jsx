import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../services/auth";
import { createOrderInBackend, updateOrderStatus } from "../services/orderService";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [nombre, setNombre] = useState(user?.name || "");
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
    
    if (!user || !user.id) {
      setError("Debes iniciar sesión para realizar una compra.");
      return;
    }

    setProcesando(true);

    // Preparar datos para el backend
    const orderData = {
      userId: user.id,
      customerName: nombre,
      customerEmail: user.email || user.correo,
      deliveryAddress: `${direccion}, ${ciudad}, ${codigo}`,
      paymentMethod: metodo,
      status: "PENDIENTE",
      items: items.map(item => ({
        product: { id: item.id },
        quantity: item.qty,
        unitPrice: item.precio || item.price,
        subtotal: (item.precio || item.price) * item.qty
      }))
    };

    try {
      // Enviar al backend (valida y descuenta stock)
      const createdOrder = await createOrderInBackend(orderData);
      
      // Simular procesamiento de pago (random)
      await new Promise(resolve => setTimeout(resolve, 1200));
      const rnd = Math.floor(Math.random() * 3) + 1;
      
      if (rnd === 3) {
        // Simular pago rechazado - cancelar orden y restaurar stock
        try {
          await updateOrderStatus(createdOrder.id, "CANCELADO");
        } catch (cancelErr) {
          console.error('Error al cancelar orden:', cancelErr);
        }
        
        const failedOrder = {
          id: `order_${createdOrder.id}`,
          number: createdOrder.id,
          displayId: `Orden N°${createdOrder.id}`,
          createdAt: Date.now(),
          customer: { nombre, direccion, ciudad, codigo, metodo },
          items,
          total,
          userEmail: user.email || user.correo,
          status: "failed",
          error: "Pago rechazado por el procesador (simulado).",
          backendId: createdOrder.id
        };
        
        try {
          localStorage.setItem("lastOrder", JSON.stringify(failedOrder));
        } catch {}
        
        setProcesando(false);
        navigate("/checkout/fallo");
        return;
      }
      
      // Pago exitoso
      const localOrder = {
        id: `order_${createdOrder.id}`,
        number: createdOrder.id,
        displayId: `Orden N°${createdOrder.id}`,
        createdAt: Date.now(),
        customer: { nombre, direccion, ciudad, codigo, metodo },
        items,
        total,
        userEmail: user.email || user.correo,
        status: "success",
        backendId: createdOrder.id
      };
      
      try {
        localStorage.setItem("lastOrder", JSON.stringify(localOrder));
      } catch {}
      
      clearCart();
      setProcesando(false);
      navigate("/checkout/success");
      
    } catch (err) {
      console.error('Error al crear orden:', err);
      setProcesando(false);
      
      // Verificar si es error de stock
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al procesar la orden. Intenta nuevamente.");
      }
    }
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