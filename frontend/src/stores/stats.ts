import { defineStore } from 'pinia';
import { statsApi } from '../api/client';
export const useStatsStore = defineStore('stats',{state:()=>({dashboard:null as any, summary:null as any}),actions:{async fetchDashboard(){this.dashboard=(await statsApi.dashboard()).data;},async fetchSummary(){this.summary=(await statsApi.summary()).data;}}});
