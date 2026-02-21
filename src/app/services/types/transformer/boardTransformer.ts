/**
 * 看板相关类型转换器
 * 通用日期转换 + 薄封装，新增/修改字段只需维护 DATE_KEYS 常量和类型定义
 */

import type { Board, Column, JobCard, BoardData } from '../frontendtypes/frontend';
import type {
    BoardDto, ColumnDto, JobCardDto, BoardDataDto,
    CreateCardRequestDto, UpdateCardRequestDto,
    MoveCardRequestDto, DeleteCardRequestDto,
} from '../backendtypes/backend';

// ==================== 日期字段常量（维护点：新增日期字段只需在这里加 key）====================

const BOARD_DATE_KEYS: ReadonlyArray<string> = ['createdAt', 'updatedAt'];
const CARD_DATE_KEYS: ReadonlyArray<string> = ['appliedTime', 'createdAt', 'updatedAt', 'deletedAt'];

// ==================== 通用工具函数 ====================

/** 浅拷贝对象，将指定 key 的 ISO 8601 字符串解析为 Date 对象 */
function parseIsoToDates<R>(obj: object, dateKeys: ReadonlyArray<string>): R {
    const result: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
    for (const key of dateKeys) {
        const val = result[key];
        if (typeof val === 'string') {
            const d = new Date(val);
            if (!Number.isNaN(d.getTime())) result[key] = d;
        }
    }
    return result as unknown as R;
}

/** 浅拷贝对象，将指定 key 的 Date 序列化为 ISO 8601 字符串 */
function datesToIso<R>(obj: object, dateKeys: ReadonlyArray<string>): R {
    const result: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
    for (const key of dateKeys) {
        const val = result[key];
        if (val instanceof Date) result[key] = val.toISOString();
    }
    return result as unknown as R;
}

/** 浅拷贝对象并排除指定 key */
function omitKeys(obj: object, keys: ReadonlyArray<string>): Record<string, unknown> {
    const result: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
    for (const key of keys) delete result[key];
    return result;
}

// ==================== API 响应 → 前端（反序列化）====================

export function boardFromApi(dto: BoardDto): Board {
    return parseIsoToDates<Board>(dto, BOARD_DATE_KEYS);
}

/** Column 前后端结构一致，无日期字段，直接透传 */
export function columnFromApi(dto: ColumnDto): Column {
    return { ...dto };
}

export function jobCardFromApi(dto: JobCardDto): JobCard {
    return parseIsoToDates<JobCard>(dto, CARD_DATE_KEYS);
}

export function boardDataFromApi(dto: BoardDataDto): BoardData {
    return {
        board: boardFromApi(dto.board),
        columns: dto.columns.map(columnFromApi),
        cards: dto.cards.map(jobCardFromApi),
    };
}

// ==================== 前端 → API 请求（序列化）====================

/** 新建卡片：排除自动生成字段，日期转 ISO */
export function toCreateCardRequest(
    card: Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
): CreateCardRequestDto {
    return datesToIso<CreateCardRequestDto>(card, CARD_DATE_KEYS);
}

/** 更新卡片：只传变更字段 + cardId，日期转 ISO */
export function toUpdateCardRequest(
    cardId: string,
    updates: Partial<Omit<JobCard, 'id' | 'boardId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>
): UpdateCardRequestDto {
    return {
        cardId,
        ...datesToIso<Omit<UpdateCardRequestDto, 'cardId'>>(updates, CARD_DATE_KEYS),
    };
}

export function toMoveCardRequest(cardId: string, targetStatusId: string): MoveCardRequestDto {
    return { cardId, targetStatusId };
}

export function toDeleteCardRequest(cardId: string): DeleteCardRequestDto {
    return { cardId };
}

// ==================== 前端 → API 完整数据（序列化，用于 localStorage 兼容等）====================

export function boardDataToApi(data: BoardData): BoardDataDto {
    return {
        board: datesToIso<BoardDto>(data.board, BOARD_DATE_KEYS),
        columns: data.columns.map((col) => ({ ...col }) as ColumnDto),
        cards: data.cards.map((card) =>
            datesToIso<JobCardDto>(omitKeys(card, []), CARD_DATE_KEYS)
        ),
    };
}
