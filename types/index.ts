interface Base {
  id: string;
  name: string;
}

export interface Task extends Base {
  description: string;
  nameHR: string;
  postCandidate: string;
  createdAt: Date;
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

