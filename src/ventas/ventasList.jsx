import { useEffect, useState } from "react";
import axios from "axios";
import "./ventas.css";

function VentasList() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const usuario_id = localStorage.getItem("usuario_id");

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente_id: "",
    producto_id: "",
    cantidad: "",
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      setCargando(true);
      const [ventasRes, productosRes, clientesRes] = await Promise.all([
        axios.get("/ventas"),
        axios.get("/productos"),
        axios.get("/clientes"),
      ]);
      setVentas(Array.isArray(ventasRes.data) ? ventasRes.data : []);
      setProductos(Array.isArray(productosRes.data) ? productosRes.data : []);
      setClientes(Array.isArray(clientesRes.data) ? clientesRes.data : []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setCargando(false);
    }
  };

  const productoSeleccionado = productos.find(p => p.id === parseInt(nuevaVenta.producto_id));
  const totalCalculado = productoSeleccionado && nuevaVenta.cantidad
    ? (parseFloat(productoSeleccionado.precio) * parseInt(nuevaVenta.cantidad)).toFixed(2)
    : null;

  const agregarVenta = async () => {
    if (!nuevaVenta.cliente_id || !nuevaVenta.producto_id || !nuevaVenta.cantidad) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }
    try {
      setGuardando(true);
      setErrorMsg("");

      const producto = productos.find(p => p.id === parseInt(nuevaVenta.producto_id));
      if (!producto) {
        setErrorMsg("Producto no encontrado.");
        return;
      }

      const precio_unitario = parseFloat(producto.precio);
      const total = parseInt(nuevaVenta.cantidad) * precio_unitario;

      await axios.post("/ventas", {
        cliente_id: parseInt(nuevaVenta.cliente_id),
        producto_id: parseInt(nuevaVenta.producto_id),
        cantidad: parseInt(nuevaVenta.cantidad),
        usuario_id: parseInt(usuario_id),
        precio_unitario,
        total,
      });

      setNuevaVenta({ cliente_id: "", producto_id: "", cantidad: "" });
      mostrarExito("Venta registrada correctamente");
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg("Error: " + msg);
    } finally {
      setGuardando(false);
    }
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const ventasFiltradas = ventas.filter(v =>
    v.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.producto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.vendedor?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="ventas-container">
      <div className="ventas-header">
        <h2>Gestión de Ventas</h2>
        <p className="ventas-subtitle">{ventas.length} ventas registradas</p>
      </div>

      {mensajeExito && <div className="success-message">{mensajeExito}</div>}

      {/* 🔥 Formulario SIEMPRE visible */}
      <div className="form-card-ventas">
        <h3>Registrar nueva venta</h3>
        <div className="form-ventas-grid">
          <div className="form-group-ventas">
            <label>PRODUCTO</label>
            <select
              value={nuevaVenta.producto_id}
              onChange={(e) => setNuevaVenta({ ...nuevaVenta, producto_id: e.target.value })}
            >
              <option value="">Seleccionar producto...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — ${parseFloat(p.precio).toFixed(2)} (stock: {p.cantidad})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-ventas">
            <label>CLIENTE</label>
            <select
              value={nuevaVenta.cliente_id}
              onChange={(e) => setNuevaVenta({ ...nuevaVenta, cliente_id: e.target.value })}
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-ventas">
            <label>CANTIDAD</label>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={nuevaVenta.cantidad}
              onChange={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })}
            />
          </div>

          <div className="form-group-ventas">
            <label>TOTAL CALCULADO</label>
            <div className="total-calculado">
              {totalCalculado ? `$${totalCalculado}` : "$0.00"}
            </div>
          </div>
        </div>

        {errorMsg && <div className="error-inline">{errorMsg}</div>}

        <div className="form-ventas-actions">
          <button className="btn-registrar-venta" onClick={agregarVenta} disabled={guardando}>
            {guardando ? "Guardando..." : "Registrar venta"}
          </button>
        </div>
      </div>

      {/* Historial de ventas */}
      <h3>Historial de ventas</h3>
      <p className="total-ventas">Total: {ventasFiltradas.length} venta{ventasFiltradas.length !== 1 ? "s" : ""}</p>

      {cargando ? (
        <p className="cargando-text">Cargando ventas...</p>
      ) : ventasFiltradas.length === 0 ? (
        <p className="sin-ventas">No hay ventas registradas aún.</p>
      ) : (
        <div className="tabla-wrapper-ventas">
          <table className="tabla-ventas">
            <thead>
              <tr>
                <th>ID</th>
                <th>PRODUCTO</th>
                <th>CLIENTE</th>
                <th>VENDEDOR</th>
                <th>CANT.</th>
                <th>P. UNIT.</th>
                <th>TOTAL</th>
                <th>FECHA</th>
              </tr>
            </thead>
        <tbody>
  {ventasFiltradas.map((v) => (
    <tr key={v.id}>
      <td>{v.id}</td>
      <td>{v.producto}</td>
      <td>{v.cliente}</td>
      <td>{v.vendedor}</td>   
      <td>{v.cantidad}</td>
      <td>${parseFloat(v.precio_unitario).toFixed(2)}</td>
      <td><strong>${parseFloat(v.total).toFixed(2)}</strong></td>
      <td>{new Date(v.fecha).toLocaleDateString("es-SV")}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default VentasList;
