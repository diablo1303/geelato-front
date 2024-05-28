import {TreeNodeData} from "@arco-design/web-vue";
import {diffJson} from "diff";
import {isJSON} from "@/utils/is";

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

export type LayoutHeight = {
  left: number;
  center: number;
  right: number;
}

export interface TreeNodeModel extends TreeNodeData {
  level?: number;
  mark?: string;// 标记
  type?: number;// 0 相同,1 新增,2 删除,3 编辑
  subChange?: boolean;// 子项是否变更
  data?: Record<string, any>;
  children?: TreeNodeModel[];
}

export type TreeLevelData = {
  tree?: TreeNodeModel[];
  first?: Record<string, any>[];
  second?: Record<string, any>[];
  third?: Record<string, any>[];
  four?: Record<string, any>[];
  fifth?: Record<string, any>[];
  sixth?: Record<string, any>[];
}

export interface DiffModel {
  id: string;
  title: string;
  newObject: Record<string, any>;
  newHeader: string;
  oldObject: Record<string, any>;
  oldHeader: string;
}


/**
 * left 基准,right 对比
 * @param dir
 */
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
 * 生成布局高度
 * @param height
 */
export const generateLayoutHeight = (height: number, left?: number, center?: number, right?: number): LayoutHeight => {
  return {"left": height - (left || 105), "center": height - (center || 75), "right": height - (right || 105),}
}

/**
 * 生成对比参数
 * @param params
 */
export const generateDiffParams = (params?: Record<string, any>): DiffModel => {
  const data: DiffModel = {
    id: 'id-diff-html',
    title: '',
    newObject: {},
    oldObject: {},
    newHeader: directions('left'),
    oldHeader: directions('right'),
  }
  return Object.assign(data, params || {});
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

/**
 * 点击树节点,根节点
 * @param direction
 * @param selectedKeys
 * @param node
 */
export const treeClickZerothLevel = (direction: string, selectedKeys: string[], node: TreeNodeModel) => {
  selectedKeys = [node?.key as string];
  /* Object.assign(diffParams.value, {
    title: rootNode.title,
    newObject: treeLeftData.value[0].children,
    oldObject: treeRightData.value[0].children,
  }); */
}

/**
 * 点击树节点,业务数据节点
 * @param direction
 * @param selectedKeys
 * @param node
 * @param diffParams
 * @param newData
 * @param oldData
 */
export const treeClickFirstLevel = (direction: string, selectedKeys: string[], node: TreeNodeModel, diffParams: DiffModel, newData: Record<string, any>[], oldData: Record<string, any>[]) => {
  if (node.type === 1) { // 添加，左侧点击
    diffParams.newObject = node.data || {};
  } else if (node.type === 0 || node.type === 2) {// 修改
    selectedKeys = [node.key as string];
    if (direction === 'left') {
      Object.assign(diffParams, {
        newObject: node.data || {},
        oldObject: oldData.find(item => item.id === node?.key) || {}
      });
    } else if (direction === 'right') {
      Object.assign(diffParams, {
        newObject: newData.find(item => item.id === node?.key) || {},
        oldObject: node.data || {},
      });
    }
  } else if (node.type === 3) {// 删除,右侧点击
    diffParams.oldObject = node.data || {};
  }
}

/**
 * 字符串，截取前后，中间用...代替
 * @param title
 * @param prefixLength
 * @param suffixLength
 */
export const truncateString = (title: string, prefixLength = 4, suffixLength = 10) => {
  if (title && title.length > prefixLength + suffixLength + 3) {
    return `${title.slice(0, prefixLength)}...${title.slice(-suffixLength)}`;
  }
  return title;
}

/**
 * 判断是否为json字符串，是则解析，否则返回原值
 * @param jsonText
 */
export const parseJson = (jsonText: string) => {
  if (isJSON(jsonText)) {
    return JSON.parse(jsonText);
  }
  return jsonText;
}

/**
 * 树，循环对比
 * @param data
 * @param keyword
 */
export const treeSearchLoop = (data: TreeNodeData[], keyword: string) => {
  const result: TreeNodeData[] = [];
  data.forEach(item => {
    if (item.title && item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
      result.push({...item});
    } else if (item.children) {
      const filterData = treeSearchLoop(item.children, keyword);
      if (filterData.length) result.push({...item, children: filterData})
    }
  })
  return result;
}

/**
 * 树，搜索, 搜索结果高亮
 * @param title
 * @param keyword
 */
export const getMatchIndex = (title: string, keyword: string) => {
  if (!keyword) return -1;
  return title.toLowerCase().indexOf(keyword.toLowerCase());
}