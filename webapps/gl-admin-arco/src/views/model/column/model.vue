<script lang="ts">
export default {
  name: 'ModelTableColumnModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Message, Modal, SelectOptionGroup} from "@arco-design/web-vue";
import {
  ColumnSelectType,
  createOrUpdateTableColumn as createOrUpdateForm, getTableColumn as getForm, getTypeSelectOptions, handleSelectType,
  QueryMultiComponentForm,
  QueryTableColumnForm,
  QueryTableColumnForm as QueryForm,
  queryTableColumns,
  QueryTableForm,
  queryTables, validateTableColumnName
} from "@/api/model";
import {QueryDictForm, QueryDictItemForm, queryDicts, queryItemByDictCode} from "@/api/security";
import {QueryEncodingForm, queryEncodings} from "@/api/encoding";
import {PageQueryRequest} from "@/api/base";
import {formatSeparator, toCamelCase} from "@/utils/strings";
import {isBlank, isNotBlank} from "@/utils/is";
import {getAppSelectOptions, QueryAppForm} from "@/api/application";
import DictionaryLayout from "@/views/security/dictionary/layout.vue";
import {
  autoIncrementOptions,
  enableStatusOptions,
  encryptedOptions,
  keyOptions, markerOptions,
  nullableOptions,
  numericSignedOptions
  , uniquedOptions
} from "./searchTable";

// 页面所需 参数
type PageParams = {
  connectId: string; // 数据库链接id
  tableId: string; // 模型名称
  tableName: string;
  isSync: boolean; // 是否同步
  isSystem: boolean; // 是否系统表
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
});

const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: props.modelValue || '',
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
    extraValue: '',
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
    marker: [],
    seqNo: 1,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<QueryAppForm[]>([]);
const columnSelectType = ref<ColumnSelectType[]>([]);
const selectTypeOptions = ref<SelectOptionGroup[]>([]);
const entityIsEdit = ref<boolean>(false);
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
    Message.warning(t('model.column.index.multi.valid.text'));
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
    const {data} = await queryDicts({
      enableStatus: 1,
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    } as unknown as QueryDictForm);
    selectDictionaryOptions.value = data || [];
  } catch (err) {
    selectDictionaryOptions.value = [];
  }
}
const selectDictItemOptions = ref<QueryDictItemForm[]>([]);
const getSelectDictItemOptions = async (value?: string) => {
  try {
    if (formData.value.typeExtra) {
      const {data} = await queryItemByDictCode(formData.value.typeExtra as string);
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
    const {data} = await queryEncodings({
      enableStatus: 1,
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    } as unknown as QueryEncodingForm);
    selectCodeOptions.value = data || [];
  } catch (err) {
    selectCodeOptions.value = [];
  }
}
const selectEntityOptions = ref<QueryTableForm[]>([]);
const getSelectEntityOptions = async (params?: Record<string, any>) => {
  try {
    const {data} = await queryTables({
      ...params,
      enableStatus: 1, tableType: 'table',
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    } as unknown as PageQueryRequest);
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
      const {data} = await queryTableColumns({
        ...params,
        enableStatus: 1, tableId: formData.value.typeExtra,
        appId: '', tenantCode: props.parameter?.tenantCode || ''
      } as unknown as PageQueryRequest);
      selectEntityColumnOptions.value = data;
      formData.value.extraValue = value || getKeyId(data);
    } else {
      selectEntityColumnOptions.value = [];
    }
  } catch (err) {
    selectEntityColumnOptions.value = [];
  }
}

