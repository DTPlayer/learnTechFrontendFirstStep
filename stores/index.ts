import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStorage } from "@vueuse/core";
import { axiosInstance } from "~/components/axiosInstance";

export const useKanbanStore = defineStore("kanban", {
  state: () => ({
    boards: useStorage("board", [] as Board[] | undefined),
  }),
  getters: {
    getBoardColumns:
      (state) =>
        (boardId: string): Column[] | undefined => {
          const findBoard = state.boards?.find((board) => board.id === boardId);
          return findBoard?.columns;
        },
    getColumnTasks() {
      return (boardId: string, columnId: string): Task[] | undefined => {
        const column = this.getBoardColumns(boardId)?.find(
          (column) => column.id === columnId
        );
        return column?.tasks;
      };
    },
  },
  actions: {
    initializeBoards() {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance({
          method: "get",
          url: "/api/board/get/all",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            // Добавляем колонки к каждой доске
            const boardsWithColumns = response.data.boards.map((board: Board) => ({
              ...board,
              columns: [
                { id: uuidv4(), name: "Стакан резюме", tasks: [] },
                { id: uuidv4(), name: "Теплый контакт", tasks: [] },
                { id: uuidv4(), name: "Скрининг", tasks: [] },
                { id: uuidv4(), name: "Интервью с заказчиком", tasks: [] },
                { id: uuidv4(), name: "Проверка СБ", tasks: [] },
                { id: uuidv4(), name: "Оффер", tasks: [] },
              ],
            }));
            this.boards = boardsWithColumns;
          })
          .catch((error) => {
            console.log(error);
            localStorage.removeItem("token");
            location.reload();
          });
      }
    },
    loadBoardData(boardId: string) {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance({
          method: "get",
          url: `/api/board/get/${boardId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            const board = this.boards?.find((board) => board.id === boardId);
            if (board) {
              response.data.cards.forEach((cardData: any) => {
                const card = cardData.card;
                const task: Task = {
                  id: card.id,
                  name: `${card.first_name_candidate} ${card.last_name_candidate} ${card.middle_name_candidate}`,
                  dateOfBirthCandidate: "", // Добавьте дату рождения, если она есть в ответе
                  nameHR: `${localStorage.getItem("userFirstName")} ${localStorage.getItem("userLastName")} ${localStorage.getItem("userMiddleName")}`, // Добавьте ФИО HR, если оно есть в ответе
                  postCandidate: card.job_title,
                  salaryCandidate: card.salary.toString(),
                  file: cardData.files[0]?.file_path || null, // Добавьте файл, если он есть в ответе
                };
                const column = board.columns.find((column) => column.name === card.status);
                if (column) {
                  column.tasks.push(task);
                }
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    addTaskToColumn(
      boardId: string,
      columnId: string,
      taskInfos: Omit<Task, "id">
    ) {
      const token = localStorage.getItem("token");
      if (token) {
        const taskData = {
          first_name_candidate: taskInfos.name.split(' ')[0],
          last_name_candidate: taskInfos.name.split(' ')[1],
          middle_name_candidate: taskInfos.name.split(' ')[2],
          job_title: taskInfos.postCandidate,
          salary: parseInt(taskInfos.salaryCandidate),
          board_id: boardId,
          status: this.getBoardColumns(boardId)?.find(column => column.id === columnId)?.name,
        };

        axiosInstance({
          method: "post",
          url: "/api/card/create",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: taskData,
        })
          .then((response) => {
            const newTask = { id: response.data.id, ...taskInfos }; // Используем ID, возвращенный сервером
            const board = this.boards?.find((board) => board.id === boardId);
            if (board) {
              const column = board.columns.find((column) => column.id === columnId);
              if (column) {
                column.tasks.push(newTask);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    removeTaskFromColumn(boardId: string, columnId: string, editedTask: Task) {
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        const column = board.columns.find((column) => column.id === columnId);
        if (column) {
          column.tasks = column.tasks.filter((task) => task.id !== editedTask.id);
          this.saveBoardsToServer();
        }
      }
    },
    createNewBoard(boardName: string) {
      const boardTemplate: Board = {
        id: uuidv4(),
        name: boardName,
        columns: [
          { id: uuidv4(), name: "Стакан резюме", tasks: [] },
          { id: uuidv4(), name: "Теплый контакт", tasks: [] },
          { id: uuidv4(), name: "Скрининг", tasks: [] },
          { id: uuidv4(), name: "Интервью с заказчиком", tasks: [] },
          { id: uuidv4(), name: "Проверка СБ", tasks: [] },
          { id: uuidv4(), name: "Оффер", tasks: [] },
        ],
      };

      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance({
          method: "post",
          url: "/api/board/create",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: boardTemplate,
        })
          .then((response) => {
            this.boards = response.data.boards;
          })
          .catch((error) => {
            console.log(error);
            localStorage.removeItem("token");
            location.reload();
          });
      }
    },
    editTask(
      boardId: string,
      columnId: string,
      newColumnId: string,
      editedTask: Task
    ) {
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        const column = board.columns.find((column) => column.id === columnId);
        if (column) {
          if (newColumnId !== columnId) {
            this.removeTaskFromColumn(boardId, columnId, editedTask);
            this.addTaskToColumn(boardId, newColumnId, editedTask);
          } else {
            column.tasks = column.tasks.map((task) =>
              task.id === editedTask.id ? editedTask : task
            );
          }
          this.saveBoardsToServer();
        }
      }
    },
    createNewColumn(boardId: string, columnName: string) {
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        board.columns.push({
          id: uuidv4(),
          name: columnName,
          tasks: [],
        });
        this.saveBoardsToServer();
      }
    },
    editBoard(boardId: string, newBoardName: string) {
      const token = localStorage.getItem("token");
      if (token) {
        return axiosInstance({
          method: "post",
          url: `/api/board/${boardId}/edit`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { name: newBoardName }, // Передаем новое название доски в теле запроса
        })
          .then(() => {
            // Обновляем локальное состояние
            const board = this.boards?.find((board) => board.id === boardId);
            if (board) {
              board.name = newBoardName;
            }
          })
          .catch((error) => {
            console.log(error);
            throw error; // Перебрасываем ошибку, чтобы она могла быть поймана в компоненте
          });
      } else {
        return Promise.reject("Token not found");
      }
    },
    deleteBoard(boardId: string) {
      const index = this.boards?.findIndex((board) => board.id === boardId);
      if (index !== undefined && index !== -1) {
        this.boards?.splice(index, 1);
        this.saveBoardsToServer();
      }
    },
    // это я даже не помню когда появилось просто забейте на это
    saveBoardsToServer() {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance({
          method: "post",
          url: "/api/board/update",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { boards: this.boards },
        })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    deleteBoardOnServer(boardId: string) {
      const token = localStorage.getItem("token");
      if (token) {
        return axiosInstance({
          method: "post",
          url: `/api/board/${boardId}/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            // Удаляем доску из локального состояния
            this.boards = this.boards?.filter((board) => board.id !== boardId);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
});