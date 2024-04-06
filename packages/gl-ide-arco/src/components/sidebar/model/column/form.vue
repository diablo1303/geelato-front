<script lang="ts">
export default {
  name: 'GlModelTableColumnForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import type {FormInstance, SelectOptionGroup} from "@arco-design/web-vue";
import {applicationApi, modelApi, useGlobal, securityApi, utils, stringUtil} from "@geelato/gl-ui";
import type {
  ColumnSelectType,
  QueryMultiComponentForm,
  QueryTableColumnForm,
  QueryTableForm,
  QueryDictForm,
  QueryDictItemForm,
  QueryEncodingForm,
  QueryAppForm
} from '@geelato/gl-ui';
import {
  autoIncrementOptions,
  enableStatusOptions,
  encryptedOptions,
  keyOptions,
  nullableOptions,
  numericSignedOptions,
  uniquedOptions
} from "./searchTable";
import GlDictionaryLayout from '../../security/dictionary/layout.vue';
import {it} from "vitest";

interface PageParams {
  connectId: string; // 数据库链接id
  tableId: string; // 模型名称
  tableName: string;
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  title: {type: String, default: '模型字段'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
  editName: {type: Boolean, default: true},
});

const global = useGlobal();
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const appSelectOptions = ref<QueryAppForm[]>([]);
const columnSelectType = ref<ColumnSelectType[]>([]);
const selectTypeOptions = ref<SelectOptionGroup[]>([]);


/* 表单 */
const generateFormData = (): QueryTableColumnForm => {
  return {
    id: '', // *
    tableId: props.parameter.tableId || '', // 表id *
    title: '', // 实体属性中文,中文名
    abstractColumnExpressions: '', //
    fieldName: '',// 列名
    tableSchema: '', // 数据库名
    tableName: props.parameter.tableName || '', // 表名
    tableCatalog: '', // 表目录 *
    name: '', // 列名
    comment: '', // 备注
    ordinalPosition: 1, // 次序
    defaultValue: '', // 默认值
    type: '', // 类型
    key: 0, // 列键
    nullable: 1, // 是否可空 YES_OR_NO
    dataType: 'VARCHAR', // 数据类型
    selectType: 'VARCHAR',
    typeExtra: '',
    extra: '', // 特别 auto_increment
    autoIncrement: 0, // auto_increment
    uniqued: 0, // 唯一约束
    charMaxLength: 64, // 长度
    numericPrecision: 0, // 整数位
    numericScale: 0, // 小数位
    numericSigned: 0, // 是否有符号，默认有，若无符号，则需在type中增加：unsigned
    datetimePrecision: '', // datetime 时间类型
    enableStatus: 1, // 状态
    delStatus: 0,
    linked: 0, // 链接
    description: '', // 描述
    isRefColumn: false,  // 1-外表字段，默认0
    refLocalCol: '', // isRefColumn为true时，需要通过本表引用字段
    refTables: '', // 外表表名
    refColName: '', // 外表字段名称
    autoAdd: '',
    autoName: '',
    synced: false,
    encrypted: 0,
    seqNo: 1,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const selectData = ref({fixed: false, max: 21845, min: 0, digit: 5, precision: 0});
const multiComponentData = ref<QueryMultiComponentForm[]>([]);
const generateMultiComponentData = (): QueryMultiComponentForm => {
  return {
    title: '',
    fieldName: '',
    selectType: 'VARCHAR',
    dataType: 'VARCHAR',
    charMaxLength: 64,
    numericPrecision: 0,
    numericScale: 0,
    isEdit: true,
    // eslint-disable-next-line no-use-before-define
    columnSelectType: formatSelectType('VARCHAR')
  };
}

const validateMulti = () => {
  let isValid = true;
  if (multiComponentData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of multiComponentData.value) {
      item.isEdit = false;
      if (!item.title || !item.fieldName || !item.selectType) {
        item.isEdit = true;
        isValid = false;
      }
    }
  }
  if (!isValid) {
    global.$message.warning({content: '请补全必填数据'});
  }
  return isValid;
}

const clickAddMulti = (ev?: MouseEvent) => {
  if (validateMulti()) {
    multiComponentData.value.push(generateMultiComponentData());
  }
}

const clickEditMulti = (data: QueryMultiComponentForm) => {
  if (validateMulti()) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of multiComponentData.value) {
      if (item.fieldName === data.fieldName) {
        item.isEdit = true;
      } else {
        item.isEdit = false;
      }
    }
  }
}
const clickSaveMulti = (data: QueryMultiComponentForm) => {
  if (validateMulti()) {
    data.isEdit = false;
  }
}
const clickDeleteMulti = (data: QueryMultiComponentForm) => {
  if (multiComponentData.value.length > 0) {
    const indexs = [];
    for (let i = 0; i < multiComponentData.value.length; i += 1) {
      multiComponentData.value[i].isEdit = false;
      if (multiComponentData.value[i].fieldName === data.fieldName) {
        indexs.push(i);
      }
    }
    for (let i = 0; i < indexs.length; i += 1) {
      multiComponentData.value.splice(indexs[i], 1);
    }
  }
}
const getMultiData = () => {
  if (multiComponentData.value.length > 0) {
    const indexs = [];
    for (let i = 0; i < multiComponentData.value.length; i += 1) {
      const item = multiComponentData.value[i];
      delete item.isEdit;
      delete item.columnSelectType;
      if (!item.title || !item.fieldName || !item.selectType) {
        indexs.push(i);
      }
    }
    for (let i = 0; i < indexs.length; i += 1) {
      multiComponentData.value.splice(indexs[i], 1);
    }
  }
  return multiComponentData.value.length > 0 ? JSON.stringify(multiComponentData.value) : '';
}
const selectTypeMultiChange = (data: QueryMultiComponentForm) => {
  // eslint-disable-next-line no-use-before-define
  data.columnSelectType = formatSelectType(data.selectType);
  // 数据类型
  data.dataType = data.columnSelectType.mysql && data.columnSelectType.mysql.toUpperCase();
  // 字符串 默认长度
  if (data.columnSelectType.extent > 0) {
    data.charMaxLength = data.columnSelectType.extent;
  } else if (['CHAR', 'VARCHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'].includes(data.dataType)) {
    data.charMaxLength = data.columnSelectType.radius.max;
  }
  // 数值 默认长度
  if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT'].includes(data.selectType)) {
    data.numericPrecision = data.columnSelectType.radius.digit;
    data.numericScale = data.columnSelectType.radius.precision;
  }
  if (['DECIMAL'].includes(data.selectType)) {
    data.numericPrecision = 12;
    data.numericScale = 2;
  }
  if (['SCORE'].includes(data.selectType)) {
    data.numericPrecision = 3;
    data.numericScale = 1;
  }
}
const loadMultiData = (list: QueryMultiComponentForm[]) => {
  if (list != null && list.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of list) {
      item.isEdit = false;
      selectTypeMultiChange(item);
    }
  }
  return list;
}

