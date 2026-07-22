import React, { useEffect, useState } from 'react';
import { movimientosApi, productosApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ROL_VENDEDOR } from '../constants/roles';

const FORM_VACIO = { productoId: '', tipo: '', cantidad: '' };

function Movimientos() {
  const { user } = useAuth();
  const esVendedor = user?.rol === ROL_VENDEDOR;
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState(() => (esVendedor ? { ...FORM_VACIO, tipo: 'Salida' } : FORM_VACIO));
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ productos: listaProductos }, { movimientos: listaMovimientos }] = await Promise.all([
        productosApi.list(),
        movimientosApi.list(20),
      ]);
      setProductos(listaProductos);
      setMovimientos(listaMovimientos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!form.productoId || !form.tipo || !form.cantidad) {
      setError('Complete todos los campos del movimiento.');
      return;
    }

    setGuardando(true);
    try {
      await movimientosApi.create({
        productoId: Number(form.productoId),
        tipo: form.tipo,
        cantidad: Number(form.cantidad),
      });
      setMensaje('Movimiento registrado correctamente.');
      setForm(esVendedor ? { ...FORM_VACIO, tipo: 'Salida' } : FORM_VACIO);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestion de Movimientos</h1>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title">Registrar movimiento</h5>
              <p className="text-muted small mb-3">
                Se registrara como responsable: <strong>{user?.nombre}</strong>
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Producto</label>
                  <select className="form-select" value={form.productoId} onChange={handleChange('productoId')} required>
                    <option value="">Seleccionar producto</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo de movimiento</label>
                  <select
                    className="form-select"
                    value={form.tipo}
                    onChange={handleChange('tipo')}
                    disabled={esVendedor}
                    required
                  >
                    {!esVendedor && <option value="">Seleccionar</option>}
                    {!esVendedor && <option value="Entrada">Entrada</option>}
                    <option value="Salida">Salida</option>
                  </select>
                  {esVendedor && (
                    <div className="form-text">Como vendedor solo puedes registrar salidas de stock.</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="15"
                    value={form.cantidad}
                    onChange={handleChange('cantidad')}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-danger w-100 shadow-sm" disabled={guardando}>
                  {guardando ? 'Registrando...' : 'Registrar movimiento'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Historial de movimientos</h5>
              {loading ? (
                <p className="text-muted mb-0">Cargando historial...</p>
              ) : movimientos.length === 0 ? (
                <p className="text-muted mb-0">Aun no se han registrado movimientos.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {movimientos.map((m) => (
                    <div key={m.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">
                          {m.tipo === 'Entrada' ? 'Entrada' : 'Salida'} de {m.productoNombre}
                        </h6>
                        <small className="text-muted">Responsable: {m.responsableNombre}</small>
                      </div>
                      <span className={`badge shadow-sm ${m.tipo === 'Entrada' ? 'bg-success' : 'bg-danger'}`}>
                        {m.tipo === 'Entrada' ? '+' : '-'}{m.cantidad}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Movimientos;
