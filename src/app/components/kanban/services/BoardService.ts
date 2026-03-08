import { BoardData, JobCard } from '../../../services/types/frontendtypes/frontend';
import type { CreateCardRequestDto, UpdateCardRequestDto } from '../../../services/types/backendtypes/backend';
import * as boardApi from '../../../services/api/board';
import * as cardApi from '../../../services/api/card';
import * as columnApi from '../../../services/api/column';
import {
  boardDataFromApi,
  jobCardFromApi,
  columnFromApi,
} from '../../../services/types/transformer/boardTransformer';

/**
 * 将前端 JobCard 的可选字段转换为后端 DTO 格式
 * 主要处理 Date 类型转换为 ISO 8601 字符串
 */
function toCardOptions(options?: Partial<Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'jobTitle' | 'companyName' | 'statusId'>>): Omit<CreateCardRequestDto, 'boardId' | 'statusId' | 'jobTitle' | 'companyName'> | undefined {
  if (!options) return undefined;
  
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(options)) {
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  
  return result as Omit<CreateCardRequestDto, 'boardId' | 'statusId' | 'jobTitle' | 'companyName'>;
}

/**
 * 将前端更新字段转换为后端 DTO 格式
 * 主要处理 Date 类型转换为 ISO 8601 字符串
 */
function toUpdateOptions(updates: Partial<Omit<JobCard, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>>): Omit<UpdateCardRequestDto, 'cardId'> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(updates)) {
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  
  return result as Omit<UpdateCardRequestDto, 'cardId'>;
}

/**
 * BoardService - 看板业务逻辑服务
 * 封装了看板的所有操作，包括卡片和列的增删改查
 * 所有操作都会同步到后端 API
 */
export const BoardService = {
  /**
   * 从后端加载看板数据
   * @param boardId - 可选，看板 ID
   * @returns 看板数据
   */
  async loadBoard(boardId?: string): Promise<BoardData> {
    const dto = await boardApi.loadBoard(boardId);
    return boardDataFromApi(dto);
  },

  /**
   * 创建新看板
   * @param name - 可选，看板名称
   * @returns 看板数据
   */
  async createBoard(name?: string): Promise<BoardData> {
    const boardDto = await boardApi.createBoard(name);
    // 创建后加载完整看板数据
    return this.loadBoard(boardDto.id);
  },

  /**
   * 移动卡片到指定列
   * @param board - 当前看板数据
   * @param cardId - 卡片 ID
   * @param targetColumnId - 目标列 ID
   * @returns 更新后的看板数据
   */
  async moveCard(board: BoardData, cardId: string, targetColumnId: string): Promise<BoardData> {
    // 调用 API 移动卡片
    await cardApi.moveCard(cardId, targetColumnId);
    
    // 更新本地数据
    return {
      ...board,
      cards: board.cards.map(card =>
        card.id === cardId ? { ...card, statusId: targetColumnId, updatedAt: new Date() } : card
      )
    };
  },

  /**
   * 添加新卡片
   * @param board - 当前看板数据
   * @param jobTitle - 职位名称
   * @param companyName - 公司名称
   * @param statusId - 列 ID（初始状态）
   * @param options - 其他可选字段
   * @returns 更新后的看板数据
   */
  async addJob(
    board: BoardData,
    jobTitle: string,
    companyName: string,
    statusId: string,
    options?: Partial<Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'jobTitle' | 'companyName' | 'statusId'>>
  ): Promise<BoardData> {
    // 转换 options 中的 Date 类型为 ISO 字符串
    const convertedOptions = toCardOptions(options);
    
    // 调用 API 创建卡片
    const cardDto = await cardApi.createCard(
      board.board.id,
      statusId,
      jobTitle,
      companyName,
      convertedOptions
    );

    const newCard = jobCardFromApi(cardDto);

    return {
      ...board,
      cards: [...board.cards, newCard]
    };
  },

  /**
   * 更新卡片内容
   * @param board - 当前看板数据
   * @param cardId - 卡片 ID
   * @param updates - 需要更新的字段
   * @returns 更新后的看板数据
   */
  async updateCard(
    board: BoardData,
    cardId: string,
    updates: Partial<Omit<JobCard, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>>
  ): Promise<BoardData> {
    // 转换 updates 中的 Date 类型为 ISO 字符串
    const convertedUpdates = toUpdateOptions(updates);
    
    // 调用 API 更新卡片
    const cardDto = await cardApi.updateCard(cardId, convertedUpdates);
    const updatedCard = jobCardFromApi(cardDto);

    return {
      ...board,
      cards: board.cards.map(card =>
        card.id === cardId ? updatedCard : card
      )
    };
  },

  /**
   * 删除卡片（软删除）
   * @param board - 当前看板数据
   * @param cardId - 卡片 ID
   * @returns 更新后的看板数据
   */
  async deleteCard(board: BoardData, cardId: string): Promise<BoardData> {
    // 调用 API 删除卡片
    await cardApi.deleteCard(cardId);

    return {
      ...board,
      cards: board.cards.filter(card => card.id !== cardId)
    };
  },

  /**
   * 更新列信息
   * @param board - 当前看板数据
   * @param columnId - 列 ID
   * @param updates - 需要更新的字段
   * @returns 更新后的看板数据
   */
  async updateColumn(
    board: BoardData,
    columnId: string,
    updates: Partial<Omit<typeof board.columns[0], 'id' | 'boardId'>>
  ): Promise<BoardData> {
    // 调用 API 更新列
    const columnDto = await columnApi.updateColumn(columnId, updates);
    const updatedColumn = columnFromApi(columnDto);

    return {
      ...board,
      columns: board.columns.map(col =>
        col.id === columnId ? updatedColumn : col
      )
    };
  },

  /**
   * 重新排序列
   * @param board - 当前看板数据
   * @param columnId - 列 ID
   * @param newOrder - 新的排序位置
   * @returns 更新后的看板数据
   */
  async reorderColumn(
    board: BoardData,
    columnId: string,
    newOrder: number
  ): Promise<BoardData> {
    return this.updateColumn(board, columnId, { order: newOrder });
  },
};

export default BoardService;
