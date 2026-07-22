import React, { useEffect, useState } from 'react';
import { productosApi, reportesApi } from '../api/client';

function badgeEstado(estado) {
  if (estado === 'Agotado') return 'bg-danger';
  if (estado === 'Stock bajo') return 'bg-warning text-dark';
  return 'bg-success';
}

function exportarCsv(productos) {
  const encabezados = ['Producto', 'Categoria', 'Marca', 'Stock', 'Stock minimo', 'Estado'];
  const filas = productos.map((p) => [p.nombre, p.categoria, p.marca, p.stock, p.stockMinimo, p.estado]);
  const contenido = [encabezados, ...filas]
    .map((fila) => fila.map((valor) => `"${String(valor).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([`﻿${contenido}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-stock-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function Stock() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    productosApi
      .list()
      .then(({ productos: lista }) => setProductos(lista))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEnviarCorreo = async () => {
    setError('');
    setMensaje('');
    setEnviando(true);
    try {
      const { message } = await reportesApi.enviarStock();
      setMensaje(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Control de Stock</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-dark shadow-sm"
            type="button"
            disabled={enviando}
            onClick={handleEnviarCorreo}
          >
            {enviando ? 'Enviando...' : 'Enviar por correo'}
          </button>
          <button
            className="btn btn-danger shadow-sm"
            type="button"
            disabled={productos.length === 0}
            onClick={() => exportarCsv(productos)}
          >
            Exportar reporte
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          {loading ? (
            <p className="text-muted mb-0">Cargando stock...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoria</th>
                    <th>Marca</th>
                    <th>Stock</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>{p.marca}</td>
                      <td>{p.stock}</td>
                      <td><span className={`badge ${badgeEstado(p.estado)} shadow-sm`}>{p.estado}</span></td>
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

export default Stock;
