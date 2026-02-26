<template>
  <div class="space-y-4 pb-24">
    <header class="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white shadow-lg">
      <p class="text-xs/5 uppercase tracking-[0.18em] text-emerald-100">Smart Pantry</p>
      <h1 class="mt-1 text-2xl font-bold leading-tight">Never waste food in your freezer again.</h1>
      <router-link to="/items/new" class="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700">+ Add item</router-link>
    </header>

    <section class="grid grid-cols-2 gap-3">
      <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <p class="text-xs text-gray-500">Use Soon</p>
        <p class="mt-1 text-2xl font-bold">{{ (stats.dashboard?.useSoon || []).length }}</p>
      </div>
      <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <p class="text-xs text-gray-500">This Week</p>
        <p class="mt-1 text-2xl font-bold">{{ (stats.dashboard?.thisWeek || []).length }}</p>
      </div>
    </section>

    <SavingsCard :amount="stats.dashboard?.estimatedSavings || 0" />

    <section class="space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Use Soon</h2>
        <router-link to="/inventory" class="text-xs font-medium text-emerald-600">See all</router-link>
      </div>
      <UseSoonList :items="stats.dashboard?.useSoon || []" />
      <p v-if="!(stats.dashboard?.useSoon || []).length" class="rounded-xl bg-white p-3 text-sm text-gray-500 ring-1 ring-gray-100">
        Great job — no urgent freezer items right now.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStatsStore } from '../stores/stats';
import SavingsCard from '../components/SavingsCard.vue';
import UseSoonList from '../components/UseSoonList.vue';

const stats = useStatsStore();
onMounted(() => stats.fetchDashboard());
</script>
