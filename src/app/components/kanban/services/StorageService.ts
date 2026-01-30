import { BoardData } from '../../../services/types/frontendtypes/frontend';
import { INITIAL_DATA, getBoardWithMockCards, MOCK_CARD_IDS } from './initialData';

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
   * 会过滤掉假数据卡片（MOCK_CARD_IDS），不把假数据写入缓存。
   */
  saveBoard(data: BoardData): void {
    try {
      const cardsToSave = data.cards.filter((c) => !MOCK_CARD_IDS.has(c.id));
      const toSave: BoardData = { ...data, cards: cardsToSave };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  },

  /**
   * 从 localStorage 加载看板。
   * - 有缓存：解析后若 cards 为空，用 getBoardWithMockCards 注入假数据仅用于展示，不写入存储。
   * - 无缓存：返回 getBoardWithMockCards(INITIAL_DATA)，同样不写入存储。
   */
  loadBoard(): BoardData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const board = JSON.parse(data, dateReviver) as BoardData;
        return getBoardWithMockCards(board);
      }
      return getBoardWithMockCards(INITIAL_DATA);
    } catch (error) {
      console.error("Failed to load from localStorage, using initial data", error);
      return getBoardWithMockCards(INITIAL_DATA);
    }
  },

  /** 清空数据（调试用） */
  clearBoard(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};