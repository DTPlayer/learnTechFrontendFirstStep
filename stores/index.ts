import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStorage } from "@vueuse/core";
import { axiosInstance } from "~/components/axiosInstance";
import type { Board, IColumn, Task } from "~/types/";
import {
  type Builtin,
  RawSymbol,
  type RefUnwrapBailTypes,
  ShallowReactiveMarker,
  type UnwrapRefSimple
} from "@vue/reactivity";
import type { UnwrapRef } from "vue";

export const useKanbanStore = defineStore("kanban", {
  state: () => ({
    boards: useStorage("board", [] as Board[] | undefined),
    isLoading: false,
  }),
  getters: {
    getBoardColumns:
      (state) =>
        (boardId: string): IColumn[] | undefined => {
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
      this.isLoading = true;
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
            if (this.boards === undefined) {
              this.boards = response.data.boards.map((board: Board) => ({
                ...board,
                columns: [
                  { id: uuidv4(), name: "Стакан резюме", tasks: [] },
                  { id: uuidv4(), name: "Теплый контакт", tasks: [] },
                  { id: uuidv4(), name: "Скрининг", tasks: [] },
                  { id: uuidv4(), name: "Интервью", tasks: [] },
                  { id: uuidv4(), name: "Проверка СБ", tasks: [] },
                  { id: uuidv4(), name: "Оффер", tasks: [] },
                ],
              }));
            } else {
              this.boards = response.data.boards.map((board: Board) => {
                const existingBoard = this.boards?.find((b) => b.id === board.id);
                return {
                  ...board,
                  columns: existingBoard ? existingBoard.columns : [
                    { id: uuidv4(), name: "Стакан резюме", tasks: [] },
                    { id: uuidv4(), name: "Теплый контакт", tasks: [] },
                    { id: uuidv4(), name: "Скрининг", tasks: [] },
                    { id: uuidv4(), name: "Интервью", tasks: [] },
                    { id: uuidv4(), name: "Проверка СБ", tasks: [] },
                    { id: uuidv4(), name: "Оффер", tasks: [] },
                  ],
                };
              });
            }
            this.isLoading = true;
          })
          .catch((error) => {
            console.log(error);
            localStorage.removeItem("token");
            location.reload();
          });
      }
    },
    loadBoardData(boardId: string) {
      this.isLoading = true;
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
              // Очищаем существующие столбцы и задачи
              board.columns.forEach(column => column.tasks = []);
              response.data.cards.forEach((cardData: any) => {
                const card = cardData.data.card;
                const task: any = {
                  id: card.id,
                  name: `${card.first_name_candidate} ${card.last_name_candidate} ${card.middle_name_candidate}`,
                  nameHR: `${localStorage.getItem("userFirstName")} ${localStorage.getItem("userLastName")} ${localStorage.getItem("userMiddleName")}`, // Добавьте ФИО HR, если оно есть в ответе
                  postCandidate: card.job_title,
                  salaryCandidate: card.salary.toString(),
                  createdAt: new Date(Date.parse(card.created_at)).toLocaleString(),
                  file: cardData.data.files[0]?.file_path || null,
                  columnStatus: card.status,
                  dateOfBirthCandidate: card.date_of_birth_candidate
                };
                const column = board.columns.find((column) => column.name === card.status);
                if (column) {
                  column.tasks.push(task);
                  console.log(column.tasks)
                }
                this.isLoading = false;
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
      taskInfos: any,
      isEditing = false
    ): void {
      this.isLoading = true;

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
          date_of_birth_candidate: taskInfos.dateOfBirthCandidate,
        };


        axiosInstance({
          method: "post",
          url: isEditing ? `/api/card/${taskInfos.id}/edit` : "/api/card/create",
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

            if (!isEditing && taskInfos.file) {
              taskInfos.id = response.data.cards[-1].id;
              this.uploadFiles(taskData.board_id, response.data.cards[-1].id, taskInfos, taskInfos.file)
            }

            this.isLoading = false;
          })
          .catch((error) => {
            console.log(error);
            console.log(taskData);
            this.isLoading = false;
          });
      }
    },
    removeTaskFromColumn(boardId: string, columnId: string, editedTask: Task) {
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        const column = board.columns.find((column) => column.id === columnId);
        if (column) {
          column.tasks = column.tasks.filter((task) => task.id !== editedTask.id);
        }
      }
    },
    DeleteTaskFromColumn(editedTask: any, boardId: string, columnId: any, taskInfos: any): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const token = localStorage.getItem("token");
        axiosInstance({
          method: "post",
          url: `/api/card/${editedTask}/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            resolve(true);
          })
          .catch((error) => {
            console.log(error);
            console.log(editedTask);
            resolve(false)
          });
      })
    },
    createNewBoard(boardName: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        console.log("createNewBoard");
        const boardTemplate: Board = {
          id: uuidv4(),
          name: boardName,
          columns: [
            { id: uuidv4(), name: "Стакан резюме", tasks: [] },
            { id: uuidv4(), name: "Теплый контакт", tasks: [] },
            { id: uuidv4(), name: "Скрининг", tasks: [] },
            { id: uuidv4(), name: "Интервью", tasks: [] },
            { id: uuidv4(), name: "Проверка СБ", tasks: [] },
            { id: uuidv4(), name: "Оффер", tasks: [] },
          ],
        };
        console.log(boardTemplate);
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
              console.log(response.data.boards);
              this.initializeBoards();
              resolve(true);
            })
            .catch((error) => {
              console.log(error);
              localStorage.removeItem("token");
              resolve(false);
            });
        }
      })
    },

    uploadFiles(boardId: string, columnId: string, taskInfos: any, file: File) {
      const token = localStorage.getItem("token");
      if (token) {
        const formData: FormData = new FormData();

        if (file) {
          formData.append("file", file);
        } else {
          console.error("File is null");
          return;
        }

        axiosInstance({
          method: "post",
          url: `/api/card/${taskInfos.id}/upload`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: formData,
        })
          .then((response) => {
            const newTask = { id: response.data.id, ...taskInfos };
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

    editTaskData(
      boardId: string,
      columnId: string,
      editedTask: any
    ): void {
      this.removeTaskFromColumn(boardId, columnId, editedTask);
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        const column = board.columns.find((column) => column.id === columnId);
        if (column) {
          column.tasks = column.tasks.map((task: Task) =>
            task.id === editedTask.id ? editedTask : task
          );
        }
      }
      this.addTaskToColumn(boardId, columnId, editedTask, true);
    },

    localRemoveTask(boardId: string, columnId: string, editedTask: any) {
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        const column = board.columns.find((column) => column.id === columnId);
        if (column) {
          console.log(column.tasks)
          column.tasks = column.tasks.filter((task) => task.id !== editedTask);
          console.log(column.tasks)
        }
      }
    },

    editTask(
      boardId: string,
      columnId: string,
      newColumnId: string,
      editedTask: any
    ) {
      const board = this.boards?.find((board) => board.id === boardId);
      if (board) {
        const column = board.columns.find((column) => column.id === columnId);
        if (column) {
          if (newColumnId !== columnId) {
            this.addTaskToColumn(boardId, newColumnId, editedTask, true);
          } else {
            column.tasks = column.tasks.map((task: Task) =>
              task.id === editedTask.id ? editedTask : task
            );
          }
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
          .then((response: any) => {
            const board = this.boards?.find((board) => board.id === boardId);
            if (board) {
              // Очищаем существующие столбцы и задачи
              board.columns.forEach(column => column.tasks = []);
              console.log(board)
              response.data.cards.forEach((cardData: any) => {
                const card = cardData.card;
                const task: any = {
                  id: card.id,
                  name: `${card.first_name_candidate} ${card.last_name_candidate} ${card.middle_name_candidate}`,
                  nameHR: `${localStorage.getItem("userFirstName")} ${localStorage.getItem("userLastName")} ${localStorage.getItem("userMiddleName")}`, // Добавьте ФИО HR, если оно есть в ответе
                  postCandidate: card.job_title,
                  salaryCandidate: card.salary.toString(),
                  file: cardData.files[0]?.file_path || null,
                };
                const column = board.columns.find((column) => column.name === card.status);
                if (column) {
                  column.tasks.push(task);
                  console.log(column.tasks)
                }
                this.isLoading = false;
              });
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