import {Message} from "@arco-design/web-vue";
import {getDownloadUrlById} from "@/api/attachment";
import {isJSON} from "@/utils/is";

/* 过滤条件 */
export interface PageQueryFilter {
  id: string;
  createdTime: string;
}

/* 列表参数 */
export interface PageQueryRequest extends Partial<PageQueryFilter> {
  current: number;
  pageSize: number;
}

/* 列表返回结果 */
export interface PageQueryResponse {
  items: PageQueryFilter[];
  total: number;
}

/* 返回结果 */
export interface QueryResult {
  data: any;
  msg: string;
  code: number;
  status: string;
}

/* 树状列表 */
export interface SelectOption {
  value: string | number | Record<string, any>;
  label: string;
  isLeaf?: boolean; // 是否是叶子节点
  disabled?: boolean; // 是否不可选
  children?: SelectOption[]
}

/* 页面传递参数 */
export interface ListUrlParams {
  action: 'add' | 'edit' | 'view'; // 页面状态 formState
  isModal?: boolean; // 是否被引用为表单，list
  formCol?: 1 | 2; // 表单单行或双行，model
  pageSize?: 5 | 10 | 20 | 50 | 100 | 1000 | 10000; // 每页数量，list
  id?: string; // 表单主键id，model
  params?: Record<string, any>; // 参数
  closeBack?: any; // 页面关闭传递参数
  loadSuccessBack?: any; // 页面加载成功，model
  loadFailBack?: any; // 页面加载失败，model
  modalAddBack?: any; // 页面 新增按钮反馈，list
  modalEditBack?: any; //  页面 编辑按钮反馈，list
  modalDeleteBack?: any; //  页面 删除按钮反馈，list
}

/* base64参数 */
export interface Base64FileParams {
  name: string;
  size: number;
  type: string;
  base64: string;
}

/**
 * 检验文件是否存在，下载文件
 * @param id 文件id
 */
export const fetchFileById = (id: string, fetchFailed?: any) => {
  const url = getDownloadUrlById(id, false);
  fetch(url).then((response) => {
    if (!response.ok) {
      if (fetchFailed != null && typeof fetchFailed === 'function') {
        fetchFailed();
      } else {
        throw new Error('文件查询失败');
      }
    }
    return response.blob();
  }).then((blob) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.height = '0';
    iframe.src = url;
    document.body.appendChild(iframe);
    // 等待iframe加载完成
    iframe.onload = () => {
      document.body.removeChild(iframe);
    };
    // 等待iframe加载失败
    iframe.onerror = () => {
      document.body.removeChild(iframe);
    }
  }).catch((err) => {
    Message.error({content: (err && err.message) || "文件下载失败", duration: 5 * 1000});
  });
}

/**
 * 将base64编码的字符串转为文件，并下载
 * @param base64Str
 * @param fileType
 * @param fileName
 */
export const downloadFileByBase64 = (base64Str: string, fileType: string, fileName: string) => {
  try {
    if (!base64Str || !fileType || !fileName) {
      throw new Error("文件下载参数缺失！");
    }
    const decodedData = window.atob(base64Str);
    const binaryData = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i += 1) {
      binaryData[i] = decodedData.charCodeAt(i);
    }
    // 创建Blob对象
    const blob = new Blob([binaryData], {type: fileType});
    // 获取Blob对象的URL
    const url = URL.createObjectURL(blob);
    // 下载文件
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    Message.error({content: (err && err.message) || "文件下载失败", duration: 5 * 1000});
  }
}

export const downloadFileByBase65 = (baseData: Base64FileParams) => {
  downloadFileByBase64(baseData.base64, baseData.type, baseData.name);
}

export const downloadFileByBase66 = (base64String: string) => {
  if (base64String && isJSON(base64String)) {
    // 解码Base64字符串
    const data: Base64FileParams = JSON.parse(base64String);
    // 下载文件
    downloadFileByBase65(data);
  }
}

/**
 * 检查文件是否存在，将文件转为base64编码字符串
 * @param id
 * @param callBack
 */
export const fetchFileToBase64 = async (id: string, callBack?: any) => {
  const url = getDownloadUrlById(id, false);
  try {
    const response = await fetch(url);
    if (response.ok) {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (callBack != null && typeof callBack === 'function') {
          callBack(reader.result);
        }
      };
      reader.readAsDataURL(await response.blob());
    } else {
      throw new Error('文件查询失败');
    }
  } catch (err) {
    // @ts-ignore
    Message.error({content: (err && err.message) || "文件转Base64失败", duration: 5 * 1000});
  }
}