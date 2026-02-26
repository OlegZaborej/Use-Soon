import { defineStore } from 'pinia';
import { notificationsApi } from '../api/client';
export const useNotificationsStore = defineStore('notifications',{state:()=>({list:[] as any[]}),actions:{async fetch(){this.list=(await notificationsApi.list()).data;},async test(){await notificationsApi.test(); await this.fetch();}}});
