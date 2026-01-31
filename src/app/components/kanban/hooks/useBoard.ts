import {useState, useEffect} from 'react';
import {BoardData, JobCard} from '../../../services/types/frontendtypes/frontend';
import {BoardService} from '../services/BoardService';
import {StorageService} from '../services/StorageService';
import {INITIAL_DATA} from '../services/initialData';

export const useBoard = () => {
    // 1. 初始化：使用常量确保 SSR 与客户端首次渲染一致，避免 hydration mismatch
    const [board, setBoard] = useState<BoardData>(() => ({...INITIAL_DATA}));

    // 2. 仅在客户端挂载后从 localStorage 加载（localStorage 仅存在于浏览器）
    // 使用 queueMicrotask 延迟 setState，避免在 effect 内同步触发导致 cascading renders
    useEffect(() => {
        queueMicrotask(() => setBoard(StorageService.loadBoard()));
    }, []);

    // 3. 封装 Service 动作

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