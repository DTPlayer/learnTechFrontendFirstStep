<template>
  <div
    class="w-full p-5 rounded-xl bg-charcoal shadow-sm cursor-pointer hover:text-savoy transition-colors"
  >
    <div class="text-sm font-medium select-none w-full h-full flex flex-col gap-2 justify-start">
      <span>ФИО: {{ props.taskName }}</span>
      <span>HR: {{ props.taskNameHR }}</span>
      <span>Должность: {{ props.taskPostCandidate }}</span>
      <span>Дата Создания: {{ createdAt }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  taskName: string;
  taskNameHR: string;
  taskPostCandidate: string;
  taskDate: string;
}>();

const createdAt = ref('');

onMounted(() => {
  if (props.taskDate.indexOf('T') !== -1) {
    createdAt.value = new Date(props.taskDate).toLocaleString();
  } else {
    createdAt.value = props.taskDate
  }
})

</script>
