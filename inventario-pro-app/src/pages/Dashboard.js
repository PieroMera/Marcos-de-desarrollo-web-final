import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dashboardApi } from '../api/client';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom' },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.05)' },
    },
    x: {
      grid: { display: false },
    },
  },
};

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .summary()
      .then(setResumen)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const chartData = {
    labels: (resumen?.semanal || []).map((d) => d.dia),
    datasets: [
      {
        label: 'Entradas',
        data: (resumen?.semanal || []).map((d) => d.entradas),
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Salidas',
        data: (resumen?.semanal || []).map((d) => d.salidas),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Resumen General</h1>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card card-stat shadow-sm p-4 border-0 rounded-4">
            <h5>Productos registrados</h5>
            <p className="h3 text-danger">{loading ? '...' : resumen?.totalProductos ?? 0}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card card-stat shadow-sm p-4 border-0 rounded-4">
            <h5>Movimientos registrados</h5>
            <p className="h3 text-danger">{loading ? '...' : resumen?.totalMovimientos ?? 0}</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card card-stat shadow-sm p-4 border-0 rounded-4">
            <h5>Alertas activas</h5>
            <p className="h3 text-danger">{loading ? '...' : resumen?.alertasActivas ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mt-2">
        <div className="card-body">
          <h5 className="card-title mb-4">Actividad Semanal de Movimientos</h5>
          <div className="chart-container">
            {loading ? (
              <p className="text-muted mb-0">Cargando actividad...</p>
            ) : (
              <Line data={chartData} options={options} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
