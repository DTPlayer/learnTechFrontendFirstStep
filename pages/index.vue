<template>
	<section class="w-full h-full p-10 overflow-y-auto">
		<h1 class="mb-24">Ваши Доски:</h1>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-10" v-if="boards!.length > 0">
			<div v-for="board in boards" class="rounded-2xl bg-savoy p-5 cursor-pointer w-full h-full hover:bg-darkGreen transition-colors" @click="() => $router.push(`/${board.id}`)">
				<ViewColumnsIcon class="w-10 h-10 mb-5" />
				<h2>{{ board.name }}</h2>
			</div>
		</div>
		<div @click="() => (addBoardState = true)" class="rounded-2xl bg-savoy p-5 cursor-pointer w-full sm:w-80 h-40 hover:bg-red-400 transition-colors" v-else>
			<ViewColumnsIcon class="w-10 h-10 mb-5" />
			<h2>+ Создать Доску</h2>
		</div>
	</section>
</template>
<script setup lang="ts">
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
import { axiosInstance } from "~/components/axiosInstance";

interface Board {
  id: string;
  name: string;
}

let boards: Ref<Board[]> = ref([]);

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

const store = useKanbanStore();

const addBoardState = isAddBoardFormOpen();

</script>
