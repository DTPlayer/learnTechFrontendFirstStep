<template>
  <transition name="fade">
    <div v-if="isFormOpenState" class="popup-modal">
      <div class="w-96 lg:w-1/3 flex flex-col p-8 bg-charcoal rounded-xl gap-3 relative m-10">
        <button class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-mauve p-3" @click="toggleFormModal(false)">
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2>{{ !!taskToEditState ? "Изменить" : "Добавить" }} Карточку</h2>

        <div class="w-full h-full space-y-2 pr-8 flex flex-col">
          <div class="flex flex-col space-y-2">
            <label for="task_FIOCandidate">ФИО кандидата</label>
            <input v-model.trim="taskFIOCandidate" type="text" name="task_FIOCandidate" placeholder="Введите ФИО кандидата" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="task_DOBCandidate">Дата рождения кандидата</label>
            <input v-model.trim="taskDOBCandidate" type="text" name="task_DOBCandidate" placeholder="Введите дату рождения кандидата" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="task_FIOHR">ФИО ответственного HR</label>
            <input v-model.trim="taskFIOHR" type="text" name="task_FIOHR" placeholder="Введите ФИО ответственного HR" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="task_PostCandidate">Должность кандидата</label>
            <input v-model.trim="taskPostCandidate" type="text" name="task_PostCandidate" placeholder="Введите должность кандидата" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="task_SalaryCandidate">Ожидаемая ЗП кандидата</label>
            <input v-model.trim="taskSalaryCandidate" type="text" name="task_SalaryCandidate" placeholder="Введите ожидаемую ЗП кандидата" />
          </div>

          <div class="flex flex-col space-y-2">
            <label for="task_taskFileCandidate">Загрузить файл</label>
            <input aria-describedby="file_input_help" @change="handleFileChange" name="task_taskFileCandidate" type="file">
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">docx, excel, pdf.</p>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="task_SalaryCandidate">Дата создания резюме</label>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" />

              <template #panel="{ close }">
                <DatePicker v-model="date" is-required @close="close" />
              </template>
            </UPopover>
          </div>

          <div class="space-y-2">
            <p>Текущий Статус</p>
            <select name="status" v-model="taskColumnId">
              <option v-for="column in getBoardColumns(boardId)" :key="column.id" :value="column.id">
                {{ column.name }}
              </option>
            </select>
          </div>
        </div>
        <BaseButton :label="buttonLabel" @action="taskToEditState ? editTaskInfos() : createNewTask()" class="bg-savoy" />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useKanbanStore } from "~~/stores";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { format } from 'date-fns';
import { ref, computed } from 'vue';

const date = ref(new Date());
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const toggleFormModal = (isOpen: boolean): void => {
  isFormOpenState.value = isOpen;
  taskToEditState.value = null;
};

// Route
const route = useRoute();
const boardId = route.params.board.toString();

// Store
const store = useKanbanStore();
const { addTaskToColumn, getBoardColumns, editTask } = store;

// Refs
const taskColumnId = ref<string>("");
const taskFIOCandidate = ref<string>("");
const taskDOBCandidate = ref<string>("");
const taskFIOHR = ref<string>("");
const taskPostCandidate = ref<string>("");
const taskSalaryCandidate = ref<string>("");
const taskFileCandidate = ref<File | null>(null);

// Methods
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    taskFileCandidate.value = target.files[0];
  }
};

const createNewTask = (): void => {
  const newTask = {
    name: taskFIOCandidate.value,
    dateOfBirthCandidate: taskDOBCandidate.value,
    nameHR: taskFIOHR.value,
    postCandidate: taskPostCandidate.value,
    salaryCandidate: taskSalaryCandidate.value,
    file: taskFileCandidate.value,
  };
  if (useValidator(taskFIOCandidate.value, taskDOBCandidate.value, taskFIOHR.value, taskPostCandidate.value, taskSalaryCandidate.value)) {
    addTaskToColumn(boardId, taskColumnId.value, newTask);
    resetValues();
    toggleFormModal(false);
  }
};

const editTaskInfos = (): void => {
  const editedTask = {
    id: taskToEditState.value!.id,
    name: taskFIOCandidate.value,
    dateOfBirthCandidate: taskDOBCandidate.value,
    nameHR: taskFIOHR.value,
    postCandidate: taskPostCandidate.value,
    salaryCandidate: taskSalaryCandidate.value,
    file: taskFileCandidate.value,
  };
  if (useValidator(taskFIOCandidate.value, taskDOBCandidate.value, taskFIOHR.value, taskPostCandidate.value, taskSalaryCandidate.value)) {
    editTask(
      boardId,
      taskToEditState.value!.columnParentId,
      taskColumnId.value,
      editedTask
    );
    resetValues();
    toggleFormModal(false);
  }
};

const resetValues = (): void => {
  taskColumnId.value = getBoardColumns(boardId)![0].id;
  taskFIOCandidate.value = "";
  taskDOBCandidate.value = "";
  taskFIOHR.value = "";
  taskPostCandidate.value = "";
  taskSalaryCandidate.value = "";
  taskFileCandidate.value = null;
};

const buttonLabel = computed(() => {
  return taskToEditState.value ? "Сохранить Изменения" : "Добавить Карточку";
});

watch(isFormOpenState, () => {
  if (taskToEditState.value !== null) {
    taskFIOCandidate.value = taskToEditState.value.name;
    taskDOBCandidate.value = taskToEditState.value.dateOfBirthCandidate;
    taskFIOHR.value = taskToEditState.value.nameHR;
    taskPostCandidate.value = taskToEditState.value.postCandidate;
    taskSalaryCandidate.value = taskToEditState.value.salaryCandidate;
    taskColumnId.value = taskToEditState.value.columnParentId;
    taskFileCandidate.value = taskToEditState.value.file;
  } else {
    resetValues();
  }
});
</script>