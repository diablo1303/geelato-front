import type { ApiResult } from '../types/global'
import { entityApi } from './EntityApi'

export interface AttachmentForm {
  id: string
  name: string
  path: string
  size: string
  type: string
  url: string
  delStatus: number
}

export function getAttachment(id: string) {
  return entityApi.getAxios().get<AttachmentForm>(`/api/attach/get/${id}`)
}

/**
 * 批量获取附件信息
 * @param ids
 */
export function getAttachmentByIds(ids: string) {
  return entityApi.getAxios().post<AttachmentForm[]>(`/api/attach/list`, { ids: ids })
}

/**
 * 删除附件。1，删除附件表信息；2，删除文件
 * @param id 附件表id
 * @param isRemoveFile 删除文件，默认：false
 */
export function deleteAttachment(id: string, isRemoveFile?: boolean) {
  return entityApi
    .getAxios()
    .delete<ApiResult>(`/api/attach/remove/${id}?isRemoved=${!!isRemoveFile}`)
}

/**
 * 上传附件
 * @param isRename 重置文件名，默认：true
 */
export function getUploadUrl(isRename?: boolean) {
  return `${entityApi.getAxios().defaults.baseURL}/api/upload/file?isRename=${!!isRename}`
}

/**
 * 下载附件
 * @param id 附件id
 */
export function getDownloadUrlById(id: string) {
  return id ? `${entityApi.getAxios().defaults.baseURL}/resources/file?rstk=download&id=${id}` : ''
}

/**
 * 下载附件
 * @param name 附件名称
 * @param path 附件相对地址
 */
export function getDownloadUrlByPath(name: string, path: string) {
  return name && path
    ? `${
        entityApi.getAxios().defaults.baseURL
      }/resources/file?rstk=download&name=${name}&path=${path}`
    : ''
}

/**
 * 导出excel
 * @param fileName 文件名称
 * @param templateId 模板文档Id
 * @param dataType 数据类型，mql | data，数据类型有可能是最新的数据结果（data），也有可能是用于后端查询获取数据结果的（mql）
 * @param data 数据
 */
export function exportExcel(fileName: string, templateId: string, dataType: string, data: object) {
  return entityApi
    .getAxios()
    .post(`/api/export/file/${dataType}/${templateId}?fileName=${fileName}`, data)
}

/**
 * 文件下载
 * @param id
 */
export function downloadFileById(id: string) {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none' // 防止影响页面
  iframe.style.height = '0' // 防止影响页面
  iframe.src = getDownloadUrlById(id)
  document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
  setTimeout(function () {
    document.body.removeChild(iframe)
  }, 100)
}
