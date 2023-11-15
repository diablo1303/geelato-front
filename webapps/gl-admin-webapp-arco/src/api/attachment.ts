import {getToken} from "@/utils/auth";
import axios from "axios";
import {Message} from "@arco-design/web-vue";
import {isJSON} from "@/utils/is";

export interface Base64FileParams {
  name: string;
  size: number;
  type: string;
  base64: string;
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
 * @param isRename 重置文件名，默认：true
 */
export function getUploadUrl(isRename?: boolean) {
  return `${axios.defaults.baseURL}/api/upload/file?isRename=${isRename !== false}`;
}

/**
 * 下载附件
 * @param id 附件id
 */
export function getDownloadUrlById(id: string, isPdf?: boolean) {
  return id ? `${axios.defaults.baseURL}/api/resources/file?rstk=download&id=${id}&isPdf=${isPdf === true}` : '';
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