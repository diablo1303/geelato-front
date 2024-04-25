import {entityApi} from "./EntityApi";
import utils from '../utils/Utils';

/**
 * 获取一个新的编码，如需要使用系统编码app，需在参数中传入appId
 * @param id 编码ID
 * @param argumentParam params参数
 * @param argumentBody body参数，优先级高于params参数
 */
export function generateCode(id: string, argumentParam?: Record<string, any>, argumentBody?: Record<string, any>) {
  const records = utils.getUrlParams(argumentParam || {});
  return entityApi.getAxios().post(`/api/encoding/generate/${id}?${records.join('&')}`, argumentBody || {});
}