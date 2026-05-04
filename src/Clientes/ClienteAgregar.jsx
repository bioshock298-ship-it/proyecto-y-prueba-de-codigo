import { useState } from "react";
import axios from "axios";
import "./clientes.css";

function ClienteAgregar({ onClienteAgregado }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cliente, setCliente] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const agregarCliente = async () => {
    if (!cliente.nombre || !cliente.apellido || !cliente.email) {
      alert("Nombre, apellido y email son requeridos.");
      return;
    }
    try {
      setGuardando(true);
      await axios.post("/clientes", cliente);
      setCliente({ nombre: "", apellido: "", email: "", telefono: "" });
      setMostrarForm(false);
      onClienteAgregado();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <button className="btn-agregar" onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? "✕ Cancelar" : "+ Agregar Cliente"}
      </button>

      {mostrarForm && (
        <div className="form-agregar">
          <h3>Nuevo Cliente</h3>
          <input type="text" name="nombre" placeholder="Nombre" value={cliente.nombre} onChange={handleChange} />
          <input type="text" name="apellido" placeholder="Apellido" value={cliente.apellido} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={cliente.email} onChange={handleChange} />
          <input type="text" name="telefono" placeholder="Teléfono (opcional)" value={cliente.telefono} onChange={handleChange} />
          <button className="btn-guardar" onClick={agregarCliente} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar Cliente"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ClienteAgregar;