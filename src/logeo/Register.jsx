import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../estilos/register.css"; // usamos el CSS corporativo

function Register() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
       const res = await axios.post("http://10.20.0.101:3001/register", { usuario, contrasena });
      setMensaje(res.data.message);

      if (res.data.message === "Usuario registrado correctamente") {
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("❌ Error en frontend:", err);
      setMensaje("Error al registrar usuario");
    }
  };

  return (
    <div className="register-card">
      <h1>Red Link</h1>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Registrar</button>
      </form>
      <p>{mensaje}</p>
      <button onClick={() => navigate("/")}>Volver al login</button>
    </div>
  );
}

export default Register;
