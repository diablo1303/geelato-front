import axios from "axios";
import {QueryResult} from "@/api/base";
import {getToken} from "@/utils/auth";

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