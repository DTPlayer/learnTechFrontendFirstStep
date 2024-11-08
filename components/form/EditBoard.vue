<template>
  <transition name="fade">
    <div v-if="boardFormState" class="popup-modal">
      <div
        class="w-fit h-fit flex flex-col p-8 bg-charcoal rounded-xl relative m-10"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-mauve p-3"
          @click="() => (boardFormState = false)"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
        <h2>Изменить Доску</h2>
        <div class="flex flex-col space-y-2 justify-between h-f md:w-96">
          <div class="flex flex-col gap-5">
            <label for="task_name">Название Доски</label>
            <input
              autofocus
              v-model.trim="boardName"
              type="text"
              name="task_name"
              placeholder="Введите Название Доски"
            />
          </div>
        </div>
        <div class="flex flex-col gap-3 mt-8">
          <ButtonBase
            label="Сохранить Изменения"
            @action="saveChanges"
            class="bg-green-600"
          />
          <ButtonBase
            label="Удалить Доску"
            @action="removeBoard"
            class="bg-savoy"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import ButtonBase from '~/components/base/Button.vue';

// Props and emits
const boardFormState = isEditBoardFormOpen();

// Store
const store = useKanbanStore();
const { boards } = storeToRefs(store);
const { editBoard, getBoardColumns, deleteBoardOnServer } = store;
import { IColumn } from "~/types/";

// Refs
const route = useRoute();
const router = useRouter();
const boardId = route.params.board.toString();

const boardName = ref<string>("");
const boardColumns = ref<IColumn[] | null>(null);

const validateColumnsName = (): boolean => {
  const columnsNames = boardColumns.value!.map((column) => column.name);
  return useValidator(...columnsNames);
};

const saveChanges = () => {
  if (useValidator(boardName.value) && validateColumnsName()) {
    editBoard(boardId, boardName.value) // Передаем boardId и новое название доски
      .then(() => {
        boardFormState.value = false; // Закрываем модальное окно после успешного изменения
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const removeColumnFromBoard = (columnId: string) => {
  const filteredBoard = boardColumns.value!.filter(
    (column) => column.id !== columnId
  );
  boardColumns.value = filteredBoard;
};

const removeBoard = () => {
  deleteBoardOnServer(boardId) // Передаем boardId в метод deleteBoardOnServer
    .then(() => {
      boardFormState.value = false; // Закрываем модальное окно после успешного удаления
      router.push("/"); // Перенаправляем на главную страницу
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(boardFormState, () => {
  if (boardFormState.value) {
    boardColumns.value = JSON.parse(JSON.stringify(getBoardColumns(boardId)));
    boardName.value = JSON.parse(
      JSON.stringify(boards.value?.find((board) => board.id === boardId)!.name)
    );
  }
});
</script>