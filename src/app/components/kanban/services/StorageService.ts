import { BoardData } from '../../../services/types/frontendtypes/frontend';
import { INITIAL_DATA } from './initialData';
import { boardDataFromApi, boardDataToApi } from '../../../services/types/transformer/boardTransformer';
import type { BoardDataDto } from '../../../services/types/backendtypes/backend';

const STORAGE_KEY = 'job_tracker_data';
const LAST_SYNC_KEY = 'job_tracker_last_sync';



export const StorageService = {
  /**
   * 保存看板到 localStorage。
   * 同时将数据转换为后端 DTO 格式存储，便于与 API 数据格式保持一致
   */
  saveBoard(data: BoardData): void {
    try {
      // 转换为后端 DTO 格式后存储（日期转为 ISO 字符串）
      const dtoData = boardDataToApi(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dtoData));
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save to localStorage', error);
    }
  },

  /**
   * 从 localStorage 加载看板。
   * - 有缓存：解析后返回
   * - 无缓存或解析失败：返回 INITIAL_DATA（空卡片）
   */
  loadBoard(): BoardData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        // 解析为后端 DTO 格式，然后转换为前端类型
        const dtoData = JSON.parse(data) as BoardDataDto;
        return boardDataFromApi(dtoData);
      }
      return { ...INITIAL_DATA };
    } catch (error) {
      console.error('Failed to load from localStorage, using initial data', error);
      return { ...INITIAL_DATA };
    }
  },

  /**
   * 检查是否有本地缓存
   */
  hasCachedBoard(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEY);
  },

  /**
   * 获取最后同步时间
   */
  getLastSyncTime(): Date | null {
    if (typeof window === 'undefined') return null;
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    if (lastSync) {
      const date = new Date(lastSync);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    return null;
  },

  /**
   * 清空数据（调试用）
   */
  clearBoard(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  },

  /**
   * 清除所有看板相关缓存
   */
  clearAllCache(): void {
    this.clearBoard();
  },
};

export default StorageService;
