/**
 * 前端类型定义
 * 用于前端应用内部的数据结构，使用 Date 对象、camelCase 命名
 */

/**
 * 看板实体
 */
export interface Board {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 列（状态列）
 */
export interface Column {
    id: string;
    boardId: string;              // 归属看板ID
    name: string;
    order: number;
    isDefault: boolean;
    /** 预留：后续可扩展自定义属性、拖拽 id、排序权重等，便于列可配置、可拖动排序 */
    customAttributes?: Record<string, unknown>;
}

/**
 * 职位卡片
 */
export interface JobCard {
    // --- 必选项 ---
    id: string;
    boardId: string;              // 归属看板ID
    jobTitle: string;
    statusId: string;             // 所在列ID（外键 → Column.id）
    companyName: string;          // 公司名称
    // --- 可选项 ---
    jobLink?: string;             // 职位链接
    sourcePlatform?: string;       // 来源平台
    expired?: boolean;             // 是否过期
    jobLocation?: string;          // 工作地点
    description?: string;          // 职位描述

    appliedTime?: Date;            // 投递时间
    tags?: string[];               // 标签
    comments?: string;             // 自定义注释

    extra?: {
        contactInfo?: string;      // 联系信息
        file?: string[];           // 文件
    }

    // --- 自动生成项目 ---
    createdAt?: Date;              // 卡片创建时间
    updatedAt?: Date;              // 本卡片更新时间
    deletedAt?: Date;              // 软删除时间戳（未删除时为 undefined）
}

/**
 * 看板完整数据（包含看板信息、列和卡片）
 */
export interface BoardData {
    board: Board;
    columns: Column[];
    cards: JobCard[];
}