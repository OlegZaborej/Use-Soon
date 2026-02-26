<template><div class="bg-green-100 p-3 rounded">Estimated savings: {{ amount/100 }}</div></template>
<script setup lang="ts">defineProps<{amount:number}>();</script>
