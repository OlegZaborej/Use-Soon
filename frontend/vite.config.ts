import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [vue(), VitePWA({ registerType: 'autoUpdate', manifest: { name: 'Smart Pantry', short_name: 'Pantry', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#22c55e', icons: [] } })],
});
