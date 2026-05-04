import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./logeo/Login";
import Register from "./logeo/Register";
import Panel from "./logeo/Panel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  );
}

export default App;
