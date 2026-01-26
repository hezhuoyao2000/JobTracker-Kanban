import { BoardData } from '../../../services/types/frontendtypes/frontend';

export const INITIAL_DATA: BoardData = {
  columns: [
    { id: 'col-todo', name: '准备投递', order: 1, isDefault: true },
    { id: 'col-applied', name: '已投递', order: 2, isDefault: true },
    { id: 'col-interview', name: '面试中', order: 3, isDefault: true },
    { id: 'col-offered', name: '获得Offer', order: 4, isDefault: true },
    { id: 'col-rejected', name: '未通过', order: 5, isDefault: true },
  ],
  cards: []
};