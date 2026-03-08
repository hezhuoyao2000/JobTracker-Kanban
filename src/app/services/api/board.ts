/**
 * 看板相关 API 服务
 * 包含看板的加载、创建、更新等操作
 */

import { apiCall } from './client';
import type {
  BoardDto,
  BoardDataDto,
  CreateBoardRequestDto,
  LoadBoardRequestDto,
} from '../types/backendtypes/backend';

/**
 * 加载看板数据
 * @param boardId - 可选，看板 ID，不传则返回用户的第一个看板
 * @returns 看板完整数据（包含看板信息、列和卡片）
 */
export async function loadBoard(boardId?: string): Promise<BoardDataDto> {
  const request: LoadBoardRequestDto = {};
  if (boardId) {
    request.boardId = boardId;
  }
  
  return apiCall<BoardDataDto>('/board/load', request);
}

/**
 * 创建新看板
 * @param name - 可选，看板名称，为空则使用默认名称 "My Job Tracker"
 * @returns 新创建的看板信息
 */
export async function createBoard(name?: string): Promise<BoardDto> {
  const request: CreateBoardRequestDto = {};
  if (name) {
    request.name = name;
  }
  
  return apiCall<BoardDto>('/board/create', request);
}
