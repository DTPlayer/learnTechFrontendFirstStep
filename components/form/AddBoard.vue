<template>
  <transition name="fade">
    <div v-if="boardFormState" class="popup-modal">
      <div
        class="w-fit h-fit flex flex-col p-8 bg-charcoal rounded-xl gap-10 relative m-10"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-mauve p-3"
          @click="() => $emit('update:boardFormState', false)"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
        <h2>Создать Новую Доску</h2>
        <div class="flex flex-col space-y-2 justify-between h-full md:w-96">
          <div class="flex flex-col gap-5">
            <label for="task_name">Название Доски</label>
            <input
              autofocus
              v-model.trim="boardName"
              type="text"
              name="task_name"
              placeholder="Введите Название"
            />
          </div>
        </div>
        <BaseButton label="Создать Доску" @click="useCreateNewBoard" class="bg-savoy"/>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

//Props and emits
const props = defineProps<{
  boardFormState: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:boardFormState', value: boolean): void;
}>();

//Refs
const boardName = ref<string>("");

//Store
const store = useKanbanStore();

const useCreateNewBoard = (e: Event) => {
  e.preventDefault();

  if (boardName.value) {
    emit('update:boardFormState', false);

    store.createNewBoard(boardName.value).then((result) => {
      if (result) {
        boardName.value = "";
        console.log("Board created successfully");
      } else {
        console.log("Failed to create board");
      }
    })
  }
};
</script>