const selectDictionaryOptions = ref<QueryDictForm[]>([]);
const getSelectDictionaryOptions = async () => {
  try {
    const {data} = await securityApi.queryDicts({
      enableStatus: 1,
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    });
    selectDictionaryOptions.value = data || [];
  } catch (err) {
    selectDictionaryOptions.value = [];
  }
}
const selectDictItemOptions = ref<QueryDictItemForm[]>([]);
const getSelectDictItemOptions = async (value?: string) => {
  try {
    if (formData.value.typeExtra) {
      const {data} = await securityApi.queryItemByDictCode(formData.value.typeExtra as string);
      selectDictItemOptions.value = data || [];
      formData.value.defaultValue = value || '';
    } else {
      selectDictItemOptions.value = [];
    }
  } catch (err) {
    selectDictionaryOptions.value = [];
  }
}

const dictionaryChange = (value?: string) => {
  formData.value.defaultValue = '';
  selectDictItemOptions.value = [];
  getSelectDictItemOptions(value);
}
const dictionaryChange1 = () => {
  dictionaryChange();
  // 优化字段标识自动填写
  if (!formData.value.name) {
    if (formData.value.typeExtra && formData.value.typeExtra.indexOf('_') !== -1) {
      formData.value.name = formData.value.typeExtra as string;
      columnNameBlur();
    }
  }
}

const selectCodeOptions = ref<QueryEncodingForm[]>([]);
const getSelectCodeOptions = async () => {
  try {
    const {data} = await securityApi.queryEncodings({
      enableStatus: 1,
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    });
    selectCodeOptions.value = data || [];
  } catch (err) {
    selectCodeOptions.value = [];
  }
}
const selectEntityOptions = ref<QueryTableForm[]>([]);
const getSelectEntityOptions = async (params?: Record<string, any>) => {
  try {
    const {data} = await modelApi.queryTables({
      ...params,
      enableStatus: 1, tableType: 'table',
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    });
    selectEntityOptions.value = data;
  } catch (err) {
    selectEntityOptions.value = [];
  }
}
const getKeyId = (data: QueryTableColumnForm[]): string => {
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (item.key === true || item.fieldName === 'id') {
        return item.id;
      }
    }
  }
  return '';
}
const selectEntityColumnOptions = ref<QueryTableColumnForm[]>([]);
const getSelectEntityColumnOptions = async (value: string, params?: Record<string, any>) => {
  try {
    if (formData.value.typeExtra) {
      const {data} = await modelApi.queryTableColumns({
        ...params,
        enableStatus: 1, tableId: formData.value.typeExtra,
        appId: '', tenantCode: props.parameter?.tenantCode || ''
      });
      selectEntityColumnOptions.value = data;
      formData.value.defaultValue = value || getKeyId(data);
    } else {
      selectEntityColumnOptions.value = [];
    }
  } catch (err) {
    selectEntityColumnOptions.value = [];
  }
}

