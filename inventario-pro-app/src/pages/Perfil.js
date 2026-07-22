import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, dashboardApi } from '../api/client';

function Perfil() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [nombres, setNombres] = useState(user?.nombres || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [email, setEmail] = useState(user?.email || '');
  const [perfilError, setPerfilError] = useState('');
  const [perfilMensaje, setPerfilMensaje] = useState('');
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMensaje, setPasswordMensaje] = useState('');
  const [guardandoPassword, setGuardandoPassword] = useState(false);

  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    dashboardApi.summary().then(setResumen).catch(() => {});
  }, []);

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    setPerfilError('');
    setPerfilMensaje('');
    setGuardandoPerfil(true);
    try {
      const { user: actualizado } = await authApi.updateProfile({ nombres, apellidos, telefono, email });
      updateUser(actualizado);
      setPerfilMensaje('Datos actualizados correctamente.');
    } catch (err) {
      setPerfilError(err.message);
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMensaje('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contrasenas nuevas no coinciden.');
      return;
    }

    setGuardandoPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPasswordMensaje('Contrasena actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setGuardandoPassword(false);
    }
  };

  const handleCerrarSesiones = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Mi Perfil</h1>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-4">
            <div
              className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle flex-shrink-0"
              style={{ width: '96px', height: '96px' }}
            >
              <i className="bi bi-person-fill fs-1"></i>
            </div>
            <div className="flex-grow-1">
              <h5 className="mb-1">{user?.nombre}</h5>
              <span className="badge bg-danger shadow-sm mb-2">{user?.rol}</span>
              <p className="text-muted mb-0">
                <i className="bi bi-envelope me-2"></i>{user?.email}
              </p>
              <p className="text-muted mb-0">
                <i className="bi bi-telephone me-2"></i>{user?.telefono || 'Sin telefono registrado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card card-stat shadow-sm p-4 border-0 rounded-4">
            <h5>Productos registrados</h5>
            <p className="h3 text-danger">{resumen?.totalProductos ?? '...'}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card card-stat shadow-sm p-4 border-0 rounded-4">
            <h5>Movimientos realizados</h5>
            <p className="h3 text-danger">{resumen?.totalMovimientos ?? '...'}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card card-stat shadow-sm p-4 border-0 rounded-4">
            <h5>Alertas activas</h5>
            <p className="h3 text-danger">{resumen?.alertasActivas ?? '...'}</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Datos personales</h5>

              {perfilError && <div className="alert alert-danger py-2">{perfilError}</div>}
              {perfilMensaje && <div className="alert alert-success py-2">{perfilMensaje}</div>}

              <form onSubmit={handleGuardarPerfil}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombres</label>
                    <input type="text" className="form-control" value={nombres} onChange={(e) => setNombres(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellidos</label>
                    <input type="text" className="form-control" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Correo electronico</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Telefono</label>
                    <input type="tel" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rol</label>
                    <select className="form-select" value={user?.rol || ''} disabled>
                      <option>Administrador</option>
                      <option>Encargado de almacen</option>
                      <option>Vendedor</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-danger w-100 mt-3 shadow-sm" disabled={guardandoPerfil}>
                  {guardandoPerfil ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Seguridad</h5>

              {passwordError && <div className="alert alert-danger py-2">{passwordError}</div>}
              {passwordMensaje && <div className="alert alert-success py-2">{passwordMensaje}</div>}

              <form onSubmit={handleActualizarPassword}>
                <div className="mb-3">
                  <label className="form-label">Contrasena actual</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ingrese su contrasena actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nueva contrasena</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Cree una nueva contrasena"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar nueva contrasena</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repita la nueva contrasena"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100 shadow-sm" disabled={guardandoPassword}>
                  {guardandoPassword ? 'Actualizando...' : 'Actualizar contrasena'}
                </button>
              </form>

              <hr className="my-4" />

              <h6 className="mb-2">Sesion</h6>
              <p className="text-muted small mb-3">
                Sesion iniciada como {user?.email}.
              </p>
              <button type="button" className="btn btn-outline-danger w-100 shadow-sm" onClick={handleCerrarSesiones}>
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Perfil;
