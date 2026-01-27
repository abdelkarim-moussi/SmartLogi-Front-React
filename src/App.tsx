import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>welcome to smartlogi</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
