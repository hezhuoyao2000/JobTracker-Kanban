import { BoardData } from '../../../services/types/frontendtypes/frontend';
import { INITIAL_DATA } from './initialData';
import { boardDataFromApi, boardDataToApi } from '../../../services/types/transformer/boardTransformer';
import type { BoardDataDto } from '../../../services/types/backendtypes/backend';

const STORAGE_KEY = 'job_tracker_data';
const LAST_SYNC_KEY = 'job_tracker_last_sync';
const DATA_VERSION_KEY = 'job_tracker_data_version';
const CURRENT_DATA_VERSION = '2'; // 版本 2：使用 UUID 格式 ID

/** 数据同步决策结果 */
export interface SyncDecision {
  /** 是否需要同步 */
  shouldSync: boolean;
  /** 用户选择的操作 */
  action?: 'useCloud' | 'useLocal' | 'merge';
  /** 本地数据更新时间 */
  localTime?: Date | null;
  /** 云端数据更新时间 */
  cloudTime?: Date | null;
  /** 是否有数据冲突 */
  hasConflict: boolean;
}

/**
 * 验证 ID 是否为有效的 UUID 格式
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * 检查看板数据是否使用 UUID 格式
 * 如果不是，说明是旧数据，需要清除
 */
function isValidBoardData(data: BoardData): boolean {
  // 检查看板 ID
  if (!isValidUUID(data.board.id)) {
    return false;
  }
  // 检查所有列的 ID
  for (const column of data.columns) {
    if (!isValidUUID(column.id)) {
      return false;
    }
  }
  // 检查所有卡片的 ID（如果有）
  for (const card of data.cards) {
    if (!isValidUUID(card.id)) {
      return false;
    }
  }
  return true;
}

/**
 * 获取数据的最后更新时间
 */
function getDataTimestamp(data: BoardData): Date | null {
  // 优先使用看板 updatedAt，其次使用卡片中最新的 updatedAt
  if (data.board.updatedAt) {
    return data.board.updatedAt;
  }

  // 检查所有卡片的更新时间
  let latestTime: Date | null = null;
  for (const card of data.cards) {
    if (card.updatedAt) {
      if (!latestTime || card.updatedAt > latestTime) {
        latestTime = card.updatedAt;
      }
    }
  }

  return latestTime;
}

/**
 * 比较本地和云端数据，决定是否需要同步
 *
 * 方案 C 策略：
 * 1. 如果本地无数据，使用云端数据
 * 2. 如果本地数据与云端数据时间戳相近（< 5 分钟），使用云端数据（认为云端更新）
 * 3. 如果本地数据明显更新（时间差 > 5 分钟），提示用户选择
 * 4. 如果云端数据明显更新，使用云端数据
 */
export function shouldSyncData(localData: BoardData, cloudData: BoardData): SyncDecision {
  const localTime = getDataTimestamp(localData);
  const cloudTime = getDataTimestamp(cloudData);

  // 如果本地无有效数据，直接使用云端
  if (!localTime || localData.cards.length === 0) {
    return {
      shouldSync: false, // 无需用户选择，直接使用云端
      action: 'useCloud',
      localTime: null,
      cloudTime,
      hasConflict: false,
    };
  }

  // 如果云端无有效数据，使用本地
  if (!cloudTime || cloudData.cards.length === 0) {
    return {
      shouldSync: false, // 无需用户选择，继续使用本地
      action: 'useLocal',
      localTime,
      cloudTime: null,
      hasConflict: false,
    };
  }

  const timeDiff = cloudTime.getTime() - localTime.getTime();
  const threshold = 5 * 60 * 1000; // 5 分钟阈值

  // 云端数据明显更新
  if (timeDiff > threshold) {
    return {
      shouldSync: false, // 云端明显更新，直接使用
      action: 'useCloud',
      localTime,
      cloudTime,
      hasConflict: false,
    };
  }

  // 本地数据明显更新
  if (timeDiff < -threshold) {
    return {
      shouldSync: true, // 需要用户选择
      action: 'useCloud', // 默认推荐云端
      localTime,
      cloudTime,
      hasConflict: true,
    };
  }

  // 时间戳相近，使用云端数据（避免冲突）
  return {
    shouldSync: false,
    action: 'useCloud',
    localTime,
    cloudTime,
    hasConflict: false,
  };
}

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
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    } catch (error) {
      console.error('Failed to save to localStorage', error);
    }
  },

  /**
   * 从 localStorage 加载看板。
   * - 有缓存且格式正确：解析后返回
   * - 无缓存、解析失败或格式不正确：返回 INITIAL_DATA（空卡片）
   */
  loadBoard(): BoardData {
    try {
      // 检查数据版本
      const savedVersion = localStorage.getItem(DATA_VERSION_KEY);
      if (savedVersion !== CURRENT_DATA_VERSION) {
        console.log('Data version mismatch, clearing old cache');
        this.clearBoard();
        return { ...INITIAL_DATA };
      }

      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        // 解析为后端 DTO 格式，然后转换为前端类型
        const dtoData = JSON.parse(data) as BoardDataDto;
        const boardData = boardDataFromApi(dtoData);

        // 验证数据格式（UUID 格式）
        if (!isValidBoardData(boardData)) {
          console.log('Invalid data format (non-UUID IDs), clearing cache');
          this.clearBoard();
          return { ...INITIAL_DATA };
        }

        return boardData;
      }
      return { ...INITIAL_DATA };
    } catch (error) {
      console.error('Failed to load from localStorage, using initial data', error);
      return { ...INITIAL_DATA };
    }
  },

  /**
   * 比较本地和云端数据，决定是否需要同步
   * 导出 shouldSyncData 函数供外部使用
   */
  shouldSyncData: shouldSyncData,

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
    localStorage.removeItem(DATA_VERSION_KEY);
  },

  /**
   * 清除所有看板相关缓存
   */
  clearAllCache(): void {
    this.clearBoard();
  },
};

export default StorageService;
