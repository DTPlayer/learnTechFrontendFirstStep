<script setup lang="ts">
  import DatePicker from 'primevue/datepicker';
  import ref from 'vue';

  const date = ref<Date | null>(null);
</script>

<template>
  <div class="p-4">
    <DatePicker v-model="date" />
  </div>
</template>

<style scoped>

</style>