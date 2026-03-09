/**
 * 看板相关类型转换器
 * 通用日期转换 + 薄封装，新增/修改字段只需维护 DATE_KEYS 常量和类型定义
 *
 * 特殊字段处理:
 * - tags: 后端 Response 返回逗号分隔字符串，Request 发送数组
 * - extra: 后端 Response 返回 JSON 字符串，Request 发送对象
 */

import type { Board, Column, JobCard, BoardData } from '../frontendtypes/frontend';
import type {
    BoardDto, ColumnDto, JobCardDto, BoardDataDto,
    CreateCardRequestDto, UpdateCardRequestDto,
    MoveCardRequestDto, DeleteCardRequestDto,
    CreateBoardRequestDto,
    UpdateColumnRequestDto,
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

/** Column：后端 sortOrder → 前端 order（字段名映射） */
export function columnFromApi(dto: ColumnDto): Column {
    return {
        id: dto.id,
        boardId: dto.boardId,
        name: dto.name,
        order: dto.sortOrder,           // sortOrder → order
        isDefault: dto.isDefault,
        customAttributes: dto.customAttributes,
    };
}

export function jobCardFromApi(dto: JobCardDto): JobCard {
    const card = parseIsoToDates<JobCard>(dto, CARD_DATE_KEYS);

    // 处理 tags: 后端返回逗号分隔字符串 -> 前端使用数组
    if (typeof dto.tags === 'string') {
        card.tags = dto.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    } else if (dto.tags === null || dto.tags === undefined) {
        card.tags = undefined;
    }

    // 处理 extra: 后端返回 JSON 字符串 -> 前端使用对象
    if (typeof dto.extra === 'string') {
        try {
            card.extra = JSON.parse(dto.extra);
        } catch {
            card.extra = undefined;
        }
    } else if (dto.extra === null || dto.extra === undefined) {
        card.extra = undefined;
    }

    return card;
}

export function boardDataFromApi(dto: BoardDataDto): BoardData {
    return {
        board: boardFromApi(dto.board),
        columns: dto.columns.map(columnFromApi),
        cards: dto.cards.map(jobCardFromApi),
    };
}

// ==================== 前端 → API 请求（序列化）====================

/** 新建看板请求 */
export function toCreateBoardRequest(name?: string): CreateBoardRequestDto {
    const request: CreateBoardRequestDto = {};
    if (name) {
        request.name = name;
    }
    return request;
}

/**
 * 新建卡片请求
 * 前端 JobCard 的 extra 是对象，tags 是数组，与后端 Request DTO 一致，无需转换
 * 只需处理日期转 ISO
 */
export function toCreateCardRequest(
    card: Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
): CreateCardRequestDto {
    const result: Record<string, unknown> = {};

    // 复制必填字段
    result.boardId = card.boardId;
    result.statusId = card.statusId;
    result.jobTitle = card.jobTitle;
    result.companyName = card.companyName;

    // 复制可选字段
    const optionalFields = ['jobLink', 'sourcePlatform', 'expired', 'jobLocation', 'description', 'tags', 'comments', 'extra'] as const;
    for (const key of optionalFields) {
        if (card[key] !== undefined) {
            result[key] = card[key];
        }
    }

    // 处理日期字段转 ISO
    if (card.appliedTime instanceof Date) {
        result.appliedTime = card.appliedTime.toISOString();
    }

    return result as unknown as CreateCardRequestDto;
}

/**
 * 更新卡片请求
 * 只传变更字段 + cardId，日期转 ISO
 * tags 和 extra 保持原格式（数组和对象）
 */
export function toUpdateCardRequest(
    cardId: string,
    updates: Partial<Omit<JobCard, 'id' | 'boardId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>
): UpdateCardRequestDto {
    const result: Record<string, unknown> = { cardId };

    // 复制变更字段
    const optionalFields = ['jobTitle', 'statusId', 'companyName', 'jobLink', 'sourcePlatform', 'expired', 'jobLocation', 'description', 'tags', 'comments', 'extra'] as const;
    for (const key of optionalFields) {
        if (updates[key] !== undefined) {
            result[key] = updates[key];
        }
    }

    // 处理日期字段转 ISO
    if (updates.appliedTime instanceof Date) {
        result.appliedTime = updates.appliedTime.toISOString();
    }

    return result as unknown as UpdateCardRequestDto;
}

export function toMoveCardRequest(cardId: string, targetStatusId: string): MoveCardRequestDto {
    return { cardId, targetStatusId };
}

export function toDeleteCardRequest(cardId: string): DeleteCardRequestDto {
    return { cardId };
}

/** 更新列请求 */
export function toUpdateColumnRequest(
    columnId: string,
    updates: Partial<Omit<Column, 'id' | 'boardId'>>
): UpdateColumnRequestDto {
    const request: UpdateColumnRequestDto = {
        columnId,
    };
    
    if (updates.name !== undefined) {
        request.name = updates.name;
    }
    
    if (updates.order !== undefined) {
        request.sortOrder = updates.order;
    }
    
    if (updates.customAttributes !== undefined) {
        request.customAttributes = updates.customAttributes;
    }
    
    return request;
}

// ==================== 前端 → API 完整数据（序列化，用于 localStorage 兼容等）====================

/**
 * 将前端 BoardData 转换为后端 BoardDataDto 格式
 * 用于 localStorage 存储，保持与后端 Response 格式一致
 */
export function boardDataToApi(data: BoardData): BoardDataDto {
    return {
        board: datesToIso<BoardDto>(data.board, BOARD_DATE_KEYS),
        columns: data.columns.map((col) => ({
            id: col.id,
            boardId: col.boardId,
            name: col.name,
            sortOrder: col.order,       // order → sortOrder
            isDefault: col.isDefault,
            customAttributes: col.customAttributes,
        })),
        cards: data.cards.map((card) => {
            // 基础字段转换（日期转 ISO）
            const baseDto = datesToIso<Record<string, unknown>>(
                omitKeys(card, ['tags', 'extra', 'boardId']),
                CARD_DATE_KEYS
            );

            const dto: JobCardDto = {
                id: card.id,
                boardId: card.boardId,
                jobTitle: card.jobTitle,
                statusId: card.statusId,
                companyName: card.companyName,
                jobLink: card.jobLink,
                sourcePlatform: card.sourcePlatform,
                expired: card.expired,
                jobLocation: card.jobLocation,
                description: card.description,
                appliedTime: baseDto.appliedTime as string | undefined,
                createdAt: baseDto.createdAt as string | undefined,
                updatedAt: baseDto.updatedAt as string | undefined,
                deletedAt: baseDto.deletedAt as string | undefined,
                // 处理 tags: 前端数组 -> 后端逗号分隔字符串
                tags: Array.isArray(card.tags) && card.tags.length > 0 ? card.tags.join(',') : null,
                // 处理 comments
                comments: card.comments ?? null,
                // 处理 extra: 前端对象 -> 后端 JSON 字符串
                extra: (card.extra && typeof card.extra === 'object') ? JSON.stringify(card.extra) : null,
            };

            return dto;
        }),
    };
}
