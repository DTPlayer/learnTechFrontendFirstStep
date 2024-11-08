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

if (import.meta.client) {
  console.log(store); // Check if store is properly initialized
  console.log(typeof store.loadBoardData); // Check if loadBoardData is a function

  if (import.meta.client) {
    const boardId = router.currentRoute.value.params.board;
    if (boardId) {
      if (typeof store.loadBoardData === 'function') {
        store.loadBoardData(boardId.toString());
      } else {
        console.error('loadBoardData is not a function');
      }
    }
  }
}

definePageMeta({
  layout: "board",
});

const { boards } = storeToRefs(store);
</script>
