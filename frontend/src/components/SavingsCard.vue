<template>
  <div class="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
    <p class="text-xs text-emerald-700">Estimated savings</p>
    <p class="mt-1 text-xl font-bold text-emerald-800">${{ (amount / 100).toFixed(2) }}</p>
    <p class="text-[11px] text-emerald-600">Estimate based on rescued items.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ amount: number }>();
</script>
