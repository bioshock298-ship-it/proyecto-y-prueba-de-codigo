import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../estilos/login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usuario || !contrasena) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }

    try {
      const res = await axios.post("http://10.20.0.101:3001/login", { usuario, contrasena });
      setMensaje(res.data.message);

      if (res.data.message === "Login correcto") {
        localStorage.setItem("usuario", res.data.usuario); // nombre
        localStorage.setItem("usuario_id", res.data.id);   // id numérico
        navigate("/panel");
      } else {
        setMensaje("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="login-card">
      <h1>Red Link</h1>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
      <p>{mensaje}</p>
      <button onClick={() => navigate("/register")}>Registrar nueva cuenta</button>
    </div>
  );
}

export default Login;