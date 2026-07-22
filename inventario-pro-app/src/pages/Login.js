import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <main className="container py-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100 mx-auto" style={{ maxWidth: '980px' }}>
          <div className="row g-0">
            <div className="col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-center text-white text-center text-lg-start bg-dark">
              <div className="mb-4">
                <i className="bi bi-box-seam fs-1 text-danger"></i>
              </div>
              <h1 className="h2 fw-bold mb-3">Bienvenido a Inventario Pro</h1>
              <p className="mb-4">
                Interfaz de acceso para el sistema de control de inventarios del negocio comercial.
              </p>
              <p className="mb-0">
                ¿No tienes una cuenta? <Link to="/registro" className="text-danger">Registrate aqui</Link>.
              </p>
            </div>

            <div className="col-lg-7 p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="h3 fw-bold mb-1">Iniciar sesion</h2>
                  <p className="text-muted mb-0">Ingrese sus credenciales para acceder.</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo o usuario</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="admin@inventario.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contrasena</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Ingrese su contrasena"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberUser" />
                    <label className="form-check-label" htmlFor="rememberUser">
                      Recordarme
                    </label>
                  </div>
                  <Link to="#" className="text-decoration-none">Olvide mi contrasena</Link>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-danger btn-lg" disabled={submitting}>
                    {submitting ? 'Ingresando...' : 'Ingresar'}
                  </button>
                  <Link to="/registro" className="btn btn-outline-danger btn-lg">Crear cuenta</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
