import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = ['Administrador', 'Encargado de almacen', 'Vendedor'];

function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: '',
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombres.trim() || !form.email.trim() || !form.password) {
      setError('Nombres, correo y contrasena son obligatorios.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.');
      return;
    }
    if (!aceptaTerminos) {
      setError('Debe aceptar los terminos y condiciones.');
      return;
    }

    setSubmitting(true);
    const result = await register({
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      documento: form.documento.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      password: form.password,
      rol: form.rol || 'Vendedor',
    });
    setSubmitting(false);

    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.message || 'No se pudo completar el registro.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <main className="container py-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100 mx-auto" style={{ maxWidth: '1080px' }}>
          <div className="row g-0">
            <div className="col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-center text-white text-center text-lg-start bg-dark">
              <div className="mb-4">
                <i className="bi bi-person-plus fs-1 text-danger"></i>
              </div>
              <h1 className="h2 fw-bold mb-3">Registro de usuario</h1>
              <p className="mb-4">
                Complete sus datos basicos para crear una cuenta dentro del sistema de inventario.
              </p>
              <div className="small">
                <p className="mb-2">Datos solicitados:</p>
                <p className="mb-2">Nombre completo</p>
                <p className="mb-2">Documento y telefono</p>
                <p className="mb-2">Correo y contrasena</p>
                <p className="mb-0">Rol del usuario</p>
              </div>
            </div>

            <div className="col-lg-7 p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="h3 fw-bold mb-1">Crear cuenta</h2>
                  <p className="text-muted mb-0">Ingrese sus datos personales y seleccione su rol.</p>
                </div>
                <Link to="/login" className="btn btn-outline-secondary">Volver</Link>
              </div>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombres</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Juan"
                      value={form.nombres}
                      onChange={handleChange('nombres')}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellidos</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Perez Soto"
                      value={form.apellidos}
                      onChange={handleChange('apellidos')}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Documento</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="DNI o CI"
                      value={form.documento}
                      onChange={handleChange('documento')}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Telefono</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="987654321"
                      value={form.telefono}
                      onChange={handleChange('telefono')}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Correo electronico</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="usuario@inventario.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contrasena</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Cree una contrasena"
                      value={form.password}
                      onChange={handleChange('password')}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirmar contrasena</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Repita la contrasena"
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Rol</label>
                    <select className="form-select form-select-lg" value={form.rol} onChange={handleChange('rol')}>
                      <option value="">Seleccione un rol</option>
                      {ROLES.map((rol) => (
                        <option key={rol} value={rol}>{rol}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-check mt-4 mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    Acepto los terminos y condiciones del sistema.
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-danger btn-lg" disabled={submitting}>
                    {submitting ? 'Creando cuenta...' : 'Registrarme'}
                  </button>
                  <Link to="/login" className="btn btn-outline-dark btn-lg">Ya tengo una cuenta</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registro;
