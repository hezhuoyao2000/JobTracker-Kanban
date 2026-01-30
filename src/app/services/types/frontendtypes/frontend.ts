/**
 * 前端类型定义
 * 待定义任务流看板相关类型
 */
export interface JobCard {
    // --- 必选项 ---
    id: string;
    jobTitle: string;
    statusId: string;           //投递状态ID
    companyName: string;        //公司名称
    // --- 可选项 ---
    jobLink?: string;            //职位链接
    sourcePlatform?: string;     //来源平台
    expired?: boolean;           //是否过期
    jobLocation?: string;        //工作地点
    description?: string;        //职位描述

    appliedTime?: Date;          //投递时间
    tags?: string[];             //标签
    comments?: string;           //自定义注释

    extra?: {
        contactInfo?: string;        //联系信息
        file?: string[];                //文件
    }

    // --- 自动生成项目 ---
    createdAt?: Date;            //卡片创建时间
    updatedAt?: Date;            //本卡片更新时间
}

export interface Column {
    id: string;
    name: string;
    order: number;
    isDefault: boolean;
    /** 预留：后续可扩展自定义属性、拖拽 id、排序权重等，便于列可配置、可拖动排序 */
    customAttributes?: Record<string, unknown>;
}

export interface BoardData {
    columns: Column[];
    cards: JobCard[];
  }