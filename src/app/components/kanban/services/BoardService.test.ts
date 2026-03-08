import { describe, it, expect } from 'vitest';
import { BoardService } from './BoardService';
import { BoardData } from '../../../services/types/frontendtypes/frontend';

describe('BoardService 逻辑测试', () => {
  const TEST_BOARD_ID = 'board-test';

  // 准备一个干净的初始 Mock 数据
  const mockBoard: BoardData = {
    board: {
      id: TEST_BOARD_ID,
      userId: 'user-test',
      name: 'Test Board',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    columns: [
      { id: 'col-1', boardId: TEST_BOARD_ID, name: '准备投递', order: 1, isDefault: true },
      { id: 'col-2', boardId: TEST_BOARD_ID, name: '已投递', order: 2, isDefault: true }
    ],
    cards: []
  };

  it('应该能正确添加一张卡片', async () => {
    const nextBoard = await BoardService.addJob(mockBoard, '前端工程师', 'Google', 'col-1');

    // 验证：卡片数量是否变为 1
    expect(nextBoard.cards.length).toBe(1);
    // 验证：内容是否匹配
    expect(nextBoard.cards[0].jobTitle).toBe('前端工程师');
    expect(nextBoard.cards[0].companyName).toBe('Google');
    // 验证：ID 是否自动生成（UUID长度通常为36）
    expect(nextBoard.cards[0].id).toBeDefined();
  });

  it('应该能正确添加一张卡片并传递可选字段', async () => {
    const nextBoard = await BoardService.addJob(mockBoard, '前端工程师', 'Google', 'col-1', {
      jobLink: 'https://www.google.com',
      sourcePlatform: 'LinkedIn',
      expired: true,
      jobLocation: 'San Francisco',
    });

    expect(nextBoard.cards.length).toBe(1);
    expect(nextBoard.cards[0].jobLink).toBe('https://www.google.com');
    expect(nextBoard.cards[0].sourcePlatform).toBe('LinkedIn');
    expect(nextBoard.cards[0].expired).toBe(true);
    expect(nextBoard.cards[0].jobLocation).toBe('San Francisco');
  });

  it('应该能跨列移动卡片', async () => {
    // 1. 先造一个带卡片的看板
    const boardWithCard = await BoardService.addJob(mockBoard, '后端', 'Amazon', 'col-1');
    const cardId = boardWithCard.cards[0].id;

    // 2. 执行移动操作
    const nextBoard = await BoardService.moveCard(boardWithCard, cardId, 'col-2');

    // 3. 验证
    const movedCard = nextBoard.cards.find(c => c.id === cardId);
    expect(movedCard?.statusId).toBe('col-2');
  });

  it('应该能局部更新卡片内容而不破坏其他字段', async () => {
    const boardWithCard = await BoardService.addJob(mockBoard, '测试', 'Apple', 'col-1');
    const cardId = boardWithCard.cards[0].id;

    // 更新备注
    const nextBoard = await BoardService.updateCard(boardWithCard, cardId, { comments: '薪资很高' });

    const updatedCard = nextBoard.cards.find(c => c.id === cardId);
    expect(updatedCard?.comments).toBe('薪资很高');
    expect(updatedCard?.jobTitle).toBe('测试'); // 原有字段应保持不变
  });

  it('应该能根据 ID 删除卡片', async () => {
    const boardWithCard = await BoardService.addJob(mockBoard, '待删岗位', 'None', 'col-1');
    const cardId = boardWithCard.cards[0].id;

    const nextBoard = await BoardService.deleteCard(boardWithCard, cardId);

    expect(nextBoard.cards.length).toBe(0);
  });
});
