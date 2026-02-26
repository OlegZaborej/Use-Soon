<template><div class="flex gap-2 overflow-x-auto"><button v-for="z in zones" :key="z.id" class="px-3 py-1 bg-gray-200 rounded" @click="$emit('select',z.id)">{{ z.name }}</button></div></template>
<script setup lang="ts">defineProps<{zones:any[]}>();</script>
