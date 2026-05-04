import { useState } from "react";
import axios from "axios";
import "./productoAgregar.css";

function ProductoAgregar({ onProductoAgregado }) {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    cantidad: "",
    stock_minimo: "",
  });
  const [guardando, setGuardando] = useState(false);

  const usuario_id = localStorage.getItem("usuario_id");

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.cantidad) {
      alert("Por favor completa nombre, precio y cantidad.");
      return;
    }

    try {
      setGuardando(true);
      await axios.post("/productos", {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        cantidad: parseInt(nuevoProducto.cantidad),
        stock_minimo: parseInt(nuevoProducto.stock_minimo),
        usuario_id: parseInt(usuario_id),
      });

      setNuevoProducto({ nombre: "", precio: "", cantidad: "", stock_minimo: "" });
      onProductoAgregado();
    } catch (err) {
      alert("Error al agregar producto: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="form-card">
      <h3>Nuevo Producto</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre del producto</label>
          <input type="text" name="nombre" value={nuevoProducto.nombre} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Precio unitario ($)</label>
          <input type="number" name="precio" value={nuevoProducto.precio} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Stock inicial</label>
          <input type="number" name="cantidad" value={nuevoProducto.cantidad} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Stock mínimo</label>
          <input type="number" name="stock_minimo" value={nuevoProducto.stock_minimo} onChange={handleChange} />
        </div>
      </div>
      <div className="form-actions">
        <button
          className="btn-cancelar"
          onClick={() => setNuevoProducto({ nombre: "", precio: "", cantidad: "", stock_minimo: "" })}
        >
          Cancelar
        </button>
        <button className="btn-guardar" onClick={agregarProducto} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </div>
  );
}

export default ProductoAgregar;
