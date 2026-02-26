<template>
  <span :class="badgeClass" class="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize">{{ statusLabel }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>();

const statusLabel = computed(() => props.status.replace('_', ' '));
const badgeClass = computed(() => {
  if (['use_soon', 'expires_today', 'expired_check'].includes(props.status)) return 'bg-amber-100 text-amber-700';
  if (props.status === 'used') return 'bg-emerald-100 text-emerald-700';
  if (props.status === 'discarded') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-100 text-slate-600';
});
</script>
