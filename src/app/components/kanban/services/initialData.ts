import { BoardData } from '../../../services/types/frontendtypes/frontend';

/** 新西兰主流求职平台选项，供 Position link 来源选择。Other 为固定选项，Custom 用于用户自定义输入 */
export const LINK_SOURCE_OPTIONS = [
  { value: 'seek', label: 'Seek' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'trademe', label: 'Trade Me Jobs' },
  { value: 'prosple', label: 'Prosple' },  
  { value: 'indeed', label: 'Indeed NZ' },
  { value: 'summeroftech', label: 'Summer of Tech' },
  { value: 'workhere', label: 'WorkHere' },
  { value: 'zeil', label: 'Zeil' },
  { value: 'careers', label: 'Careers.govt.nz' },
  { value: 'studentjobsearch', label: 'Student Job Search' },
  { value: 'other', label: 'Other' },
  { value: 'custom', label: 'Enter custom...' },
] as const;

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