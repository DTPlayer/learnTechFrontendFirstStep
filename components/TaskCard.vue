<template>
  <div
    class="w-full p-5 rounded-xl bg-charcoal shadow-sm cursor-pointer hover:text-savoy transition-colors"
  >
    <span class="text-sm font-medium select-none w-full h-full">{{
      props.taskName
    }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  taskName: string;
}>();
</script>
