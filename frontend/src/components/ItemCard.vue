<template><div class="bg-white rounded p-3 shadow"><div class="font-semibold">{{ item.name }}</div><ItemStatusBadge :status="item.displayStatus||item.status" /></div></template>
<script setup lang="ts">import ItemStatusBadge from './ItemStatusBadge.vue'; defineProps<{item:any}>();</script>
