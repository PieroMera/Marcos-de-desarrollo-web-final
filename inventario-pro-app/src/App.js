import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Movimientos from './pages/Movimientos';
import Stock from './pages/Stock';
import Alertas from './pages/Alertas';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Registro from './pages/Registro';
import { ROLES_GESTION_PRODUCTOS } from './constants/roles';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route element={<RoleRoute roles={ROLES_GESTION_PRODUCTOS} />}>
                <Route path="/productos" element={<Productos />} />
              </Route>
              <Route path="/movimientos" element={<Movimientos />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/alertas" element={<Alertas />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
