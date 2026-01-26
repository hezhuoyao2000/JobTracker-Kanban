import { BoardData, JobCard } from '../../../services/types/frontendtypes/frontend';

export const BoardService = {
    //移动卡片位置，改变状态
    moveCard(board: BoardData, cardId: string, targetColumnId: string): BoardData {
        return {
          ...board,
          cards: board.cards.map(card => 
            card.id === cardId ? { ...card, statusId: targetColumnId } : card
          )
        };
    },

    //添加一张卡片
    addJob(board: BoardData, jobtitle: string, companyName: string, statusId: string): BoardData {
        
        const newCard: JobCard = {
            id: crypto.randomUUID(),
            jobTitle: jobtitle,
            companyName: companyName,
            statusId: statusId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return {
            ...board,
            cards: [...board.cards, newCard]
        };
    },
    
    //更新卡片内容
    updateCard(board: BoardData, cardId: string, updates: Partial<JobCard>): BoardData {
        return{
            ...board,
            cards: board.cards.map(card =>
                card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
            )
        }
    },
    
    //删除一张卡片
    deleteCard(board: BoardData, cardId: string): BoardData {
        return {
            ...board,
            cards: board.cards.filter(card => card.id !== cardId)
        };
    },

    //自定义排序
};
