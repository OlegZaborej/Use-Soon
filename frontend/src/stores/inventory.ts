import { defineStore } from 'pinia';
import { itemsApi } from '../api/client';
export const useInventoryStore = defineStore('inventory', { state:()=>({items:[] as any[]}), actions:{ async fetch(){ this.items=(await itemsApi.list()).data; } } });
