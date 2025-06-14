import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import RedirectAfterLogin from "./pages/RedirectAfterLogin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/redirect" element={<RedirectAfterLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
