import React, { useEffect, useState } from 'react';
import { alertasApi } from '../api/client';

function claseAlerta(nivel) {
  switch (nivel) {
    case 'danger': return 'alert-danger';
    case 'warning': return 'alert-warning';
    case 'info': return 'alert-info';
    default: return 'alert-secondary';
  }
}

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    alertasApi
      .list()
      .then(({ alertas: lista }) => setAlertas(lista))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Modulo de Alertas</h1>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Avisos del Sistema</h5>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {loading ? (
            <p className="text-muted mb-0">Cargando alertas...</p>
          ) : (
            alertas.map((a, index) => (
              <div
                key={a.id}
                className={`alert ${claseAlerta(a.nivel)} shadow-sm ${index === alertas.length - 1 ? 'mb-0' : ''}`}
                role="alert"
              >
                <i className={`bi ${a.icono} me-2`}></i> {a.mensaje}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Alertas;