const entityChange = (value?: string) => {
  formData.value.defaultValue = '';
  selectEntityColumnOptions.value = [];
  getSelectEntityColumnOptions(value || "");
}
const entityChange1 = () => {
  entityChange();
  // 优化字段标识自动填写
  if (!formData.value.name) {
    if (formData.value.typeExtra) {
      for (const item of selectEntityOptions.value) {
        if (formData.value.typeExtra === item.id) {
          formData.value.name = `${item.entityName}_id`;
          columnNameBlur();
          break;
        }
      }
    }
  }
}

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryTableColumnForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    params.autoAdd = Number(params.autoAdd.toString());
    params.defaultValue = params.defaultValue && params.defaultValue.toString();
    params.typeExtra = params.typeExtra && params.typeExtra.toString();
    if (['MULTICOMPONENT'].includes(params.selectType)) {
      params.typeExtra = getMultiData();
    }
    try {
      const {data} = await modelApi.createOrUpdateTableColumn(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else if (failBack && typeof failBack === 'function') failBack();
};
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.getTableColumn(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

const formatFieldString = (value: string) => {
  value = stringUtil.formatSeparator(value, " ").join("_");
  value = stringUtil.formatSeparator(value, "_").join("_");
  return value.toLowerCase();
}
/**
 * 字段名称 生成 字段名称
 */
const columnNameBlur = (ev?: FocusEvent) => {
  formData.value.name = formatFieldString(formData.value.name);
  validateForm.value?.validateField("name");
  formData.value.fieldName = stringUtil.toCamelCase(formData.value.name);
  // eslint-disable-next-line no-use-before-define
  autoNameBlur();
}

const formatSelectType = (value: string): ColumnSelectType => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType.value) {
    if (item.value === value) {
      if (value === "SCORE") {
        item.radius = {max: 10000, min: 0, digit: 5, unDigit: 5, precision: 2};
      } else {
        item.radius = item.radius ? item.radius : {max: 1, min: 1, digit: 1, unDigit: 1, precision: 0};
        // 数据类型范围处理
        // eslint-disable-next-line no-restricted-globals
        item.radius.max = !isNaN(item.radius.max) ? Number(item.radius.max) : 0;
        // eslint-disable-next-line no-restricted-globals
        item.radius.min = !isNaN(item.radius.min) ? Number(item.radius.min) : 0;
        // eslint-disable-next-line no-restricted-globals
        item.extent = !isNaN(item.extent) ? Number(item.extent) : 0;
      }
      return item;
    }
  }
  return {} as unknown as ColumnSelectType;
}

const selectTypeChange = (value: string) => {
  const cst: ColumnSelectType = formatSelectType(formData.value.selectType);
  // 清理数据
  formData.value.autoAdd = '';
  formData.value.autoName = '';
  formData.value.charMaxLength = 0;
  formData.value.defaultValue = '';
  formData.value.typeExtra = '';
  formData.value.numericPrecision = 0;
  formData.value.numericScale = 0;
  formData.value.numericSigned = 0;
  formData.value.autoIncrement = 0;
  // 数据类型
  formData.value.dataType = cst.mysql && cst.mysql.toUpperCase();
  // 字符串 默认长度
  if (cst.extent > 0) {
    formData.value.charMaxLength = cst.extent;
  } else if (['CHAR', 'VARCHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'].includes(formData.value.dataType)) {
    formData.value.charMaxLength = cst.radius.max;
  }
  // 长度限制
  selectData.value.fixed = cst.fixed;
  selectData.value.max = cst.radius.max;
  selectData.value.min = cst.radius.min;
  selectData.value.digit = formData.value.numericSigned ? cst.radius.digit : cst.radius.unDigit;
  selectData.value.precision = cst.radius.precision;
  // 数值 默认长度
  if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT', 'DECIMAL', 'SCORE'].includes(formData.value.selectType)) {
    if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT'].includes(formData.value.selectType)) {
      formData.value.numericPrecision = cst.radius.digit;
      formData.value.numericScale = cst.radius.precision;
    }
    if (['DECIMAL'].includes(formData.value.selectType)) {
      formData.value.numericPrecision = 12;
      formData.value.numericScale = 2;
    }
    if (['SCORE'].includes(formData.value.selectType)) {
      formData.value.numericPrecision = 3;
      formData.value.numericScale = 1;
    }
    // eslint-disable-next-line no-use-before-define
    numericPrecisionBlur();
  }
  // 布尔值 开关
  if (['SWITCH'].includes(formData.value.selectType)) {
    formData.value.defaultValue = '0';
  }
  // 数据字典预选
  if (['DICTIONARY'].includes(formData.value.selectType)) {
    if (formData.value.name && formData.value.fieldName) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of selectDictionaryOptions.value) {
        if ([formData.value.name, formData.value.fieldName].includes(item.dictCode)) {
          formData.value.typeExtra = item.dictCode;
          dictionaryChange1();
          break;
        }
      }
    }
  }
}

