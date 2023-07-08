import axios from "axios";
import qs from "query-string";
import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/service/base_service";

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
}

export interface FilterAppForm {
  id: string;
  name: string;// 应用名称
  code: string;// 应用编码
  watermark: string;// 应用水印
  versionInfo: string;
  createAt: string[];
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

export interface AttachmentForm {
  id: string;
  name: string;
  path: string;
  size: string;
  type: string;
  url: string;
  delStatus: number
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
export function getDownloadUrlById(id: string) {
  return id ? `${axios.defaults.baseURL}/api/download/file?id=${id}` : '';
}

/**
 * 下载附件
 * @param name 附件名称
 * @param path 附件相对地址
 */
export function getDownloadUrlByPath(name: string, path: string) {
  return name && path ? `${axios.defaults.baseURL}/api/download/file?name=${name}&path=${path}` : '';
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