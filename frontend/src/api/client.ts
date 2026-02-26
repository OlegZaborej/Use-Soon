import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, (e) => { if (e.response?.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; } return Promise.reject(e); });

export const authApi = {
  register: (payload: any) => api.post('/auth/register', payload),
  login: (payload: any) => api.post('/auth/login', payload),
  me: () => api.get('/me'),
};
export const itemsApi = { list: () => api.get('/items'), get: (id: string) => api.get(`/items/${id}`), create: (d:any)=>api.post('/items',d), update:(id:string,d:any)=>api.patch(`/items/${id}`,d), markUsed:(id:string)=>api.post(`/items/${id}/mark-used`), markDiscarded:(id:string)=>api.post(`/items/${id}/mark-discarded`), move:(id:string,d:any)=>api.post(`/items/${id}/move`,d), extendExpiry:(id:string,d:any)=>api.post(`/items/${id}/extend-expiry`,d)};
export const zonesApi = { list:()=>api.get('/storage-zones') };
export const statsApi = { dashboard:()=>api.get('/dashboard'), summary:()=>api.get('/stats/summary') };
export const settingsApi = { reminders:()=>api.get('/reminder-preferences'), patchReminders:(d:any)=>api.patch('/reminder-preferences',d) };
export const notificationsApi = { list:()=>api.get('/notifications'), test:()=>api.post('/notifications/test') };
