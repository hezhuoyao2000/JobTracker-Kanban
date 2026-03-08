/**
 * 卡片相关 API 服务
 * 包含卡片的创建、更新、移动、删除等操作
 */

import { apiCall } from './client';
import type {
  JobCardDto,
  CreateCardRequestDto,
  UpdateCardRequestDto,
  MoveCardRequestDto,
  DeleteCardRequestDto,
} from '../types/backendtypes/backend';

/**
 * 创建新卡片
 * @param boardId - 看板 ID
 * @param statusId - 列 ID（卡片初始状态）
 * @param jobTitle - 职位名称
 * @param companyName - 公司名称
 * @param options - 其他可选字段
 * @returns 新创建的卡片信息
 */
export async function createCard(
  boardId: string,
  statusId: string,
  jobTitle: string,
  companyName: string,
  options?: Omit<CreateCardRequestDto, 'boardId' | 'statusId' | 'jobTitle' | 'companyName'>
): Promise<JobCardDto> {
  const request: CreateCardRequestDto = {
    boardId,
    statusId,
    jobTitle,
    companyName,
    ...options,
  };
  
  return apiCall<JobCardDto>('/board/card/create', request);
}

/**
 * 更新卡片信息
 * @param cardId - 卡片 ID
 * @param updates - 需要更新的字段
 * @returns 更新后的卡片信息
 */
export async function updateCard(
  cardId: string,
  updates: Omit<UpdateCardRequestDto, 'cardId'>
): Promise<JobCardDto> {
  const request: UpdateCardRequestDto = {
    cardId,
    ...updates,
  };
  
  return apiCall<JobCardDto>('/board/card/update', request);
}

/**
 * 移动卡片到指定列
 * @param cardId - 卡片 ID
 * @param targetStatusId - 目标列 ID
 * @returns 移动后的卡片信息
 */
export async function moveCard(
  cardId: string,
  targetStatusId: string
): Promise<JobCardDto> {
  const request: MoveCardRequestDto = {
    cardId,
    targetStatusId,
  };
  
  return apiCall<JobCardDto>('/board/card/move', request);
}

/**
 * 删除卡片（软删除）
 * @param cardId - 卡片 ID
 */
export async function deleteCard(cardId: string): Promise<void> {
  const request: DeleteCardRequestDto = {
    cardId,
  };
  
  return apiCall<void>('/board/card/delete', request);
}
