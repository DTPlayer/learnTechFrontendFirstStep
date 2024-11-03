<template>
  <main class="flex h-screen w-screen">
    <aside
      class="hidden md:block h-full w-96 bg-charcoal border-r border-white border-opacity-10 text-marengo overflow-y-auto"
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
      <div v-if="boards!.length > 0">
        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/${board.id}`"
          class="flex gap-2 px-5 py-3 mr-5 items-center hover:bg-darkGreen transition-colors rounded-r-3xl font-bold"
          exact-active-class="bg-savoy"
        >
          <ViewColumnsIcon class="w-5 h-5" />
          {{ board.name }}
        </NuxtLink>
      </div>
      <div
        class="px-5 py-3 mr-5 flex gap-2 items-center text-savoy cursor-pointer hover:bg-gray-500/20 transition-colors rounded-r-3xl"
        @click="boardFormState = true"
      >
        <ViewColumnsIcon class="w-5 h-5" />+ Создать Новую Доску
      </div>
    </aside>
    <slot></slot>
    <FormAddBoard />
  </main>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import MyCustomIcon from '~/components/MyCustomIcon.vue';
import { axiosInstance } from "~/components/axiosInstance";

const boardFormState = isAddBoardFormOpen();

const store = useKanbanStore();

const { boards } = storeToRefs(store);

const boardsCount = computed(() => {
  return boards.value?.length;
});
if (import.meta.client) {
  const token = localStorage.getItem("token");
  if (token) {
    axiosInstance({
      method: "get",
      url: "/api/board/get/all",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      boards.value = response.data.boards;
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem("token");
      location.reload();
    })
  } else {
    axiosInstance({
      method: "post",
      url: "/api/auth",
      data: {
        login: 'test',
        password: 'password'
      }
    }).then((responce) => {
      localStorage.setItem("token", responce.data.token);
      location.reload();
    }).catch((error) => {
      console.log(error);
    })
  }
}
</script>
