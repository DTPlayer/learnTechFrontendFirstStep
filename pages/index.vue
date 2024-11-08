<template>
  <div v-if="loginView" class="flex min-h-full min-w-full flex-col justify-center px-6 py-12 lg:px-8 absolute bg-gradient-to-r from-charcoal to-mauve">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="../public/Logo.svg" alt="JobJuorney">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-marengo">Авторизация</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="login" class="block text-sm/6 font-medium text-marengo">Логин</label>
          <div class="mt-2">
            <input id="login" name="login" type="text" autocomplete="login" required class="block w-full rounded-md border-0 py-1.5 text-marengo shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy sm:text-sm/6">
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
          <button
            @click='authUser'
            type="submit"
            class="flex w-full justify-center rounded-md bg-savoy px-3 py-1.5 text-sm/6 font-semibold text-charcoal shadow-sm hover:bg-darkGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkGreen"
          >
            Войти
          </button>
        </div>
      </form>
    </div>
    <div v-if="errorView" class="p-6 w-100 h-22 shadow-2xl rounded-lg transition ease duration-300 bg-charcoal absolute right-10 bottom-10">
      <h2 class="text-xl/9 font-bold tracking-tight text-marengo">Неправильный пароль или логин</h2>
    </div>
  </div>

  <section v-else class="w-full h-full p-10 overflow-y-auto">
    <h1 class="mb-24">Ваши Доски:</h1>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-10" v-if="boards && boards!.length > 0">
      <NuxtLink
        v-for="board in boards"
        :key="board.id"
        :to="`/${board.id}`"
        class="rounded-2xl bg-savoy p-5 cursor-pointer w-full h-full hover:bg-darkGreen transition-colors"
        exact-active-class="bg-savoy"
      >
        <ViewColumnsIcon class="w-10 h-10 mb-5" />
        <h2>{{ board.name }}</h2>
      </NuxtLink>
    </div>
    <div @click="() => (boardFormState = true)" class="rounded-2xl bg-savoy p-5 cursor-pointer w-full sm:w-80 h-40 hover:bg-darkGreen transition-colors" v-else>
      <ViewColumnsIcon class="w-10 h-10 mb-5" />
      <h2>+ Создать Доску</h2>
    </div>
  </section>
  <AddBoard :boardFormState="boardFormState" @update:boardFormState="updateBoardFormState" />
</template>

<script setup lang="ts">
import { ViewColumnsIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "~~/stores";
import { axiosInstance } from "~/components/axiosInstance";
import { onMounted, ref } from "vue";
import AddBoard from "~/components/form/AddBoard.vue";

const store = useKanbanStore();
const { boards } = storeToRefs(store);
const { initializeBoards, loadBoardData } = store;

const loginView = ref(true);
const errorView = ref(false);
const boardFormState = ref(false);

if (import.meta.client) {
  if (localStorage.getItem("token")) {
    loginView.value = false;
    initializeBoards();
  }
  sessionStorage.setItem('fromIndex', 'true')
}

const updateBoardFormState = (newState: boolean) => {
  boardFormState.value = newState;
};


const authUser = (e) => {
  e.preventDefault();
  axiosInstance({
    method: "post",
    url: "/api/auth",
    data: {
      login: document.querySelector("#login").value,
      password: document.querySelector("#password").value,
    },
  }).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userFirstName", response.data.user.first_name);
    localStorage.setItem("userLastName", response.data.user.last_name);
    localStorage.setItem("userMiddleName", response.data.user.middle_name);
    loginView.value = false;
    initializeBoards();
  }).catch((error) => {
    console.log(error);
    errorView.value = true;
    setTimeout(() => errorView.value = false, 4000);
  });
};

onMounted(() => {
  if (!loginView.value) {
    initializeBoards();
  }
});
const route = useRoute();
// watch(() => route.params.board, (boardId) => {
//   if (typeof boardId === 'string') {
//     loadBoardData(boardId);
//   }
// });
</script>