const numericPrecisionBlur = (ev?: FocusEvent) => {
  const cst: ColumnSelectType = formatSelectType(formData.value.selectType);
  // 最大、最小 限制
  selectData.value.digit = formData.value.numericSigned ? cst.radius.digit : cst.radius.unDigit;
  selectData.value.max = formData.value.numericSigned ? cst.radius.max : (cst.radius.max - cst.radius.min);
  selectData.value.min = formData.value.numericSigned ? cst.radius.min : 0;
  // 表单整数位、小数位 限制
  const currentMaxScale = ((10 ** formData.value.numericScale - 1) / 10 ** formData.value.numericScale);
  const currentMaxPrecision = 10 ** formData.value.numericPrecision - 1;
  const currentMax = currentMaxPrecision + currentMaxScale;
  selectData.value.max = currentMax > selectData.value.max ? selectData.value.max : currentMax;
  selectData.value.min = (0 - currentMax) < selectData.value.min ? selectData.value.min : (0 - currentMax);
  // 评分默认值
  if (['SCORE'].includes(formData.value.selectType)) {
    setTimeout(() => {
      formData.value.defaultValue = '';
      formData.value.defaultValue = Number(formData.value.numericPrecision <= 1 ? 5 : 10 ** (formData.value.numericPrecision - 1));
    }, 50);
  }
}
const numericScaleBlur = (ev?: FocusEvent) => {
  numericPrecisionBlur();
}
const numericSignedChange = (value: boolean, ev?: Event) => {
  numericPrecisionBlur();
}

const autoNameBlur = (ev?: FocusEvent) => {
  formData.value.autoName = formatFieldString(formData.value.autoName);
  if (formData.value.name === formData.value.autoName) {
    formData.value.autoName = '';
  }
  if (formData.value.autoAdd.toString() === '1' && stringUtil.isNotBlank(formData.value.name)) {
    if (stringUtil.isBlank(formData.value.autoName)) {
      if (formData.value.name.endsWith('id')) {
        formData.value.autoName = formData.value.name.replace('id', 'name');
      } else if (formData.value.name.endsWith('name')) {
        formData.value.autoName = formData.value.name.replace('name', 'id');
      }
    }
  } else {
    formData.value.autoName = '';
  }
  validateForm.value?.validateField("autoName");
}
const autoAddChange = (value: string) => {
  autoNameBlur();
}
const getFormatSelectType = (value: string): string => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType.value) {
    if (item.value === value) {
      return item.label;
    }
  }
  return '';
}

const layoutParams = ref({
  visible: false,
  isModal: true,
  title: '数据字典',
  width: '1250px',
  height: '',
  parameter: {appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 1,
});
const openAddDict = (ev?: MouseEvent) => {
  layoutParams.value = Object.assign(layoutParams.value, {
    id: '', visible: true, formState: 'add', title: '新建数据字典',
  });
}
const openEditDict = (ev?: MouseEvent) => {
  let data: QueryDictForm = {} as unknown as QueryDictForm;
  for (const item of selectDictionaryOptions.value) {
    if (item.dictCode === formData.value.typeExtra) {
      data = item;
      break;
    }
  }
  if (data && data.id) {
    Object.assign(layoutParams.value, {
      id: data.id, visible: true, formState: 'edit', title: '编辑数据字典', parameter: {
        appId: data.appId || '', tenantCode: data.tenantCode || ''
      }
    });
  } else {
    global.$message.warning({content: '请选项需要编辑的字典！'});
  }
}

const dictSaveSuccess = (params: QueryDictForm, action: string) => {
  formData.value.defaultValue = '';
  formData.value.typeExtra = params.dictCode;
  getSelectDictionaryOptions();
  dictionaryChange1();
}
const dictItemChange = (dictId: string) => {
  dictionaryChange();
}

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const params = {...formData.value};
    params.autoAdd = Number(params.autoAdd.toString());
    params.defaultValue = params.defaultValue && params.defaultValue.toString();
    params.typeExtra = params.typeExtra && params.typeExtra.toString();
    const {data} = await modelApi.validateTableColumnName(params);
    if (!data) callback('不能重复');
  } catch (err) {
    console.log(err);
  }
}

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, (data: QueryTableColumnForm) => {
    done();
    visibleForm.value = false;
    emits('saveSuccess', data, props.formState);
  }, () => {
    done(false)
  });
};
/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

