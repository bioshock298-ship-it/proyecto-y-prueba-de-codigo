import { useEffect, useState } from "react";
import axios from "axios";
import ClienteAgregar from "./ClienteAgregar";
import "./clientes.css";

function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await axios.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      setError("Error al cargar clientes. Verifica que el servidor esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarCliente = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await axios.delete(`/clientes/${id}`);
      mostrarExito("Cliente eliminado correctamente");
      cargarClientes();
    } catch (err) {
      alert("Error al eliminar cliente");
    }
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`/clientes/${editando.id}`, editando);
      setEditando(null);
      mostrarExito("Cliente actualizado correctamente");
      cargarClientes();
    } catch (err) {
      alert("Error al actualizar cliente");
    }
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  if (cargando) return (
    <div className="clientes-container">
      <h2>Gestión de Clientes</h2>
      <div className="loading">Cargando clientes...</div>
    </div>
  );

  if (error) return (
    <div className="clientes-container">
      <h2>Gestión de Clientes</h2>
      <div className="error-message">
        <p>{error}</p>
        <button onClick={cargarClientes}>Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="clientes-container">
      <h2>Gestión de Clientes</h2>

      {mensajeExito && <div className="success-message">{mensajeExito}</div>}

      <ClienteAgregar onClienteAgregado={() => { cargarClientes(); mostrarExito("Cliente agregado correctamente"); }} />

      <div className="clientes-header">
        <span className="total">Total: {clientes.length} clientes</span>
      </div>

      {clientes.length === 0 ? (
        <div className="no-data"><p>No hay clientes registrados.</p></div>
      ) : (
        <div className="tabla-wrapper">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) =>
                editando?.id === c.id ? (
                  <tr key={c.id} className="fila-editando">
                    <td>{c.id}</td>
                    <td>
                      <input
                        value={editando.nombre}
                        onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editando.apellido}
                        onChange={(e) => setEditando({ ...editando, apellido: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editando.email}
                        onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={editando.telefono || ""}
                        onChange={(e) => setEditando({ ...editando, telefono: e.target.value })}
                      />
                    </td>
                    <td className="acciones">
                      <button className="btn-guardar-edit" onClick={guardarEdicion}>✓ Guardar</button>
                      <button className="btn-cancelar-edit" onClick={() => setEditando(null)}>✕ Cancelar</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.apellido}</td>
                    <td>{c.email}</td>
                    <td>{c.telefono || "-"}</td>
                    <td className="acciones">
                      <button className="btn-editar" onClick={() => setEditando({ ...c })}>✏️ Editar</button>
                      <button className="btn-eliminar" onClick={() => eliminarCliente(c.id)}>🗑️ Eliminar</button>
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

export default ClienteList;