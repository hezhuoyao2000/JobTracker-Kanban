import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { StorageService } from './StorageService';
import { BoardService } from './BoardService';
import { BoardData } from '../../../services/types/frontendtypes/frontend';
import { INITIAL_DATA } from './initialData';

/** 测试用：在 Node 环境模拟 localStorage，避免 "localStorage is not defined" */
function setupLocalStorageMock() {
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { for (const k of Object.keys(store)) delete store[k]; },
      get length() { return Object.keys(store).length; },
      key: (i: number) => Object.keys(store)[i] ?? null,
    },
    writable: true,
  });
}

const mockBoard: BoardData = {
  columns: INITIAL_DATA.columns,
  cards: [],
};

describe('StorageService 存储与 Date 反序列化', () => {
  beforeAll(setupLocalStorageMock);

  beforeEach(() => {
    StorageService.clearBoard();
  });

  it('本地无数据时 loadBoard 应返回带假数据的看板（仅展示，不写入存储）', () => {
    const loaded = StorageService.loadBoard();
    expect(loaded.columns.length).toBe(INITIAL_DATA.columns.length);
    expect(loaded.cards.length).toBeGreaterThan(0);
  });

  it('saveBoard 后 loadBoard 应得到相同结构', () => {
    const withCard = BoardService.addJob(mockBoard, '前端', '某司', mockBoard.columns[0].id);
    StorageService.saveBoard(withCard);
    const loaded = StorageService.loadBoard();
    expect(loaded.cards.length).toBe(1);
    expect(loaded.cards[0].jobTitle).toBe('前端');
    expect(loaded.cards[0].companyName).toBe('某司');
  });

  it('loadBoard 后卡片的 createdAt/updatedAt 应为 Date 实例', () => {
    const withCard = BoardService.addJob(mockBoard, '测试', '公司', mockBoard.columns[0].id);
    StorageService.saveBoard(withCard);
    const loaded = StorageService.loadBoard();
    const card = loaded.cards[0];
    expect(card).toBeDefined();
    expect(card!.createdAt).toBeInstanceOf(Date);
    expect(card!.updatedAt).toBeInstanceOf(Date);
  });
});