watch(() => props, () => {
  if (props.visible === true) {
    getSelectDictionaryOptions();
    getSelectCodeOptions();
    getSelectEntityOptions();
    // 应用信息
    applicationApi.getAppSelectOptions({
      id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data || [];
    }, () => {
      appSelectOptions.value = [];
    });
    // 模型字段类型
    modelApi.getTypeSelectOptions((data: ColumnSelectType[]) => {
      columnSelectType.value = data || [];
      selectTypeOptions.value = modelApi.handleSelectType(columnSelectType.value);
    }, () => {
      columnSelectType.value = [];
      selectTypeOptions.value = [];
    });
    // 表单数据重置
    formData.value = generateFormData();
    multiComponentData.value = [generateMultiComponentData()];
    // 重置验证
    resetValidate();
    // 数据字典
    layoutParams.value.parameter = {
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      getData(props.modelValue, (data: QueryTableColumnForm) => {
        // string ==> number
        data.seqNo = Number(data.seqNo);
        data.ordinalPosition = Number(data.ordinalPosition);
        data.charMaxLength = Number(data.charMaxLength);
        // boolean ==> number
        data.nullable = data.nullable === true ? 1 : 0;
        data.numericSigned = data.numericSigned === true ? 1 : 0;
        data.key = data.key === true ? 1 : 0;
        data.uniqued = data.uniqued === true ? 1 : 0;
        data.encrypted = data.encrypted === true ? 1 : 0;
        data.autoIncrement = data.autoIncrement === true ? 1 : 0;
        data.isRefColumn = data.isRefColumn === true ? 1 : 0;
        data.autoAdd = [(data.autoAdd === true ? 1 : 0).toString()];
        if (['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT', 'DECIMAL', 'SCORE'].includes(data.selectType)) {
          data.defaultValue = (data.defaultValue == null || data.defaultValue === '') ? data.defaultValue : Number(data.defaultValue);
        }
        if (['BIT', 'SWITCH'].includes(data.selectType)) {
          data.defaultValue = (data.defaultValue == null || data.defaultValue === '') ? '' : data.defaultValue.toString();
        }
        if (['MULTICOMPONENT'].includes(data.selectType)) {
          multiComponentData.value = (data.typeExtra == null || data.typeExtra === '' || data.typeExtra === '[]')
              ? [generateMultiComponentData()] : loadMultiData(JSON.parse(data.typeExtra as string) as QueryMultiComponentForm[]);
        }
        formData.value = data;
        if (['DICTIONARY'].includes(data.selectType)) {
          dictionaryChange(data.defaultValue as string);
        }
        if (['ENTITY'].includes(data.selectType)) {
          entityChange(data.defaultValue as string);
        }
      });
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <GlDictionaryLayout v-model:visible="layoutParams.visible"
                      :formCol="layoutParams.formCol"
                      :formState="layoutParams.formState"
                      :height="layoutParams.height"
                      :isModal="layoutParams.isModal"
                      :modelValue="layoutParams.id"
                      :parameter="layoutParams.parameter"
                      :title="layoutParams.title"
                      :width="layoutParams.width"
                      @saveSuccess="dictSaveSuccess"
                      @listChange="dictItemChange"/>


  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'" :title="title"
           :width="width || ''" cancel-text="取消" ok-text="确定" title-align="start"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="title" label="名称(中文)">
            <a-input v-model.trim="formData.title" :max-length="32" placeholder="中文，如：‘创建时间’。"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item
              :rules="[{required: editName,message: '这是必填项'},{match: /^[a-z][a-z0-9_]+$/,message:'匹配：‘a-z’、‘0-9’、‘_’'},{validator:validateCode}]"
              field="name" label="字段标识">
            <a-input v-if="editName" v-model.trim="formData.name" :max-length="30" placeholder="存入数据库表的字段，如：‘create_time’用‘_’分割的字符串。"
                     @blur="columnNameBlur"/>
            <span v-else>{{ formData.name }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="fieldName" label="名称(英文)">
            <a-input v-if="formState==='add'" v-model.trim="formData.fieldName" :max-length="32" placeholder="根据 “字段标识” 生成，如：‘createTime’。" readonly/>
            <span v-else>{{ formData.fieldName }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="所属应用">
            <a-select v-model="formData.appId" :disabled="formState==='view'">
              <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="comment" label="注释(中文)">
            <a-textarea v-model="formData.comment" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="description" label="注释(英文)">
            <a-textarea v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="ordinalPosition" label="次序">
            <a-input-number v-model="formData.ordinalPosition" :max="999999" :min="1" :precision="0" placeholder="长度 [0,999999]"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
            <a-select v-model="formData.enableStatus" :options="enableStatusOptions"/>
          </a-form-item>
        </a-col>

        <a-divider style="margin:0 0 10px 0;"/>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="selectType" label="数据类型">
            <a-select v-model="formData.selectType" :options="selectTypeOptions" allow-search @change="selectTypeChange(formData.selectType)"/>
          </a-form-item>
        </a-col>
        <!-- 字符串 长度设置 -->
        <a-col v-if="['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(formData.dataType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: ['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(formData.dataType),message: '这是必填项'}]"
                       field="charMaxLength" label="长度">
            <a-input-number v-model="formData.charMaxLength" :disabled="selectData.fixed" :max="selectData.max" :min="1"
                            :placeholder="`长度 [1,${selectData.max}]`" :precision="0"/>
          </a-form-item>
        </a-col>
        <!-- 数值类型，是否有符号 -->
        <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: ['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL'].includes(formData.selectType),message: '这是必填项'}]"
                       field="numericSigned" label="是否有符号">
            <a-radio-group v-model="formData.numericSigned" :disabled="['SCORE'].includes(formData.selectType)" :options="numericSignedOptions"
                           @change="numericSignedChange(formData.numericSigned as boolean)">
              <template #label="{ data }">{{ data.label }}</template>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <!-- 数值类型，整数位 -->
        <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item
              :rules="[{required: ['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType),message: '这是必填项'}]"
              field="numericPrecision" label="整数位">
            <a-input-number v-model="formData.numericPrecision" :max="selectData.digit" :min="1" :placeholder="`长度 [1,${selectData.digit}]`" :precision="0"
                            @blur="numericPrecisionBlur"/>
          </a-form-item>
        </a-col>
        <!-- 数值类型，小数位 -->
        <a-col v-if="['DECIMAL'].includes(formData.dataType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: ['DECIMAL'].includes(formData.dataType),message: '这是必填项'}]"
                       field="numericScale" label="小数位">
            <a-input-number v-model="formData.numericScale" :max="selectData.precision" :min="1" :placeholder="`长度 [1,${selectData.precision}]`"
                            :precision="0" @blur="numericScaleBlur"/>
          </a-form-item>
        </a-col>
        <!-- 默认值 defaultValue -->
        <a-col v-if="['CHAR','VARCHAR','REMARK','TEXT','RICHTEXT','SCRIPT'].includes(formData.selectType)" :span="labelCol+wrapperCol">
          <a-form-item :label-col-props="{ span: labelCol/formCol }"
                       :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                       field="defaultValue" label="默认值">
            <a-textarea v-model="formData.defaultValue as string" :auto-size="{minRows:2,maxRows:4}" :max-length="formData.charMaxLength" show-word-limit/>
          </a-form-item>
        </a-col>
        <!--   默认范围 typeExtra 字典项、流水号、实体   -->
        <a-col v-if="['CODE','ENTITY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="typeExtra" label="默认范围">
            <a-select v-if="formState!=='view'&&['CODE'].includes(formData.selectType)" v-model="formData.typeExtra" allow-clear allow-search>
              <a-option v-for="item of selectCodeOptions" :key="item.id" :label="`${item.title}[${item.example}]`" :value="item.id"/>
            </a-select>
            <a-select v-if="formState!=='view'&&['ENTITY'].includes(formData.selectType)" v-model="formData.typeExtra" allow-clear allow-search
                      @change="entityChange1">
              <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col v-if="['DICTIONARY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="typeExtra" label="默认范围">
            <a-tooltip v-if="!formData.typeExtra" content="新增数据字典">
              <a-button class="select-button button-primary" @click="openAddDict">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-select v-if="formState!=='view'&&['DICTIONARY'].includes(formData.selectType)" v-model="formData.typeExtra" allow-clear allow-search
                      @change="dictionaryChange1">
              <a-option v-for="item of selectDictionaryOptions" :key="item.id" :label="`${item.dictName}[${item.dictCode}]`" :value="item.dictCode"/>
            </a-select>
            <a-tooltip v-if="formData.typeExtra" content="编辑数据字典">
              <a-button class="select-button button-success" @click="openEditDict">
                <gl-iconfont type="gl-edit-square"/>
              </a-button>
            </a-tooltip>
          </a-form-item>
        </a-col>
        <a-col v-if="['DICTIONARY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="defaultValue" label="默认值">
            <a-select v-if="formState!=='view'" v-model="formData.defaultValue" allow-clear allow-search>
              <a-option v-for="item of selectDictItemOptions" :key="item.id" :label="`${item.itemName}[${item.itemCode}]`" :value="item.itemCode"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col v-if="['ENTITY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="defaultValue" label="默认值">
            <a-select v-if="formState!=='view'" v-model="formData.defaultValue" allow-clear allow-search>
              <a-option v-for="item of selectEntityColumnOptions" :key="item.id" :label="`${item.title}[${item.fieldName}]`" :value="item.id"/>
            </a-select>
          </a-form-item>
        </a-col>
        <!--  布尔值 defaultValue -->
        <a-col v-if="['BIT','SWITCH'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="defaultValue" label="默认值">
            <a-radio-group v-model="formData.defaultValue as string">
              <a-radio value="1">TRUE</a-radio>
              <a-radio value="0">FALSE</a-radio>
              <a-radio v-if="['BIT'].includes(formData.selectType)" value="">NULL</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <!--  数值类型 number   -->
        <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="defaultValue" label="默认值">
            <a-input-number
                v-model="formData.defaultValue as number"
                :max="selectData.max"
                :min="selectData.min"
                :placeholder="`长度 [${selectData.min},${selectData.max}]`"
                :precision="formData.numericScale"/>
          </a-form-item>
        </a-col>
        <!--   最大分数 score   -->
        <a-col v-if="['SCORE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: ['SCORE'].includes(formData.selectType),message: '这是必填项'}]" field="defaultValue" label="最大值">
            <a-input-number
                v-model="formData.defaultValue as number"
                :max="selectData.max"
                :min="selectData.min"
                :placeholder="`长度 [${selectData.min},${selectData.max}]`"
                :precision="formData.numericScale"/>
          </a-form-item>
        </a-col>

        <!--  json类型，多组件   -->
        <a-divider v-if="['MULTICOMPONENT'].includes(formData.selectType)" style="margin: 5px 0;"/>
        <a-col v-if="['MULTICOMPONENT'].includes(formData.selectType)" :span="(labelCol+wrapperCol)">
          <a-form-item :wrapper-col-props="{ span: labelCol+wrapperCol }" field="typeExtra">
            <a-space direction="horizontal" size="mini" style="width:100%;display: inline-flex;flex-wrap: wrap;justify-content: flex-start;">
              <a-card v-for="(item,index) of multiComponentData" :key="index" :title="item.title" hoverable size="small" style="width:318px;margin-top: 4px;">
                <template #extra>
                  <a-space>
                    <a-tooltip v-if="(index+1)===multiComponentData.length" content="新增">
                      <a-link @click="clickAddMulti">
                        <gl-iconfont type="gl-plus-circle"/>
                      </a-link>
                    </a-tooltip>
                    <a-tooltip v-if="item.isEdit" content="保存">
                      <a-link status="success" @click="clickSaveMulti(item)">
                        <gl-iconfont type="gl-save"/>
                      </a-link>
                    </a-tooltip>
                    <a-tooltip v-if="!item.isEdit" content="编辑">
                      <a-link @click="clickEditMulti(item)">
                        <gl-iconfont type="gl-edit-square"/>
                      </a-link>
                    </a-tooltip>
                    <a-tooltip v-if="1!==multiComponentData.length" content="删除">
                      <a-link status="danger" @click="clickDeleteMulti(item)">
                        <gl-iconfont type="gl-delete"/>
                      </a-link>
                    </a-tooltip>
                  </a-space>
                </template>
                <a-col v-if="item.isEdit">
                  <a-form-item :required="true" :style="{'margin-bottom': '5px'}" label="名称">
                    <a-input v-model.trim="item.title" :max-length="32" placeholder="中文，如：‘创建时间’。" size="small"/>
                  </a-form-item>
                </a-col>
                <a-col v-if="item.isEdit">
                  <a-form-item :required="true" :style="{'margin-bottom': '5px'}" label="名称">
                    <a-input v-model.trim="item.fieldName" :max-length="32" placeholder="英文，如：‘createTime’的驼峰规则字符串。" size="small"/>
                  </a-form-item>
                </a-col>
                <a-col v-if="item.isEdit">
                  <a-form-item :required="true" :style="{'margin-bottom': '5px'}" label="类型">
                    <a-select v-model="item.selectType" :options="selectTypeOptions" allow-search size="small" @change="selectTypeMultiChange(item)"/>
                  </a-form-item>
                </a-col>
                <a-col v-if="item.isEdit&&['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(item.dataType)">
                  <a-form-item :required="true" :style="{'margin-bottom': '5px'}" label="长度">
                    <a-input-number v-model="item.charMaxLength" :disabled="item.columnSelectType?.fixed" :max="item.columnSelectType?.radius.max" :min="1"
                                    :placeholder="`长度 [1,${item.columnSelectType?.radius.max}]`" :precision="0"/>
                  </a-form-item>
                </a-col>
                <a-col v-if="item.isEdit&&['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(item.selectType)">
                  <a-form-item :required="true" :style="{'margin-bottom': '5px'}" label="整数位">
                    <a-input-number v-model="item.numericPrecision" :max="item.columnSelectType?.radius.unDigit" :min="1"
                                    :placeholder="`长度 [1,${item.columnSelectType?.radius.unDigit}]`" :precision="0"/>
                  </a-form-item>
                </a-col>
                <a-col v-if="item.isEdit&&['DECIMAL'].includes(item.dataType)">
                  <a-form-item :required="true" :style="{'margin-bottom': '5px'}" label="小数位">
                    <a-input-number v-model="item.numericScale" :max="item.columnSelectType?.radius.precision" :min="1"
                                    :placeholder="`长度 [1,${item.columnSelectType?.radius.precision}]`" :precision="0"/>
                  </a-form-item>
                </a-col>
                <div v-if="!item.isEdit">
                  <div v-if="['CHAR','VARCHAR','REMARK','ORG','USER','UPLOAD'].includes(item.selectType)">
                    {{ `${item.fieldName} | ${item.dataType}(${item.charMaxLength}) | ${getFormatSelectType(item.selectType)}` }}
                  </div>
                  <div v-else-if="['DICTIONARY','RADIO','CODE','COLOR','ENTITY','TEXT','RICHTEXT','SCRIPT'].includes(item.selectType)">
                    {{ `${item.fieldName} | ${getFormatSelectType(item.selectType)}` }}
                  </div>
                  <div v-else-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT'].includes(item.selectType)">
                    {{ `${item.fieldName} | ${item.dataType}(${item.numericPrecision}) | ${getFormatSelectType(item.selectType)}` }}
                  </div>
                  <div v-else-if="['DECIMAL','SCORE'].includes(item.selectType)">
                    {{ `${item.fieldName} | ${item.dataType}(${item.numericPrecision}, ${item.numericScale}) | ${getFormatSelectType(item.selectType)}` }}
                  </div>
                  <div v-else>
                    {{ `${item.fieldName} | ${getFormatSelectType(item.selectType)}` }}
                  </div>
                </div>
              </a-card>
            </a-space>
          </a-form-item>
        </a-col>

        <!--   组织用户特供   -->
        <a-divider v-if="['ORG','USER'].includes(formData.selectType)" style="margin: 5px 0;"/>
        <a-col v-if="['ORG','USER'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="autoAdd" label="自动添加" tooltip="组织、用户需要一对字段用于存放主键和名称">
            <a-checkbox-group v-model="formData.autoAdd as string[]" :max="1" @change="autoAddChange(formData.autoAdd.toString())">
              <a-checkbox value="1">是</a-checkbox>
              <a-checkbox value="0">否</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col v-if="formData.autoAdd.toString()==='1'" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item
              :rules="[{required: formData.autoAdd.toString()==='1',message: '这是必填项'},{match: /^[a-z][a-z0-9_]+$/,message:'匹配：‘a-z’、‘0-9’、‘_’'}]"
              field="autoName" label="添加标识" tooltip="字段标识，用于存放对应的主键或名称；配置一致。">
            <a-input v-model="formData.autoName" :max-length="30" @blur="autoNameBlur"/>
          </a-form-item>
        </a-col>

        <a-divider style="margin: 5px 0;"/>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="nullable" label="是否可空">
            <a-radio-group v-model="formData.nullable" :options="nullableOptions" :rules="[{required: true,message: '这是必填项'}]">
              <template #label="{ data }">{{ data.label }}</template>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="key" label="是否主键">
            <a-radio-group v-model="formData.key" :options="keyOptions" :rules="[{required: true,message: '这是必填项'}]">
              <template #label="{ data }">{{ data.label }}</template>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <!--  数值类型，自动递增    -->
        <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT'].includes(formData.selectType)&&formData.key===1" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="autoIncrement" label="自动递增">
            <a-radio-group v-model="formData.autoIncrement" :options="autoIncrementOptions">
              <template #label="{ data }">{{ data.label }}</template>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="key" label="唯一约束">
            <a-radio-group v-model="formData.uniqued" :options="uniquedOptions" :rules="[{required: true,message: '这是必填项'}]">
              <template #label="{ data }">{{ data.label }}</template>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="key" label="是否加密">
            <a-radio-group v-model="formData.encrypted" :options="encryptedOptions" :rules="[{required: true,message: '这是必填项'}]">
              <template #label="{ data }">{{ data.label }}</template>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
.form .arco-form-item {
  margin-bottom: 12px;
}

.select-button {
  height: 31.6px;
  padding: 0 8px;
  font-weight: bold;
}

.button-success {
  color: rgb(var(--success-6));
}

.button-primary {
  color: rgb(var(--primary-6));
}
</style>