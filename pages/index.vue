<template>

<div class="flex min-h-full min-w-full flex-col justify-center px-6 py-12 lg:px-8 absolute bg-gradient-to-r from-charcoal to-mauve">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-10 w-auto" src="../public/Logo.svg" alt="JobJuorney">
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-marengo">Авторизация</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label for="email" class="block text-sm/6 font-medium text-marengo">Логин</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-marengo shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy sm:text-sm/6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-marengo">Пароль</label>
          
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-marengo shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy sm:text-sm/6">
        </div>
      </div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-savoy px-3 py-1.5 text-sm/6 font-semibold text-charcoal shadow-sm hover:bg-darkGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkGreen">Войти</button>
      </div>
    </form>

    
  </div>
</div>

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
