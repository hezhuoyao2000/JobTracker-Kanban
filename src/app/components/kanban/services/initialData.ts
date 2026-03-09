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

/**
 * 初始看板数据（使用 UUID 格式 ID）
 * 注意：这些数据仅用于 SSR 初始渲染，实际数据应从后端加载
 * 后端会在用户注册/登录时自动创建默认看板
 */

/** 初始看板 ID（UUID 格式） */
const INITIAL_BOARD_ID = '550e8400-e29b-41d4-a716-446655440000';

/** 初始列 ID（UUID 格式） */
const COLUMN_IDS = {
  WISH_LIST: '550e8400-e29b-41d4-a716-446655440001',
  APPLIED: '550e8400-e29b-41d4-a716-446655440002',
  INTERVIEWING: '550e8400-e29b-41d4-a716-446655440003',
  OFFERED: '550e8400-e29b-41d4-a716-446655440004',
  REJECTED: '550e8400-e29b-41d4-a716-446655440005',
} as const;

export const INITIAL_DATA: BoardData = {
  board: {
    id: INITIAL_BOARD_ID,
    userId: '550e8400-e29b-41d4-a716-446655440010',
    name: 'My Job Tracker',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  columns: [
    { id: COLUMN_IDS.WISH_LIST, boardId: INITIAL_BOARD_ID, name: 'Wish list', order: 0, isDefault: true, customAttributes: {} },
    { id: COLUMN_IDS.APPLIED, boardId: INITIAL_BOARD_ID, name: 'Applied', order: 1, isDefault: true, customAttributes: {} },
    { id: COLUMN_IDS.INTERVIEWING, boardId: INITIAL_BOARD_ID, name: 'Interviewing', order: 2, isDefault: true, customAttributes: {} },
    { id: COLUMN_IDS.OFFERED, boardId: INITIAL_BOARD_ID, name: 'Offered', order: 3, isDefault: true, customAttributes: {} },
    { id: COLUMN_IDS.REJECTED, boardId: INITIAL_BOARD_ID, name: 'Rejected', order: 4, isDefault: true, customAttributes: {} },
  ],
  cards: [], // 正式数据为空；实际数据从后端加载
};
