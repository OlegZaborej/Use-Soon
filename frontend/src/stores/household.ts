import { defineStore } from 'pinia';
import { api } from '../api/client';
export const useHouseholdStore = defineStore('household',{state:()=>({household:null as any}),actions:{async fetch(){this.household=(await api.get('/household')).data;}}});
