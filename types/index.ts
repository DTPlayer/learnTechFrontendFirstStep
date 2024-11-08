interface Base {
  id: string;
  name: string;
}

export interface Task extends Base {
  description: string;
}

export interface IColumn extends Base {
  tasks: any[];
}

export interface Board extends Base {
  columns: IColumn[];
}

export interface TaskToEdit extends Task {
  columnParentId: string;
}

