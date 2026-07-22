export const STORAGE_KEY = 'inventarioPro.session';

function getToken() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored).token || null;
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || 'Ocurrio un error inesperado. Intente nuevamente.';
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),
  updateProfile: (payload) => request('/auth/me', { method: 'PUT', body: payload }),
  changePassword: (payload) => request('/auth/password', { method: 'PUT', body: payload }),
};

export const productosApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    return request(`/productos${qs ? `?${qs}` : ''}`);
  },
  create: (payload) => request('/productos', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/productos/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
};

export const movimientosApi = {
  list: (limit) => request(`/movimientos${limit ? `?limit=${limit}` : ''}`),
  create: (payload) => request('/movimientos', { method: 'POST', body: payload }),
};

export const alertasApi = {
  list: () => request('/alertas'),
};

export const dashboardApi = {
  summary: () => request('/dashboard/summary'),
};

export const reportesApi = {
  enviarStock: () => request('/reportes/stock', { method: 'POST' }),
};
