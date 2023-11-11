import axios from "axios";
import qs from "query-string";
import {Base64FileParams, PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";
import {getToken} from '@/utils/auth';
import {Message} from "@arco-design/web-vue";
import {isJSON} from "@/utils/strings";

export interface QueryAppForm {
  id: string;
  name: string;// 应用名称
  code: string;// 应用编码
  icon: string;// 图标
  appKey: string;
  token: string;
  tree: string;
  logo: string;// 标识
  theme: string;
  watermark: number;// 应用水印
  href: string;// 首页链接
  dependAppCode: string;
  powerInfo: string;
  versionInfo: string;
  description: string;// 描述
  seqNo: number;
  tenantCode?: string;
  applyStatus: number;
  designStatus: number;
}

export interface FilterAppForm {
  id: string;
  name: string;// 应用名称
  code: string;// 应用编码
  watermark: string;// 应用水印
  versionInfo: string;
  createAt: string[];
  tenantCode: string;
  applyStatus: string;
  designStatus: string;
}

export function pageQueryApps(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/app/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryApps() {
  return axios.get<QueryAppForm[]>('/api/app/query');
}

export function getApp(id: string) {
  return axios.get<QueryAppForm>(`/api/app/get/${id}`);
}

export function createOrUpdateApp(params: QueryAppForm) {
  return axios.post<QueryResult>('/api/app/createOrUpdate', params);
}

export function deleteApp(id: string) {
  return axios.delete<QueryResult>(`/api/app/isDelete/${id}`);
}

export function validateAppCode(params: QueryAppForm) {
  return axios.post<QueryResult>('/api/app/validate', params);
}

export interface AttachmentForm {
  id: string;
  name: string;
  path: string;
  size: string;
  type: string;
  url: string;
  delStatus: number;
  tenantCode: string;
  genre: string;
}

export interface FilterAttachmentForm {
  name: string;
  size: string;
  type: string;
  creator: string;
  createAt: string[];
  tenantCode: string;
  genre: string;
}

export function exportFileList(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/export/file/list', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getAttachment(id: string) {
  return axios.get<AttachmentForm>(`/api/attach/get/${id}`);
}

export function getAttachments(ids: string) {
  return axios.post<AttachmentForm[]>(`/api/attach/list`, {"ids": ids});
}

/**
 * 删除附件。1，删除附件表信息；2，删除文件
 * @param id 附件表id
 * @param isRemoveFile 删除文件，默认：false
 */
export function deleteAttachment(id: string, isRemoveFile?: boolean) {
  return axios.delete<QueryResult>(`/api/attach/remove/${id}?isRemoved=${isRemoveFile || false}`);
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
 * 批量获取附件信息
 * @param ids
 * @param successBack
 * @param failBack
 */
export const getAttachmentByIds = async (ids: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getAttachments(ids);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    failBack(err);
  }
};

export const uploadHeader = (): Record<string, string> => {
  const token = getToken();
  if (token) {
    return {Authorization: `Bearer ${token}`};
  }
  return {Authorization: ''};
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