import { defineStore } from 'pinia';
import { settingsApi } from '../api/client';
export const useSettingsStore = defineStore('settings',{state:()=>({reminder:null as any}),actions:{async fetch(){this.reminder=(await settingsApi.reminders()).data;},async save(data:any){this.reminder=(await settingsApi.patchReminders(data)).data;}}});
