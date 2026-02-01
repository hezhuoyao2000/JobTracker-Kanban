import { BoardData } from '../../../services/types/frontendtypes/frontend';

export const INITIAL_DATA: BoardData = {
  columns: [
    { id: 'col-todo', name: 'Wish list', order: 1, isDefault: true, customAttributes: {} },
    { id: 'col-applied', name: 'Applied', order: 2, isDefault: true, customAttributes: {} },
    { id: 'col-interview', name: 'Interviewing', order: 3, isDefault: true, customAttributes: {} },
    { id: 'col-offered', name: 'Offered', order: 4, isDefault: true, customAttributes: {} },
    { id: 'col-rejected', name: 'Rejected', order: 5, isDefault: true, customAttributes: {} },
  ],
  cards: [], // 正式数据为空；展示时由 getBoardWithMockCards 注入假数据
};