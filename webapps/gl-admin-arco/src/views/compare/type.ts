import {TreeNodeData} from "@arco-design/web-vue";
import {diffJson} from "diff";

export type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

export type AppMeta = {
  metaName: string;
  metaData: Record<string, any>[]
}

export type AppVersion = {
  appCode: string;
  appMetaList: AppMeta[];
  appResourceList: Record<string, any>[];
  sourceAppId: string;
  targetAppId: string;
}

export interface TreeNodeModel extends TreeNodeData {
  data?: Record<string, any>;
  level?: number;
  type?: number;// 0 相同,1 新增,2 删除,3 编辑
  subChange?: boolean;// 子项是否变更
  children?: TreeNodeModel[];
}

export interface DiffModel {
  title: string;
  newObject: Record<string, any>;
  newHeader: string;
  oldObject: Record<string, any>;
  oldHeader: string;
}

export const directions = (dir: string) => {
  if (dir === 'left') {
    return "基准";
  }
  if (dir === 'right') {
    return "对比";
  }
  return "";
}

/**
 * 0 相同,1 新增,2 编辑,3 删除
 * @param record 基准数据
 * @param data 对比数据
 * @param direction 方向 left，right
 */
export const queryCompareType = (record: Record<string, any>, data: Record<string, any>[], direction: string): number => {
  if (data && data.length > 0) {
    const isExist = data.find(item => item.id === record.id);
    if (isExist && typeof isExist === 'object') {
      const isCompare = diffJson(JSON.stringify(isExist), JSON.stringify(record));
      if (isCompare && isCompare.length >= 2) {
        return 2;
      }
      return 0;
    }
    return direction === 'right' ? 3 : 1;// 不存在为：新增
  }
  return direction === 'right' ? 3 : 1;// 不存在为：新增
}