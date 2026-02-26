<template><div><h1>Inventory</h1><ItemCard v-for="i in inventory.items" :key="i.id" :item="i" @click="$router.push(`/items/${i.id}`)"/></div></template>
<script setup lang="ts">import {onMounted} from 'vue';import {useInventoryStore} from '../stores/inventory';import ItemCard from '../components/ItemCard.vue';const inventory=useInventoryStore();onMounted(()=>inventory.fetch());</script>
