<template>
  <div class="space-y-4 pb-24">
    <div class="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <h1 class="text-xl font-bold text-gray-900">Inventory</h1>

      <input
        v-model.trim="searchQuery"
        type="search"
        placeholder="Search by name"
        class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2"
      />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in filterOptions"
          :key="option"
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold ring-1"
          :class="activeFilter === option ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-gray-700 ring-gray-200'"
          @click="activeFilter = option"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <ItemCard
        v-for="i in filteredAndSortedItems"
        :key="i.id"
        :item="i"
        class="cursor-pointer"
        @click="openDetails(i.id)"
      />
      <p v-if="!filteredAndSortedItems.length" class="rounded-xl bg-white p-3 text-sm text-gray-500 ring-1 ring-gray-100">
        No items found.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '../stores/inventory';
import ItemCard from '../components/ItemCard.vue';

const inventory = useInventoryStore();
const router = useRouter();

const searchQuery = ref('');
const activeFilter = ref<'All' | 'Use Soon' | 'Fresh' | 'Used' | 'Discarded'>('All');
const filterOptions = ['All', 'Use Soon', 'Fresh', 'Used', 'Discarded'] as const;

const normalizeStatus = (item: any) => {
  const raw = String(item?.displayStatus || item?.status || '').trim().toLowerCase();
  if (raw.includes('use soon') || raw.includes('expires today') || raw.includes('expired check')) return 'Use Soon';
  if (raw.includes('fresh') || raw === 'active') return 'Fresh';
  if (raw.includes('used')) return 'Used';
  if (raw.includes('discard')) return 'Discarded';
  return 'Fresh';
};

const groupOrder: Record<string, number> = {
  'Use Soon': 0,
  Fresh: 1,
  Used: 2,
  Discarded: 2,
};

const filteredAndSortedItems = computed(() => {
  const q = searchQuery.value.toLowerCase();

  return [...inventory.items]
    .filter((item) => {
      if (!q) return true;
      return String(item?.name || '').toLowerCase().includes(q);
    })
    .filter((item) => {
      if (activeFilter.value === 'All') return true;
      return normalizeStatus(item) === activeFilter.value;
    })
    .sort((a, b) => {
      const aStatus = normalizeStatus(a);
      const bStatus = normalizeStatus(b);
      const byGroup = groupOrder[aStatus] - groupOrder[bStatus];
      if (byGroup !== 0) return byGroup;
      return String(a?.name || '').localeCompare(String(b?.name || ''));
    });
});

const openDetails = (id: string) => router.push(`/items/${id}`);

onMounted(() => inventory.fetch());
</script>
