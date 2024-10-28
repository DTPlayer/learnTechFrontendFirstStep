<script setup lang="ts">
  import {AppHeader} from "#components";


</script>

<template>
  <div class="min-w-screen min-h-screen bg-gray-900 font-roboto text-white">
    <AppHeader />
    <slot />
  </div>
</template>

<style scoped>

</style>