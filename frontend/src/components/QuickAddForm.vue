<template><div class="space-y-2"><AppInput v-model="name" placeholder="Quick add"/><AppButton @click="submit">Add</AppButton></div></template>
<script setup lang="ts">import {ref} from 'vue';import AppInput from './AppInput.vue';import AppButton from './AppButton.vue';const emit=defineEmits(['submit']);const name=ref('');const submit=()=>emit('submit',name.value);</script>
