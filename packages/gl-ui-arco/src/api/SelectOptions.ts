import type {SelectOptionData, SelectOptionGroup} from "@arco-design/web-vue";
import type {ColumnSelectType, QueryAppForm} from "@geelato/gl-ui";
import {applicationApi, dictApi, modelApi} from "@geelato/gl-ui";

/**
 * 查询所有的应用
 * @param params
 * @param successBack
 * @param failBack
 */
export const queryAppSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  await applicationApi.getAppSelectOptions(params, (data: QueryAppForm[]) => {
    const options: SelectOptionData[] = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        options.push({label: data[i].name, value: data[i].id});
      }
    }
    if (successBack && typeof successBack === 'function') successBack(options);
  }, failBack);
}

/**
 * 查询字典编码下所有字典项
 * @param dictCode
 */
export const queryDictItemSelectOptions = async (dictCode: string) => {
  let selectOptions: SelectOptionData[] = [];
  try {
    const {data} = await dictApi.queryItemByDictCode(dictCode);
    if (data != null && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        selectOptions.push({'value': item.itemCode, 'label': item.itemName, 'disabled': item.enableStatus !== 1});
      }
    }
  } catch (err) {
    console.log(err);
    selectOptions = [];
  }
  return selectOptions;
}

/**
 * 模型字段类型分组处理
 * @param data
 */
export const handleSelectType = (data: ColumnSelectType[]) => {
  const optionGroup: SelectOptionGroup[] = [];
  const groups: string[] = [];
  for (let i = 0; i < data.length; i += 1) {
    if (!groups.includes(data[i].group)) {
      groups.push(data[i].group);
      const optionDatas: SelectOptionData[] = [];
      for (let j = 0; j < data.length; j += 1) {
        if (data[j].group === data[i].group) {
          optionDatas.push({value: data[j].value, label: data[j].label, disabled: data[j].disabled});
        }
      }
      optionGroup.push({isGroup: true, label: data[i].group, options: optionDatas});
    }
  }

  return optionGroup;
}
/**
 * 查询模型字段类型
 * @param successBack
 * @param handleBack
 * @param failBack
 */
export const getTypeSelectOptionGroup = async (successBack?: any, failBack?: any) => {
  modelApi.getTypeSelectOptions((data: ColumnSelectType[]) => {
    const optionGroup = handleSelectType(data);
    if (successBack && typeof successBack === 'function') successBack(optionGroup);
  }, (err: any) => {
    if (failBack && typeof failBack === 'function') failBack(err);
  });
}