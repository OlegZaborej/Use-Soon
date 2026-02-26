<template>
  <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
        <p class="mt-1 text-xs text-gray-500">{{ item.quantityValue || 1 }} {{ item.quantityUnit || 'item' }}</p>
      </div>
      <ItemStatusBadge :status="item.displayStatus || item.status" />
    </div>
    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>{{ item.category || 'OTHER' }}</span>
      <span v-if="item.expiryDate">Exp: {{ new Date(item.expiryDate).toLocaleDateString() }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import ItemStatusBadge from './ItemStatusBadge.vue';
defineProps<{ item: any }>();
</script>
