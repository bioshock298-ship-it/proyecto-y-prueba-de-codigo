import { useEffect, useState } from "react";
import axios from "axios";
import "./productos.css";
import ProductoAgregar from "./ProductoAgregar";

function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await axios.get("/productos"); // ✅ CORRECCIÓN: línea descomentada
      setProductos(res.data);
    } catch (err) {
      setError(`Error: ${err.message}. Verifica que el servidor esté corriendo en http://localhost:3001`);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await axios.delete(`/productos/${id}`);
      mostrarExito("Producto eliminado correctamente");
      cargarProductos();
    } catch (err) {
      alert("Error al eliminar producto");
    }
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`/productos/${editando.id}`, {
        nombre: editando.nombre,
        precio: editando.precio,
        cantidad: editando.cantidad,
        stock_minimo: editando.stock_minimo,
      });
      setEditando(null);
      mostrarExito("Producto actualizado correctamente");
      cargarProductos();
    } catch (err) {
      alert("Error al actualizar producto");
    }
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  if (cargando) return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>
      <div className="loading">Cargando productos...</div>
    </div>
  );

  if (error) return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>
      <div className="error-message">
        <p>{error}</p>
        <button onClick={cargarProductos} className="retry-btn">Reintentar</button>
      </div>
    </div>
  );

  // 🔎 Alerta de stock bajo
  const productosBajoStock = productos.filter(p => p.cantidad < p.stock_minimo);

  return (
    <div className="productos-container">
      <h2>Gestión de Productos</h2>

      {mensajeExito && <div className="success-message">{mensajeExito}</div>}

      {productosBajoStock.length > 0 && (
        <div className="alert-stock">
          ⚠️ {productosBajoStock.length} productos con stock bajo — revisar reabastecimiento
        </div>
      )}

      <ProductoAgregar onProductoAgregado={() => { cargarProductos(); mostrarExito("Producto agregado correctamente"); }} />

      <div className="productos-header">
        <span className="total">Total: {productos.length} productos</span>
      </div>

      {productos.length === 0 ? (
        <div className="no-products"><p>No hay productos disponibles.</p></div>
      ) : (
        <div className="tabla-wrapper">
          <table className="productos-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Stock mínimo</th>
                <th>Creado por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) =>
                editando?.id === prod.id ? (
                  <tr key={prod.id} className="fila-editando">
                    <td>{prod.id}</td>
                    <td>
                      <input
                        value={editando.nombre}
                        onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editando.precio}
                        onChange={(e) => setEditando({ ...editando, precio: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editando.cantidad}
                        onChange={(e) => setEditando({ ...editando, cantidad: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editando.stock_minimo}
                        onChange={(e) => setEditando({ ...editando, stock_minimo: e.target.value })}
                      />
                    </td>
                    <td>{prod.usuario}</td>
                    <td className="acciones">
                      <button className="btn-guardar-edit" onClick={guardarEdicion}>✓ Guardar</button>
                      <button className="btn-cancelar-edit" onClick={() => setEditando(null)}>✕ Cancelar</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.nombre}</td>
                    <td>${Number(prod.precio).toFixed(2)}</td>
                    <td>{prod.cantidad}</td>
                    <td>{prod.stock_minimo}</td>
                    <td>{prod.usuario}</td>
                    <td className="acciones">
                      <button className="btn-editar" onClick={() => setEditando({ ...prod })}>✏️ Editar</button>
                      <button className="btn-eliminar" onClick={() => eliminarProducto(prod.id)}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductoList;