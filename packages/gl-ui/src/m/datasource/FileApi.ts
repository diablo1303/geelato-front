import type {ApiResult} from "../types/global";
import {entityApi} from "./EntityApi";

const axios = entityApi.getService()

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

/**
 * 批量获取附件信息
 * @param ids
 */
export function getAttachmentByIds(ids: string) {
    return axios.post<AttachmentForm[]>(`/api/attach/list`, {"ids": ids});
}

/**
 * 删除附件。1，删除附件表信息；2，删除文件
 * @param id 附件表id
 * @param isRemoveFile 删除文件，默认：false
 */
export function deleteAttachment(id: string, isRemoveFile?: boolean) {
    return axios.delete<ApiResult>(`/api/attach/remove/${id}?isRemoved=${!!isRemoveFile}`);
}

/**
 * 上传附件
 * @param isRename 重置文件名，默认：true
 */
export function getUploadUrl(isRename?: boolean) {
    return `${axios.defaults.baseURL}/api/upload/file?isRename=${!!isRename}`;
}

/**
 * 下载附件
 * @param id 附件id
 */
export function getDownloadUrlById(id: string) {
    return id ? `${axios.defaults.baseURL}/resources/file?rstk=download&id=${id}` : '';
}

/**
 * 下载附件
 * @param name 附件名称
 * @param path 附件相对地址
 */
export function getDownloadUrlByPath(name: string, path: string) {
    return name && path ? `${axios.defaults.baseURL}/resources/file?rstk=download&name=${name}&path=${path}` : '';
}
