/**
 * 列相关 API 服务
 * 包含列的更新等操作
 */

import { apiCall } from './client';
import type {
  ColumnDto,
  UpdateColumnRequestDto,
} from '../types/backendtypes/backend';

/**
 * 更新列信息
 * @param columnId - 列 ID
 * @param updates - 需要更新的字段
 * @returns 更新后的列信息
 */
export async function updateColumn(
  columnId: string,
  updates: Omit<UpdateColumnRequestDto, 'columnId'>
): Promise<ColumnDto> {
  const request: UpdateColumnRequestDto = {
    columnId,
    ...updates,
  };
  
  return apiCall<ColumnDto>('/board/column/update', request);
}
