import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/panel.css";
import ClienteList from "../Clientes/ClienteList";
import ProductoList from "../Productos/ProductoList";
import VentasList from "../ventas/ventasList";

function Panel() {
  const [usuario, setUsuario] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [seccion, setSeccion] = useState("inicio");
  const navigate = useNavigate();

  useEffect(() => {
    const nombreUsuario = localStorage.getItem("usuario");
    if (!nombreUsuario) {
      navigate("/"); // si no hay sesión, manda al login
      return;
    }
    setUsuario(nombreUsuario);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario_id"); // ← limpiar también el id
    navigate("/");
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h2>Sistema de Inventariado Red Link</h2>
        <div className="perfil" onClick={() => setMenuVisible(!menuVisible)}>
          <span>👤 {usuario}</span>
          {menuVisible && (
            <div className="perfil-menu">
              <ul>
                <li>⚙️ Ajustes</li>
                <li onClick={handleLogout}>🚪 Cerrar sesión</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="panel-body">
        <aside className="panel-sidebar">
          <h3>Menú</h3>
          <ul>
            <li onClick={() => setSeccion("productos")}>📦 Productos</li>
            <li onClick={() => setSeccion("ventas")}>🛒 Ventas</li>
            <li onClick={() => setSeccion("clientes")}>👥 Clientes</li>
            <li onClick={() => setSeccion("reportes")}>📊 Reportes</li>
          </ul>
        </aside>

        <main className="panel-main">
          {seccion === "inicio" && (
            <>
              <h3>Bienvenido al Panel 🎉</h3>
              <p>Aquí podrás visualizar estadísticas de tu sistema de ventas.</p>
            </>
          )}

          {seccion === "productos" && <ProductoList />}

          {seccion === "ventas" && <VentasList />}

          {seccion === "clientes" && <ClienteList />}

          {seccion === "reportes" && (
            <>
              <h3>Reportes 📊</h3>
              <p>Aquí se mostrarán los reportes.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Panel;