import type {ApiResult} from '../types/global'
import {entityApi} from './EntityApi'
import utils from '../utils/Utils'

export interface AttachmentForm {
  id: string
  name: string
  path: string
  size: string
  type: string
  url: string
  delStatus: number
}

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

export function getAttachment(id: string) {
  return entityApi.getAxios().get<AttachmentForm>(`/api/attach/get/${id}`)
}

/**
 * 批量获取附件信息
 * @param ids
 */
export function getAttachmentByIds(ids: string) {
  return entityApi.getAxios().post<AttachmentForm[]>(`/api/attach/list`, {ids: ids})
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
 * @param params appId,isRename,objectId,genre,root
 */
export function getUploadUrl(params?: Record<string, any>) {
  params = params || {};
  params.isRename = params.isRename !== false;
  const records = utils.getUrlParams(params);
  return `${entityApi.getAxios().defaults.baseURL}/api/upload/file?${records.join('&')}`;
}

/**
 * 下载附件
 * @param id 附件id
 */
export function getDownloadUrlById(id: string, isPdf?: boolean, isPreview?: boolean) {
  return id ? `${entityApi.getAxios().defaults.baseURL}/api/resources/file?rstk=download&id=${id}&isPdf=${isPdf === true}&isPreview=${isPreview === true}` : ''
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
    }/api/resources/file?rstk=download&name=${name}&path=${path}`
    : ''
}


/**
 * 导出excel、word
 * 后端依据模板类型导出相应格式的文件
 * @param fileName 文件名称
 * @param templateId 模型文档id
 * @param dataType 数据类型，mql | data，数据类型有可能是前端的数据结果（data），也有可能是用于后端查询获取数据结果的（mql）
 * @param data 数据
 * @param readonly 是否只读
 * @param waterMark {markKey:水印样式选定,markText:水印文本，默认样式} 水印
 */
export function exportFile(fileName: string, templateId: string, dataType: string, data: object, readonly?: boolean, waterMark?: Record<string, any>) {
  const responseParams = `readonly=${readonly === true}&markKey=${waterMark?.markKey || ''}&markText=${waterMark?.markText || ''}`;
  return entityApi
    .getAxios()
    .post(`/api/export/file/${dataType}/${templateId}?fileName=${fileName}&${responseParams}`, data)
}

/**
 * 导出excel
 * @param fileName 文件名称
 * @param templateId 模型文档id
 * @param dataType 数据类型，mql | data，数据类型有可能是前端的数据结果（data），也有可能是用于后端查询获取数据结果的（mql）
 * @param data 数据
 * @param params 其他参数
 */
export function exportExcel(fileName: string, templateId: string, dataType: string, data: object, params?: Record<string, any>) {
  return exportFile(fileName, templateId, dataType, data, params?.readonly, params?.waterMark);
}

/**
 * 导入excel
 * @param templateId 模型文档id
 * @param attachId 已上传的数据文件id，如已上传的Excel文件id
 * @param importType 导入的方式，“part”部分成功也导入，“all”全部成功才导入
 */
export function importFile(templateId: string, attachId: string, importType?: string) {
  return entityApi
    .getAxios()
    .post(`/api/import/attach/${importType || 'part'}/${templateId}/${attachId}`)
}


/**
 * 文件下载
 * @param id
 * @param isPdf 是否转成pdf下载
 */
export function downloadFileById(id: string, isPdf?: boolean, isPreview?: boolean) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none' // 防止影响页面
  iframe.style.height = '0' // 防止影响页面
  console.log('getDownloadUrlById(id,isPdf)', getDownloadUrlById(id, isPdf, isPreview))
  iframe.src = getDownloadUrlById(id, isPdf, isPreview)
  document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
  // 等待iframe加载完成
  iframe.onload = () => {
    document.body.removeChild(iframe);
  };
  // 等待iframe加载失败
  iframe.onerror = () => {
    document.body.removeChild(iframe);
  }
}

/**
 * 获取导入模板信息
 * @param templateId
 */
export function getImportTemplateInfo(templateId: string) {
  return entityApi.getAxios().get(`/api/import/template/${templateId}`)
}


/**
 * 下载导入模板文件
 * @param templateId
 */
export function downloadImportTemplateFile(templateId: string) {
  getImportTemplateInfo(templateId).then((res) => {
    const templateIdOrBase64 = res.data.template
    if (templateIdOrBase64 && templateIdOrBase64.length > 64 && utils.isJSON(templateIdOrBase64)) {
      downloadFileByBase64String(templateIdOrBase64);
    } else {
      downloadFileById(res.data.template)
    }
  })
}

/**
 * 将base64编码的字符串转为文件，并下载
 * @param base64Str base64编码字符串
 * @param fileType 文件mine
 * @param fileName 文件名称
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
    throw new Error((err && err.message) || "文件下载失败");
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
  if (base64String && utils.isJSON(base64String)) {
    // 解码Base64字符串
    const data: Base64FileParams = JSON.parse(base64String);
    // 下载文件
    downloadFileByBase64Data(data);
  }
}

/**
 * 获取系统配置
 * @param configKey
 */
export function getValueByKeys(configKey: string) {
  return entityApi.getAxios().get(`/api/sys/config/getValue/${configKey}`);
}