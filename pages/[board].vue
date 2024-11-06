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
import { useKanbanStore } from "~~/stores";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useKanbanStore();

if (import.meta.client) {
  store.loadBoardData(router.currentRoute.value.params.board.toString());
}

const { boards } = storeToRefs(store);
</script>
