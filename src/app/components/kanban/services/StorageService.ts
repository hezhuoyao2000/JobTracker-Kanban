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
   * 保存看板到 localStorage。
   */
  saveBoard(data: BoardData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
        return JSON.parse(data, dateReviver) as BoardData;
      }
      return { ...INITIAL_DATA };
    } catch (error) {
      console.error('Failed to load from localStorage, using initial data', error);
      return { ...INITIAL_DATA };
    }
  },

  /** 清空数据（调试用） */
  clearBoard(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};