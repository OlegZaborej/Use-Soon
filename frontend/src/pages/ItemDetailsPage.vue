<template>
  <div class="space-y-4" v-if="item">
    <button
      type="button"
      class="text-sm font-medium text-emerald-600"
      @click="goBackToInventory"
    >
      ← Back to inventory
    </button>

    <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <h1 class="text-xl font-bold text-gray-900">{{ item.name }}</h1>
      <p class="mt-2 text-sm text-gray-600">Status: {{ item.displayStatus || item.status }}</p>
      <router-link :to="`/items/${item.id}/edit`" class="mt-3 inline-flex text-sm font-medium text-emerald-600">Edit</router-link>
    </div>

    <div v-if="isActive" class="flex gap-2">
      <AppButton @click="used">Mark used</AppButton>
      <AppButton @click="discard">Mark discarded</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { itemsApi } from '../api/client';
import AppButton from '../components/AppButton.vue';
import { useStatsStore } from '../stores/stats';

const route = useRoute();
const router = useRouter();
const stats = useStatsStore();
const item = ref<any>(null);

const normalizedStatus = computed(() => String(item.value?.status || '').trim().toUpperCase());
const isActive = computed(() => {
  if (!item.value) return false;
  const status = normalizedStatus.value;
  return status === 'ACTIVE' || status === '';
});

const load = async () => {
  item.value = (await itemsApi.get(route.params.id as string)).data;
};

const refreshDependentData = async () => {
  await stats.fetchDashboard();
};

const used = async () => {
  await itemsApi.markUsed(route.params.id as string);
  await Promise.all([load(), refreshDependentData()]);
};

const discard = async () => {
  await itemsApi.markDiscarded(route.params.id as string);
  await Promise.all([load(), refreshDependentData()]);
};

const goBackToInventory = () => {
  router.push('/inventory');
};

onMounted(load);
</script>
