<template>
  <main class="flex h-screen w-screen">
    <aside
      class="hidden md:flex flex-col h-full w-96 bg-charcoal border-r border-white border-opacity-10 text-marengo overflow-y-auto"
    >
      <div class="w-full p-5">
        <NuxtLink to="/" exact-active-class="text-savoy ">
          <div class="flex flex-row gap-2">
            <MyCustomIcon/>
            <h1 class="mb-20">JobJuorney</h1>
          </div>
        </NuxtLink>
        <p class="mb-5 tracking-widest">ВСЕ ДОСКИ ({{ boardsCount }})</p>
      </div>
      <div v-if="boards && boards!.length > 0">
        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/${board.id}`"
          class="flex gap-2 px-5 py-3 mr-5 mb-3 items-center hover:bg-darkGreen transition-colors rounded-r-3xl font-bold"
          exact-active-class="bg-savoy"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          {{ board.name }}
        </NuxtLink>
      </div>
      <div
        class="px-5 py-3 mr-5 flex gap-2 items-center text-savoy cursor-pointer hover:bg-gray-500/20 transition-colors rounded-r-3xl flex-shrink-0"
        @click="() => (boardFormState = true)"
      >
        <ViewColumnsIcon class="w-5 h-5" />+ Создать Новую Доску
      </div>
      <div class="flex flex-col gap-3 m-3 mt-auto">
        <ButtonBase
          label="Выход"
          class="bg-red-600"
          @action="logout"
        />
      </div>
    </aside>
    <NuxtPage />
    <AddBoard :boardFormState="boardFormState" @update:boardFormState="updateBoardFormState" />
  </main>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import MyCustomIcon from '~/components/MyCustomIcon.vue';
import AddBoard from '~/components/form/AddBoard.vue';
import { ref, onMounted, computed } from "vue";
import ButtonBase from "~/components/base/Button.vue";

const boardFormState = ref(false);

const store = useKanbanStore();

const { boards } = storeToRefs(store);
const { initializeBoards } = store;

onMounted(() => {
  initializeBoards();
});

const updateBoardFormState = (newState: boolean) => {
  boardFormState.value = newState;
};

const boardsCount = computed(() => {
  if (!boards.value) return 0;
  return boards.value?.length;
});

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}
</script>