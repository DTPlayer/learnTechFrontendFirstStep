interface Base {
  id: string;
  name: string;
}

export interface Task extends Base {
  description: string;
}

export interface Column extends Base {
  tasks: Task[];
}

export interface Board extends Base {
  columns: Column[];
}

export interface TaskToEdit extends Task {
  columnParentId: string;
}

