import { defineStore } from 'pinia';
import { authApi } from '../api/client';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as any, token: localStorage.getItem('token') || '' }),
  actions: {
    async login(payload: any) { const { data } = await authApi.login(payload); this.token = data.accessToken; this.user = data.user; localStorage.setItem('token', data.accessToken); },
    async register(payload: any) { const { data } = await authApi.register(payload); this.token = data.accessToken; this.user = data.user; localStorage.setItem('token', data.accessToken); },
    logout() { this.token = ''; this.user = null; localStorage.removeItem('token'); },
  },
});
