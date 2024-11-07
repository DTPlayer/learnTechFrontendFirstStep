<template>
  <div
    class="w-full p-5 rounded-xl bg-charcoal shadow-sm cursor-pointer hover:text-savoy transition-colors"
  >
    <span class="font-medium select-none break-all w-full h-full">{{
      props.taskName
    }}</span>
    <div v-if="props.taskFile" class="mt-2">
      <a
        :href="props.taskFile"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500 hover:underline"
      >
        {{ props.taskFileName || 'Download File' }}
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  taskName: string;
  taskFile: string;      // File URL or file name
  taskFileName: string;  // Optional display name for the file
}>();
</script>
