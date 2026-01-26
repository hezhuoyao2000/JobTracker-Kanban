// src/services/StorageService.ts
import { BoardData } from '../../../services/types/frontendtypes/frontend';
import { INITIAL_DATA } from './initialData';

const STORAGE_KEY = 'job_tracker_data';

export const StorageService = {
  // 保存整个看板数据
  saveBoard(data: BoardData): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  },

  // 加载看板数据
  loadBoard(): BoardData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Failed to load from localStorage, using initial data", error);
    }
    // 如果没有数据或解析失败，返回默认初始数据
    return INITIAL_DATA;
  },

  // 清空数据（调试用）
  clearBoard(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};