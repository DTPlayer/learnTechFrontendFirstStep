<template>
  <div
    class="w-full p-5 rounded-xl bg-charcoal shadow-sm cursor-pointer hover:text-savoy transition-colors"
  >
    <span class="text-sm font-medium select-none w-full h-full flex flex-col gap-2 justify-start items-center">
      {{ props.taskName }}
      {{ props.taskNameHR }}
    </span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  taskName: string;
  taskNameHR: string;
}>();
</script>
