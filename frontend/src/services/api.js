import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
};

// ─── FUNDS ───────────────────────────────────────────────────────────────────
export const fundsAPI = {
  search:           (query)              => api.get('/api/funds/search', { params: { query } }),
  getDetails:       (schemeCode)         => api.get(`/api/funds/${schemeCode}/details`),
  getReturns:       (schemeCode)         => api.get(`/api/funds/${schemeCode}/returns`),
  getRisk:          (schemeCode, range)  => api.get(`/api/funds/${schemeCode}/risk`,    { params: { range } }),
  getSharpe:        (schemeCode, range)  => api.get(`/api/funds/${schemeCode}/sharpe`,  { params: { range } }),
  getNavChart:      (schemeCode, range)  => api.get(`/api/funds/${schemeCode}/nav-chart`,   { params: { range } }),
  getNavHistory:    (schemeCode, range)  => api.get(`/api/funds/${schemeCode}/nav-history`, { params: { range } }),
  // risk param: LOW | MODERATE | HIGH   range: 1Y | 3Y | 5Y
  getRecommendations: (risk, range)      => api.get('/api/funds/recommendations', { params: { risk, range } }),
  // BACKEND ONLY ACCEPTS 2 OR 3 funds - enforced server side
  compareFunds:     (schemeCodes)        => api.post('/api/funds/compare', { schemeCodes }),
  // Calculator endpoint is at /api/funds/calculate
  calculate:        (data)               => api.post('/api/funds/calculate', data),
};

// ─── USER ─────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:           ()     => api.get('/api/users/me'),
  updateProfile:        (data) => api.put('/api/users/me', data),
  deleteAccount:        ()     => api.delete('/api/users/me'),
  getMyRecommendations: ()     => api.get('/api/users/me/recommendations'),
};

export default api;
