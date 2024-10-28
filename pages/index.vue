<script setup lang="ts">
  import Button from 'primevue/button';
  import IconField from 'primevue/iconfield';
  import InputIcon from 'primevue/inputicon';
  import {ref} from 'vue';

  const value1: Ref<string> = ref('');
  const value2: Ref<string> = ref('');
</script>

<template>
  <div class="p-4 flex flex-row gap-4">
    <Button label="Verify" />
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="value1" placeholder="Search" />
    </IconField>

    <IconField>
      <InputText v-model="value2" variant="filled" />
      <InputIcon class="pi pi-spin pi-spinner" />
    </IconField>

  </div>
</template>

<style scoped>

</style>