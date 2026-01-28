import { BoardData } from '../../../services/types/frontendtypes/frontend';
import { INITIAL_DATA } from './initialData';

const STORAGE_KEY = 'job_tracker_data';

/** JobCard 里所有日期字段的 key，用于反序列化时转回 Date */
const DATE_KEYS = new Set<string>(['createdAt', 'updatedAt', 'appliedTime']);

/**
 * JSON.parse 的 reviver：遇到日期字段且值为字符串时，转为 Date 对象
 * reviver 会对每一个 (key, value) 调用，我们只对已知的日期 key 做转换
 */
function dateReviver(_key: string, value: unknown): unknown {
  if (DATE_KEYS.has(_key) && typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d;
  }
  return value;
}

export const StorageService = {
  /**
   * 保存整个看板数据到 localStorage。
   * Date 会被 JSON.stringify 自动转成 ISO 字符串，无需手动处理。
   */
  saveBoard(data: BoardData): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  },

  /**
   * 从 localStorage 加载看板数据。
   * 使用 dateReviver 把 createdAt/updatedAt/appliedTime 从字符串还原为 Date。
   */
  loadBoard(): BoardData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data, dateReviver) as BoardData;
      }
    } catch (error) {
      console.error("Failed to load from localStorage, using initial data", error);
    }
    return INITIAL_DATA;
  },

  /** 清空数据（调试用） */
  clearBoard(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};