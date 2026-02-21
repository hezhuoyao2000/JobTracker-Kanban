/**
 * 后端类型定义
 * 对应 Java Spring Boot 后端的 DTO/Entity 结构
 * 字段命名遵循 Java camelCase 规范，Date 字段使用 ISO 8601 字符串格式
 */

/**
 * 看板 DTO
 */
export interface BoardDto {
    id: string;
    userId: string;
    name: string;
    createdAt: string;              // ISO 8601 格式：2026-02-20T10:30:00Z
    updatedAt: string;
}

/**
 * 列（状态列）DTO
 */
export interface ColumnDto {
    id: string;
    boardId: string;
    name: string;
    order: number;
    isDefault: boolean;
    customAttributes?: Record<string, unknown>;
}

/**
 * 职位卡片 DTO
 */
export interface JobCardDto {
    id: string;
    boardId: string;
    jobTitle: string;
    statusId: string;               // 所在列ID
    companyName: string;
    jobLink?: string;
    sourcePlatform?: string;
    expired?: boolean;
    jobLocation?: string;
    description?: string;
    appliedTime?: string;           // ISO 8601 格式
    tags?: string[];
    comments?: string;
    extra?: {
        contactInfo?: string;
        file?: string[];
    };
    createdAt?: string;             // ISO 8601 格式
    updatedAt?: string;             // ISO 8601 格式
    deletedAt?: string;             // ISO 8601 格式，软删除时间戳
}

/**
 * 看板完整数据 DTO（后端返回的完整看板数据）
 */
export interface BoardDataDto {
    board: BoardDto;
    columns: ColumnDto[];
    cards: JobCardDto[];
}





/**
 * 创建看板请求 DTO
 */
export interface CreateBoardRequestDto {
    name: string;
}

/**
 * 创建卡片请求 DTO
 */
export interface CreateCardRequestDto {
    boardId: string;
    statusId: string;
    jobTitle: string;
    companyName: string;
    jobLink?: string;
    sourcePlatform?: string;
    expired?: boolean;
    jobLocation?: string;
    description?: string;
    appliedTime?: string;
    tags?: string[];
    comments?: string;
    extra?: {
        contactInfo?: string;
        file?: string[];
    };
}

/**
 * 更新卡片请求 DTO（只传需要更新的字段）
 */
export interface UpdateCardRequestDto {
    cardId: string;
    jobTitle?: string;
    statusId?: string;
    companyName?: string;
    jobLink?: string;
    sourcePlatform?: string;
    expired?: boolean;
    jobLocation?: string;
    description?: string;
    appliedTime?: string;
    tags?: string[];
    comments?: string;
    extra?: {
        contactInfo?: string;
        file?: string[];
    };
}

/**
 * 移动卡片请求 DTO
 */
export interface MoveCardRequestDto {
    cardId: string;
    targetStatusId: string;
}

/**
 * 软删除卡片请求 DTO
 */
export interface DeleteCardRequestDto {
    cardId: string;
}

/**
 * 更新列请求 DTO
 */
export interface UpdateColumnRequestDto {
    columnId: string;
    name?: string;
    order?: number;
    customAttributes?: Record<string, unknown>;
}

/**
 * 加载看板请求 DTO（通过 JWT 获取 userId，或显式传 userId）
 */
export interface LoadBoardRequestDto {
    userId?: string;                // 可选，后端优先从 JWT 获取
    boardId?: string;              // 可选，如果传了 boardId 则加载指定看板
}
