import {useState} from 'react';
import {BoardData, JobCard} from '../../../services/types/frontendtypes/frontend';
import {BoardService} from '../services/BoardService';
import {StorageService} from '../services/StorageService';

export const useBoard = () => {
    // 1. 初始化：从本地读取（使用懒初始化避免在 effect 中同步设置状态）
    const [board, setBoard] = useState<BoardData>(() => StorageService.loadBoard());

    // 2. 封装 Service 动作

    // 添加一张卡片
    const handleAddJob = (
        title: string, 
        company: string, 
        columnId: string,
        options?: Partial<Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'jobTitle' | 'companyName' | 'statusId'>>
    ) => {
        const newBoard = BoardService.addJob(board, title, company, columnId, options);
        setBoard(newBoard);
        StorageService.saveBoard(newBoard);     //同步到本地
    }

    // 移动卡片
    const handleMoveCard = (cardId: string, targetColId: string) => {
        const newBoard = BoardService.moveCard(board, cardId, targetColId);
        setBoard(newBoard);
        StorageService.saveBoard(newBoard);
    };

    // 更新卡片
    const handleUpdateCard = (
        cardId: string, 
        updates: Partial<JobCard>
    ) => {
        const newBoard = BoardService.updateCard(board, cardId, updates);
        setBoard(newBoard);
        StorageService.saveBoard(newBoard); 
    };

    // 删除卡片
    const handleDeleteCard = (cardId: string) => {
        const newBoard = BoardService.deleteCard(board, cardId);

        setBoard(newBoard);
        StorageService.saveBoard(newBoard); 
    }

    return {
        board,
        handleAddJob,
        handleMoveCard,
        handleUpdateCard,
        handleDeleteCard
    };
};