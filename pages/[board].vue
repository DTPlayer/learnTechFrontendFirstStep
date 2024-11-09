<template>
  <section class="w-full overflow-hidden">
    <FormTasks />
    <HeaderComponent />
    <FormEditBoard />
    <Columns v-if="boards!.length > 0" />
  </section>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~/stores";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useKanbanStore();

const updateBoardData = () => {
  const boardId = router.currentRoute.value.params.board;
  if (boardId) {
    if (typeof store.loadBoardData === 'function') {
      store.loadBoardData(boardId.toString());
    } else {
      console.error('loadBoardData is not a function');
    }
  }
}


if (import.meta.client) {
  onMounted(() => {
    updateBoardData();
  });

  const interval = setInterval(() => {
    updateBoardData();
  }, 2500);

  onUnmounted(() => {
    clearInterval(interval);
  })
}

definePageMeta({
  layout: "board",
});

const { boards } = storeToRefs(store);
</script>
