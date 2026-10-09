import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

// Attach JWT on every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('mc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

// ── Hospitals ────────────────────────────────────────────────────
export const hospitalAPI = {
  search: (params) => API.get('/hospitals/search', { params }),
  getById: (id)    => API.get(`/hospitals/${id}`),
  register: (data) => API.post('/hospital-admin/hospitals', data),
  approve: (id)    => API.patch(`/admin/hospitals/${id}/approve`),
};

// ── Treatments / Cost Breakdown ──────────────────────────────────
export const treatmentAPI = {
  getAll:            ()            => API.get('/treatments'),
  search:            (name)        => API.get('/treatments/search', { params: { name } }),
  getByHospital:     (hId)         => API.get(`/hospitals/${hId}/treatments`),
  getCostBreakdown:  (hId, tId)    => API.get(`/hospitals/${hId}/treatments/${tId}/cost`),
  addToHospital:     (hId, data)   => API.post(`/hospital-admin/hospitals/${hId}/treatments`, data),
};

// ── Bed Availability ─────────────────────────────────────────────
export const bedAPI = {
  getStatus: (hId)        => API.get(`/hospitals/${hId}/beds`),
  update:    (hId, data)  => API.put(`/hospital-admin/hospitals/${hId}/beds`, data),
};

// ── Reviews ──────────────────────────────────────────────────────
export const reviewAPI = {
  getByHospital: (hId, params) => API.get(`/reviews/hospital/${hId}`, { params }),
  add:           (hId, data)   => API.post(`/reviews/hospital/${hId}`, data),
  reply:         (id, data)    => API.patch(`/hospital-admin/reviews/${id}/reply`, data),
};

// ── Appointments ─────────────────────────────────────────────────
export const appointmentAPI = {
  book:    (data)  => API.post('/appointments', data),
  getMine: (params)=> API.get('/appointments/my', { params }),
  cancel:  (id)    => API.patch(`/appointments/${id}/cancel`),
  confirm: (id)    => API.patch(`/appointments/${id}/confirm`),
  complete:(id)    => API.patch(`/appointments/${id}/complete`),
};

export default API;
