<template><div class="space-y-2"><ItemCard v-for="i in items" :key="i.id" :item="i"/></div></template>
<script setup lang="ts">import ItemCard from './ItemCard.vue'; defineProps<{items:any[]}>();</script>
