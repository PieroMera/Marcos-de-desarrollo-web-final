import React, { useEffect, useState } from 'react';
import { productosApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ROLES_ELIMINAR_PRODUCTOS } from '../constants/roles';

const CATEGORIAS = ['Accesorios', 'Perifericos', 'Equipos', 'Componentes'];

const FORM_VACIO = { nombre: '', categoria: '', marca: '', stock: '', stockMinimo: '' };
const FILTROS_VACIOS = { search: '', categoria: 'Todas', marca: 'Todas', disponibilidad: 'Todos' };

function Productos() {
  const { user } = useAuth();
  const puedeEliminar = ROLES_ELIMINAR_PRODUCTOS.includes(user?.rol);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState(FORM_VACIO);
  const [editingId, setEditingId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  const cargarProductos = async (filtrosActivos = {}) => {
    setLoading(true);
    setError('');
    try {
      const { productos: lista } = await productosApi.list(filtrosActivos);
      setProductos(lista);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFiltroChange = (field) => (e) => {
    setFiltros((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const iniciarEdicion = (producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      marca: producto.marca,
      stock: String(producto.stock),
      stockMinimo: String(producto.stockMinimo),
    });
    setMensaje('');
    setError('');
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setForm(FORM_VACIO);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }

    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      const payload = {
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        marca: form.marca.trim(),
        stock: Number(form.stock) || 0,
        stockMinimo: Number(form.stockMinimo) || 0,
      };
      if (editingId) {
        await productosApi.update(editingId, payload);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await productosApi.create(payload);
        setMensaje('Producto registrado correctamente.');
      }
      setForm(FORM_VACIO);
      setEditingId(null);
      await cargarProductos(filtros);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;
    setError('');
    setMensaje('');
    try {
      await productosApi.remove(producto.id);
      setMensaje('Producto eliminado correctamente.');
      if (editingId === producto.id) cancelarEdicion();
      await cargarProductos(filtros);
    } catch (err) {
      setError(err.message);
    }
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();
    cargarProductos(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    cargarProductos();
  };

  const badgeEstado = (estado) => {
    if (estado === 'Agotado') return 'bg-danger';
    if (estado === 'Stock bajo') return 'bg-warning text-dark';
    return 'bg-success';
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestion de Productos</h1>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title">{editingId ? 'Editar producto' : 'Registrar producto'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre del producto</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej. Mouse gamer RGB"
                    value={form.nombre}
                    onChange={handleFormChange('nombre')}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoria</label>
                  <select className="form-select" value={form.categoria} onChange={handleFormChange('categoria')}>
                    <option value="">Seleccionar</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej. Logitech"
                    value={form.marca}
                    onChange={handleFormChange('marca')}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Stock inicial</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="50"
                      value={form.stock}
                      onChange={handleFormChange('stock')}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock minimo</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="10"
                      value={form.stockMinimo}
                      onChange={handleFormChange('stockMinimo')}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-danger flex-grow-1 shadow-sm" disabled={guardando}>
                    {guardando ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Guardar producto'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title">Filtros de busqueda</h5>
              <form onSubmit={aplicarFiltros}>
                <div className="mb-3">
                  <label className="form-label">Buscar por nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar producto"
                    value={filtros.search}
                    onChange={handleFiltroChange('search')}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoria</label>
                  <select className="form-select" value={filtros.categoria} onChange={handleFiltroChange('categoria')}>
                    <option value="Todas">Todas</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Todas"
                    value={filtros.marca === 'Todas' ? '' : filtros.marca}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, marca: e.target.value || 'Todas' }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Disponibilidad</label>
                  <select className="form-select" value={filtros.disponibilidad} onChange={handleFiltroChange('disponibilidad')}>
                    <option>Todos</option>
                    <option>Disponible</option>
                    <option>Stock bajo</option>
                    <option>Agotado</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-dark flex-grow-1 shadow-sm">
                    Aplicar filtros
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={limpiarFiltros}>
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mt-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Listado de productos</h5>
          {loading ? (
            <p className="text-muted mb-0">Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p className="text-muted mb-0">No se encontraron productos con los filtros actuales.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoria</th>
                    <th>Marca</th>
                    <th>Stock</th>
                    <th>Stock minimo</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>{p.marca}</td>
                      <td>{p.stock}</td>
                      <td>{p.stockMinimo}</td>
                      <td><span className={`badge ${badgeEstado(p.estado)} shadow-sm`}>{p.estado}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark me-2"
                          onClick={() => iniciarEdicion(p)}
                        >
                          Editar
                        </button>
                        {puedeEliminar && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminar(p)}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Productos;
