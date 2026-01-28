import { BoardData } from '../../../services/types/frontendtypes/frontend';

export const INITIAL_DATA: BoardData = {
  columns: [
    { id: 'col-todo', name: 'Wish list', order: 1, isDefault: true },
    { id: 'col-applied', name: 'Applied', order: 2, isDefault: true },
    { id: 'col-interview', name: 'Interviewing', order: 3, isDefault: true },
    { id: 'col-offered', name: 'Offered', order: 4, isDefault: true },
    { id: 'col-rejected', name: 'Rejected', order: 5, isDefault: true },
  ],
  cards: []
};