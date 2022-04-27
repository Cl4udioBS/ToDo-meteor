export const taskSch = {
  title: {
    type: String,
    label: 'Título',
    defaultValue: '',
    optional: false,
  },
  description: {
    type: String,
    label: 'Descrição',
    defaultValue: '',
    optional: false,
  },
  isChecked: {
    type: Boolean,
    label: 'Concluída',
    defaultValue: false,
    optional: false,
  },
  personalTask: {
    type: Boolean,
    label: 'Tarefa pessoal',
    defaultValue: false,
    optional: false,
  },
  userId: {
    type: String,
    label: 'Autor',
    defaultValue: '',
    optional: false,
  }
};

export interface ITask {
  _id?: string;
  title: string;
  description: string;
  userId: string;
  check: boolean;
  personalTask: boolean;
  createdat: Date;
  updatedat: Date;
  createdby: string;
}
