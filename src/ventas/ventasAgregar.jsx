import { useState } from "react";
import axios from "axios";
import "./ventas.css";

function VentasAgregar({ onVentaAgregada, productoSeleccionado, clienteSeleccionado }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [guardando, setGuardando] = useState(false);

  const agregarVenta = async () => {
    if (!clienteSeleccionado?.id || !productoSeleccionado?.id || !cantidad) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      setGuardando(true);

      const usuario_id = localStorage.getItem("usuario_id"); // id del login
      const precio_unitario = productoSeleccionado.precio;   // precio real del producto
      const total = parseInt(cantidad) * precio_unitario;

      await axios.post("/ventas", {
        cliente_id: clienteSeleccionado.id,
        producto_id: productoSeleccionado.id,
        cantidad: parseInt(cantidad),
        usuario_id: parseInt(usuario_id),
        precio_unitario,
        total,
      });

      setCantidad("");
      setMostrarForm(false);
      onVentaAgregada(); // refresca historial
    } catch (err) {
      alert("Error al agregar venta: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <button className="btn-agregar" onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? "✕ Cancelar" : "+ Agregar Venta"}
      </button>

      {mostrarForm && (
        <div className="form-agregar">
          <h3>Nueva Venta</h3>
          <p>Producto: {productoSeleccionado?.nombre} — ${productoSeleccionado?.precio}</p>
          <p>Cliente: {clienteSeleccionado?.nombre}</p>

          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />

          <p>Total calculado: ${cantidad ? (cantidad * productoSeleccionado.precio).toFixed(2) : 0}</p>

          <button className="btn-guardar" onClick={agregarVenta} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar Venta"}
          </button>
        </div>
      )}
    </div>
  );
}

export default VentasAgregar;
