import {getToken} from "@/utils/auth";
import axios from "axios";
import {Message} from "@arco-design/web-vue";
import {isJSON} from "@/utils/is";
import {getUrlParams} from "@/utils/strings";

export interface Base64FileParams {
  name: string;
  size: number;
  type: string;
  base64: string;
}

export interface UploadFileParams {
  tableType?: string;// 所属表
  isRename?: boolean;// 文件重命名，默认：true
  objectId?: string;// 所属业务id
  genre?: string;// 类型
  root?: string;// 根目录
  appId?: string;// 所属应用
  tenantCode?: string;// 所属租户
}

/**
 * 上传插件添加，请求表头
 */
export const uploadHeader = (): Record<string, string> => {
  const token = getToken();
  if (token) {
    return {Authorization: `Bearer ${token}`};
  }
  return {Authorization: ''};
}

/**
 * 上传附件
 * @param params appId,isRename,objectId,genre,root
 */
export function getUploadUrl(params?: Record<string, any>) {
  params = params || {};
  params.isRename = params.isRename !== false;
  const records = getUrlParams(params);
  return `${axios.defaults.baseURL}/api/upload/file?${records.join('&')}`;
}

/**
 * 下载附件
 * @param id 附件id
 */
export function getDownloadUrlById(id: string, isPdf?: boolean, isPreview?: boolean) {
  return id ? `${axios.defaults.baseURL}/api/resources/file?rstk=download&id=${id}&isPdf=${isPdf === true}&isPreview=${isPreview === true}` : '';
}

/**
 * 下载附件
 * @param name 附件名称
 * @param path 附件相对地址
 */
export function getDownloadUrlByPath(name: string, path: string) {
  return name && path ? `${axios.defaults.baseURL}/api/resources/file?rstk=download&name=${name}&path=${path}` : '';
}

/**
 * 获取文件内容
 * @param fileName 文件名称
 */
export function formDataFromFile(fileName: string) {
  return axios.get<string>(`/api/resources/json?fileName=${fileName}`);
}

/**
 * 校验文件是否存在
 * @param url
 * @param success
 * @param failed
 */
export const checkFileExists = async (url: string, success: any, failed: any) => {
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      if (typeof success === 'function') success();
    } else if (typeof failed === 'function') failed();
  } catch (error) {
    if (typeof failed === 'function') failed();
  }
};

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
/**
 * 将base64编码的字符串转为文件，并下载
 * @param base64Data Base64FileParams
 */
export const downloadFileByBase64Data = (base64Data: Base64FileParams) => {
  downloadFileByBase64(base64Data.base64, base64Data.type, base64Data.name);
}
/**
 * 将base64编码的字符串转为文件，并下载
 * @param base64String base64编码字符串
 */
export const downloadFileByBase64String = (base64String: string) => {
  if (base64String && isJSON(base64String)) {
    // 解码Base64字符串
    const data: Base64FileParams = JSON.parse(base64String);
    // 下载文件
    downloadFileByBase64Data(data);
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