const entityChange = (value?: string) => {
  formData.value.extraValue = '';
  selectEntityColumnOptions.value = [];
  getSelectEntityColumnOptions(value || "");
}
const entityChange1 = () => {
  entityChange();
  // 优化字段标识自动填写
  if (!formData.value.name) {
    if (formData.value.typeExtra) {
      // eslint-disable-next-line no-restricted-syntax
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
const saveData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    const saveData = {...params};
    saveData.autoAdd = Number(saveData.autoAdd.toString());
    saveData.defaultValue = saveData.defaultValue && saveData.defaultValue.toString();
    saveData.typeExtra = saveData.typeExtra && saveData.typeExtra.toString();
    saveData.marker = saveData.marker && saveData.marker.toString();
    if (['MULTICOMPONENT'].includes(saveData.selectType)) {
      saveData.typeExtra = getMultiData();
    }
    try {
      const {data} = await createOrUpdateForm(saveData);
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
    const {data} = await getForm(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
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
    params.marker = params.marker && params.marker.toString();
    const {data} = await validateTableColumnName(params);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}


const formatFieldString = (value: string) => {
  value = formatSeparator(value, " ").join("_");
  value = formatSeparator(value, "_").join("_");
  return value.toLowerCase();
}
/**
 * 字段名称 生成 字段名称
 */
const columnNameBlur = (ev?: FocusEvent) => {
  formData.value.name = formatFieldString(formData.value.name);
  validateForm.value?.validateField("name");
  formData.value.fieldName = toCamelCase(formData.value.name);
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
  formData.value.extraValue = '';
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

  if (['DICTIONARY'].includes(formData.value.selectType)) getSelectDictionaryOptions();
  if (['CODE'].includes(formData.value.selectType)) getSelectCodeOptions();
  if (['ENTITY'].includes(formData.value.selectType)) getSelectEntityOptions();
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
  if (formData.value.autoAdd.toString() === '1' && isNotBlank(formData.value.name)) {
    if (isBlank(formData.value.autoName)) {
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
  width: '80%',
  height: window.innerHeight * 0.8,
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
  // eslint-disable-next-line no-restricted-syntax
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
    Message.warning('请选项需要编辑的字典！');
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

const keyChange = () => {
  if (formData.value.key === 1) {
    // (formData.value.marker as string[]).push('id');
    formData.value.marker = ['id'];
  } else {
    formData.value.marker = (formData.value.marker as string[]).filter((item) => item !== 'id');
  }
}
const markerChange = () => {
  if ((formData.value.marker as string[]).includes('id')) {
    formData.value.key = 1;
  } else {
    formData.value.key = 0;
  }
}
/**
 * 文本域查看
 * @param content
 */
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
/**
 * 重置验证信息
 */
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/**
 * 页面数据创建或更新方法，对外提供
 * @param successBack
 * @param failBack
 */
const saveOrUpdate = (successBack?: any, failBack?: any) => {
  saveData(formData.value, (data: QueryForm) => {
    // 设计当前页面的操作
    if (successBack && typeof successBack === 'function') successBack(data);
  }, () => {
    if (failBack && typeof failBack === 'function') failBack();
  });
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = async () => {
  if (props.formState === 'add' || (props.formState === 'edit' && props.parameter.isSync === false)) {
    entityIsEdit.value = true;
  } else {
    entityIsEdit.value = false;
  }
  layoutParams.value.height = window.innerHeight * 0.8;
  // 应用信息
  getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 模型字段类型
  await getTypeSelectOptions((data: ColumnSelectType[]) => {
    columnSelectType.value = data || [];
    selectTypeOptions.value = handleSelectType(columnSelectType.value);
  }, () => {
    columnSelectType.value = [];
    selectTypeOptions.value = [];
  });
  // 表单数据重置
  multiComponentData.value = [generateMultiComponentData()];
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 数据字典
  layoutParams.value.parameter = {
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }
  // 其他初始化
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    await getData(props.modelValue, (data: QueryForm) => {
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
      data.marker = (data.marker ? (data.marker as string).split(',') : []) as string[];
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
        getSelectDictionaryOptions();
        dictionaryChange(data.defaultValue as string);
      }
      if (['ENTITY'].includes(data.selectType)) {
        getSelectEntityOptions();
        entityChange(data.defaultValue as string);
      }
      if (['CODE'].includes(formData.value.selectType)) getSelectCodeOptions();
    });
  }
}

watch(() => props, () => {
  if (props.visible === true) loadPage();
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({saveOrUpdate, loadPage});
</script>

<template>
  <DictionaryLayout v-model:visible="layoutParams.visible"
                    :formCol="layoutParams.formCol"
                    :formState="layoutParams.formState"
                    :height="layoutParams.height"
                    :isModal="layoutParams.isModal"
                    :modelValue="layoutParams.id"
                    :parameter="layoutParams.parameter"
                    :title="layoutParams.title"
                    :width="layoutParams.width"
                    @listChange="dictItemChange"
                    @saveSuccess="dictSaveSuccess"/>
  <DictionaryLayout v-model:visible="layoutParams.visible"
                    :formCol="layoutParams.formCol"
                    :formState="layoutParams.formState"
                    :height="layoutParams.height"
                    :isModal="layoutParams.isModal"
                    :modelValue="layoutParams.id"
                    :parameter="layoutParams.parameter"
                    :title="layoutParams.title"
                    :width="layoutParams.width"
                    @listChange="dictItemChange"
                    @saveSuccess="dictSaveSuccess"/>

  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.title')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="title">
          <a-input v-model.trim="formData.title" :max-length="32"/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.name')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')},
            {match: /^[a-z][a-z0-9_]+$/,message:$t('model.form.rules.match.columnName.match')},
            {validator:validateCode}]"
            field="name">
          <a-input v-if="entityIsEdit" v-model.trim="formData.name" :max-length="30"
                   placeholder="存入数据库表的字段，如：‘create_time’用‘_’分割的字符串。"
                   @blur="columnNameBlur($event)"/>
          <span v-else>{{ formData.name }}</span>
          <a-tooltip content="变更“字段标识”，更新后会同步至数据库">
            <a-button v-if="!entityIsEdit" size="medium" type="text" @click="ev => {entityIsEdit=true}">
              <icon-edit/>
            </a-button>
          </a-tooltip>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.fieldName')"
                     :rules="[{required: formState==='add',message: $t('model.form.rules.match.required')}]"
                     field="fieldName">
          <a-input v-if="formState==='add'" v-model.trim="formData.fieldName" :max-length="32"
                   :placeholder="$t('model.column.index.form.fieldName.placeholder')" readonly/>
          <span v-else>{{ formData.fieldName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.appId')"
                     :rules="[{required: !!parameter.appId,message: $t('model.form.rules.match.required')}]"
                     field="appId">
          <a-select v-model="formData.appId" :disabled="formState==='view'||!parameter.appId">
            <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.comment')"
            field="comment">
          <a-textarea v-model="formData.comment" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.description')"
            field="description">
          <a-textarea v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.ordinalPosition')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="ordinalPosition">
          <a-input-number
              v-model="formData.ordinalPosition"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
        </a-form-item>
      </a-col>


      <a-divider style="margin:0 0 10px 0;"/>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.dataType')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="selectType">
          <a-select v-model="formData.selectType" :options="selectTypeOptions" allow-search @change="selectTypeChange(formData.selectType)"/>
        </a-form-item>
      </a-col>
      <!-- 字符串 长度设置 -->
      <a-col v-if="['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(formData.dataType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.charMaxLength')"
            :rules="[{required: ['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="charMaxLength">
          <a-input-number
              v-model="formData.charMaxLength"
              :disabled="selectData.fixed"
              :max="selectData.max"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+`[1,${selectData.max}]`" :precision="0"/>
        </a-form-item>
      </a-col>
      <!-- 数值类型，是否有符号 -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericSigned')"
            :rules="[{required: ['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL'].includes(formData.selectType),message: $t('model.form.rules.match.required')}]"
            field="numericSigned">
          <a-radio-group v-model="formData.numericSigned" :disabled="['SCORE'].includes(formData.selectType)" :options="numericSignedOptions"
                         @change="numericSignedChange(formData.numericSigned as boolean,$event)">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!-- 数值类型，整数位 -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericPrecision')"
            :rules="[{required: ['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(formData.selectType),message: $t('model.form.rules.match.required')}]"
            field="numericPrecision">
          <a-input-number
              v-model="formData.numericPrecision"
              :max="selectData.digit"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+`[1,${selectData.digit}]`"
              :precision="0" @blur="numericPrecisionBlur($event)"/>
        </a-form-item>
      </a-col>
      <!-- 数值类型，小数位 -->
      <a-col v-if="['DECIMAL'].includes(formData.dataType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.numericScale')"
            :rules="[{required: ['DECIMAL'].includes(formData.dataType),message: $t('model.form.rules.match.required')}]"
            field="numericScale">
          <a-input-number
              v-model="formData.numericScale"
              :max="selectData.precision"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+`[1,${selectData.precision}]`"
              :precision="0" @blur="numericScaleBlur($event)"/>
        </a-form-item>
      </a-col>
      <!-- 默认值 defaultValue -->
      <a-col v-if="['CHAR','VARCHAR','REMARK','TEXT','RICHTEXT','SCRIPT'].includes(formData.selectType)" :span="(labelCol+wrapperCol)">
        <a-form-item
            :label="$t('model.column.index.form.defaultValue')"
            :label-col-props="{ span: labelCol/formCol }"
            :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
            field="defaultValue">
          <a-textarea v-model="formData.defaultValue" :auto-size="{minRows:2,maxRows:4}" :max-length="formData.charMaxLength" show-word-limit/>
        </a-form-item>
      </a-col>
      <!--   默认范围 typeExtra 字典项、流水号、实体   -->
      <a-col v-if="['CODE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.defaultRange')"
            field="typeExtra">
          <a-select v-if="formState!=='view'&&['CODE'].includes(formData.selectType)" v-model="formData.typeExtra" allow-clear allow-search>
            <a-option v-for="item of selectCodeOptions" :key="item.id" :label="`${item.title}[${item.example}]`" :value="item.id"/>
          </a-select>
        </a-form-item>
      </a-col>
      <!--  实体字段    -->
      <a-col v-if="['ENTITY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.defaultRange1')" field="typeExtra">
          <a-select v-if="formState!=='view'&&['ENTITY'].includes(formData.selectType)" v-model="formData.typeExtra" allow-clear allow-search
                    @change="entityChange1">
            <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col v-if="['ENTITY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.defaultRange2')"
            field="extraValue">
          <a-select v-if="formState!=='view'" v-model="formData.extraValue" allow-clear allow-search>
            <a-option v-for="item of selectEntityColumnOptions" :key="item.id" :label="`${item.title}[${item.fieldName}]`" :value="item.id"/>
          </a-select>
        </a-form-item>
      </a-col>
      <!--  数据字典    -->
      <a-col v-if="['DICTIONARY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.defaultRange')"
            field="typeExtra">
          <a-tooltip v-if="!formData.typeExtra" content="新增数据字典">
            <a-button class="select-button button-primary" @click="openAddDict">
              <icon-plus/>
            </a-button>
          </a-tooltip>
          <a-select v-if="formState!=='view'&&['DICTIONARY'].includes(formData.selectType)" v-model="formData.typeExtra" allow-clear allow-search
                    @change="dictionaryChange1">
            <a-option v-for="item of selectDictionaryOptions" :key="item.id" :label="`${item.dictName}[${item.dictCode}]`" :value="item.dictCode"/>
          </a-select>
          <a-tooltip v-if="formData.typeExtra" content="编辑数据字典">
            <a-button class="select-button button-success" @click="openEditDict">
              <icon-edit/>
            </a-button>
          </a-tooltip>
        </a-form-item>
      </a-col>
      <a-col v-if="['DICTIONARY'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.defaultValue')"
            field="defaultValue">
          <a-select v-if="formState!=='view'" v-model="formData.defaultValue" allow-clear allow-search>
            <a-option v-for="item of selectDictItemOptions" :key="item.id" :label="`${item.itemName}[${item.itemCode}]`" :value="item.itemCode"/>
          </a-select>
        </a-form-item>
      </a-col>

      <!--  布尔值 defaultValue -->
      <a-col v-if="['BIT','SWITCH'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-radio-group v-model="formData.defaultValue">
            <a-radio value="1">TRUE</a-radio>
            <a-radio value="0">FALSE</a-radio>
            <a-radio v-if="['BIT'].includes(formData.selectType)" value="">NULL</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!--  数值类型 number   -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.defaultValue')" field="defaultValue">
          <a-input-number
              v-model="formData.defaultValue"
              :max="selectData.max"
              :min="selectData.min"
              :placeholder="$t('model.form.rules.match.length.title')+`[${selectData.min},${selectData.max}]`"
              :precision="formData.numericScale"/>
        </a-form-item>
      </a-col>
      <!--   最大分数 score   -->
      <a-col v-if="['SCORE'].includes(formData.selectType)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.defaultMaxValue')"
            :rules="[{required: ['SCORE'].includes(formData.selectType),message: $t('model.form.rules.match.required')}]"
            field="defaultValue">
          <a-input-number
              v-model="formData.defaultValue"
              :max="selectData.max"
              :min="selectData.min"
              :placeholder="$t('model.form.rules.match.length.title')+`[${selectData.min},${selectData.max}]`"
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
                  <a-tooltip v-if="(index+1)===multiComponentData.length" :content="$t('model.column.index.multi.add.text')">
                    <a-link @click="clickAddMulti($event)">
                      <icon-plus/>
                    </a-link>
                  </a-tooltip>
                  <a-tooltip v-if="item.isEdit" :content="$t('model.column.index.multi.save.text')">
                    <a-link status="success" @click="clickSaveMulti(item)">
                      <icon-save/>
                    </a-link>
                  </a-tooltip>
                  <a-tooltip v-if="!item.isEdit" :content="$t('model.column.index.multi.edit.text')">
                    <a-link @click="clickEditMulti(item)">
                      <icon-edit/>
                    </a-link>
                  </a-tooltip>
                  <a-tooltip v-if="1!==multiComponentData.length" :content="$t('model.column.index.multi.delete.text')">
                    <a-link status="danger" @click="clickDeleteMulti(item)">
                      <icon-delete/>
                    </a-link>
                  </a-tooltip>
                </a-space>
              </template>
              <a-col v-if="item.isEdit">
                <a-form-item :label="$t('model.column.index.form.m.title')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input v-model.trim="item.title" :max-length="32" :placeholder="$t('model.column.index.form.m.title.p')" size="small"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit">
                <a-form-item :label="$t('model.column.index.form.m.fieldName')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input v-model.trim="item.fieldName" :max-length="32" :placeholder="$t('model.column.index.form.m.fieldName.p')" size="small"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit">
                <a-form-item :label="$t('model.column.index.form.dataType')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-select v-model="item.selectType" :options="selectTypeOptions" allow-search size="small" @change="selectTypeMultiChange(item)"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit&&['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'].includes(item.dataType)">
                <a-form-item :label="$t('model.column.index.form.charMaxLength')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input-number v-model="item.charMaxLength" :disabled="item.columnSelectType.fixed" :max="item.columnSelectType.radius.max" :min="1"
                                  :placeholder="$t('model.form.rules.match.length.title')+`[1,${item.columnSelectType.radius.max}]`"
                                  :precision="0"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit&&['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT','DECIMAL','SCORE'].includes(item.selectType)">
                <a-form-item :label="$t('model.column.index.form.numericPrecision')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input-number v-model="item.numericPrecision" :max="item.columnSelectType.radius.unDigit" :min="1"
                                  :placeholder="$t('model.form.rules.match.length.title')+`[1,${item.columnSelectType.radius.unDigit}]`"
                                  :precision="0"/>
                </a-form-item>
              </a-col>
              <a-col v-if="item.isEdit&&['DECIMAL'].includes(item.dataType)">
                <a-form-item :label="$t('model.column.index.form.numericScale')" :required="true" :style="{'margin-bottom': '5px'}">
                  <a-input-number v-model="item.numericScale" :max="item.columnSelectType.radius.precision" :min="1"
                                  :placeholder="$t('model.form.rules.match.length.title')+`[1,${item.columnSelectType.radius.precision}]`"
                                  :precision="0"/>
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
        <a-form-item :label="$t('model.column.index.form.autoAdd')"
                     :tooltip="$t('model.column.index.form.autoAdd.tip')"
                     field="autoAdd">
          <a-checkbox-group v-model="formData.autoAdd"
                            :max="1"
                            @change="autoAddChange(formData.autoAdd.toString())">
            <a-checkbox value="1">{{ $t('model.column.index.form.autoAdd.1') }}</a-checkbox>
            <a-checkbox value="0">{{ $t('model.column.index.form.autoAdd.0') }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
      <a-col v-if="formData.autoAdd.toString()==='1'" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.column.index.form.autoName')"
            :rules="[{required: formData.autoAdd.toString()==='1',message: $t('model.form.rules.match.required')},
            {match: /^[a-z][a-z0-9_]+$/,message:$t('model.form.rules.match.columnName.match')}]"
            :tooltip="$t('model.column.index.form.autoName.tip')"
            field="autoName">
          <a-input v-model="formData.autoName" :max-length="30" @blur="autoNameBlur($event)"/>
        </a-form-item>
      </a-col>
      <a-divider style="margin: 5px 0;"/>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.nullable')" field="nullable">
          <a-radio-group v-model="formData.nullable"
                         :options="nullableOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.key')" field="key">
          <a-radio-group v-model="formData.key"
                         :options="keyOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]" @change="keyChange">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <!--  数值类型，自动递增    -->
      <a-col v-if="['TINYINT','SMALLINT','MEDIUMINT','INT','BIGINT'].includes(formData.selectType)&&formData.key===1" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.autoIncrement')" field="autoIncrement">
          <a-radio-group v-model="formData.autoIncrement" :options="autoIncrementOptions">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.uniqued')" field="key">
          <a-radio-group v-model="formData.uniqued"
                         :options="uniquedOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.encrypted')" field="key">
          <a-radio-group v-model="formData.encrypted"
                         :options="encryptedOptions"
                         :rules="[{required: true,message: $t('model.form.rules.match.required')}]">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-divider style="margin: 5px 0;"/>
      <a-col :span="labelCol+wrapperCol">
        <a-form-item :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="key" label="特殊标记">
          <a-checkbox-group v-model="formData.marker" :max="1" :options="markerOptions" @change="markerChange">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-checkbox-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

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