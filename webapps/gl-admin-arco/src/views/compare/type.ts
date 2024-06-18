import {type SelectOptionData, TreeNodeData} from "@arco-design/web-vue";
import {diffJson} from "diff";
import {isJSON} from "@/utils/is";
import {computed} from "vue";

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
  isDel?: boolean;// 是否删除
  data?: Record<string, any>;
  children?: TreeNodeModel[];
}

export type TreeLevelData = {
  level?: Record<number, string>;
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

export const typeSelectOptions = computed<SelectOptionData[]>(() => [
  {label: '相同', value: '0',},
  {label: '新增', value: '1',},
  {label: '修改', value: '2',},
  {label: '删除', value: '3',},
]);


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
      const isCompare = diffJson(isExist, record);
      if (isCompare && isCompare.length >= 2) {
        return record.del_status === 1 ? 3 : 2;
      }
      return record.del_status === 1 ? 4 : 0;
    }
    return 1;// 不存在为：新增
  }
  return 1;// 不存在为：新增
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
 * @param item
 * @param keyword
 * @param selected
 */
const treeSearchCompare = (item: TreeNodeModel, keyword: string, selected: string) => {
  if (!!keyword && selected === '') {
    return item.title && item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
  }
  if (!keyword && selected !== '') {
    return item.type === Number(selected);
  }
  if (!!keyword && selected !== '') {
    return item.title && item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1 && item.type === Number(selected);
  }
  return false;
}

/**
 * 树，循环对比
 * @param data
 * @param keyword
 * @param selected
 */
export const treeSearchLoop = (data: TreeNodeModel[], keyword: string, selected: string) => {
  const result: TreeNodeModel[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    if (treeSearchCompare(item, keyword, selected)) {
      result.push({...item});
    } else if (item.children && item.children.length > 0) {
      const filterData = treeSearchLoop(item.children, keyword, selected);
      if (filterData.length) result.push({...item, children: filterData})
    }
  }

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

/**
 * 排序数据处理,update_at|asc,del_status|asc
 * @param sorter
 */
const sorterFormat = (sorter: string) => {
  const sorterArr = [];
  const arr = sorter.split(",");
  if (arr.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of arr) {
      const arr1 = item.split("|");
      if (arr1.length === 1) {
        sorterArr.push({key: arr1[0], dir: 'asc'});
      } else if (arr1.length === 2) {
        sorterArr.push({key: arr1[0], dir: arr1[0] === 'desc' ? 'desc' : 'asc'});
      }
    }
  }
  return sorterArr;
}

/**
 * 排序渲染数据
 * @param data
 * @param sorter
 */
export const sortRenderData = (data: Record<string, any>[], sorter: string) => {
  const sorterArr = sorterFormat(sorter);
  if (sorterArr.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of sorterArr) {
      if (['update_at', 'create_at'].includes(item.key)) {
        data.sort((a, b) => {
          if (item.dir === 'desc') {
            return new Date(b[item.key]).getTime() - new Date(a[item.key]).getTime();
          }
          return new Date(a[item.key]).getTime() - new Date(b[item.key]).getTime();
        });
      } else if (typeof data[0][item.key] === 'number') {
        data.sort((a, b) => {
          return item.dir === 'desc' ? b[item.key] - a[item.key] : a[item.key] - b[item.key];
        });
      } else if (typeof data[0][item.key] === 'string') {
        data.sort((a, b) => {
          // eslint-disable-next-line no-nested-ternary
          return a[item.key] > b[item.key] ? (item.dir === 'desc' ? -1 : 1) : (item.dir === 'desc' ? 1 : -1);
        });
      }
    }
  }
}

/**
 * 获取对比结果
 * @param data
 * @param level
 * @param dep
 */
export const getDiffData = (data: TreeNodeModel[], level: Record<string, any>, dep: Record<string, any>) => {
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      // @ts-ignore
      if (item.level > 0 && item.isDel === true) {
        // @ts-ignore
        dep[level[item.level]].push({"key": item.key, "type": item.type});
      }
      if (item.children) getDiffData(item.children, level, dep);
    }
  }
}

/**
 * 对象转换
 * @param record
 */
export const objValueToArray = (record: Record<number, string>) => {
  const data: Record<string, any> = {};
  if (data) {
    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const key in record) {
      // @ts-ignore
      data[record[key]] = [];
    }
  }
  return data;
}