<script lang="ts">
export default {
  name: 'GlModelTableViewForm'
};
</script>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import type {TableColumnData, FormInstance, TableData} from "@arco-design/web-vue";
import {modelApi, applicationApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryViewForm, QueryTableColumnForm, QueryTableForm, QueryAppForm} from '@geelato/gl-ui';
import {enableStatusOptions, linkedOptions, viewTypeOptions} from "./searchTable";
import {selectTypeOptions, defaultColumnMetas} from '../column/searchTable';

type PageParams = {
  connectId: string; // 数据库链接id
  entityName: string; // 模型名称
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
  title: {type: String, default: '模型视图'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const global = useGlobal();
const tabsKey = ref<number>(1);// 定位tabs页面
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const tableTabHeight = ref<number>(555);
const tableTabStyle = ref({height: `${tableTabHeight.value}px`});
const scrollbar = ref(true);
const scroll = ref({x: 1000, y: tableTabHeight.value - 118});
const appSelectOptions = ref<QueryAppForm[]>([]);

const generateFormData = (): QueryViewForm => {
  return {
    id: '',
    connectId: props.parameter.connectId || '', // 数据库连接 id
    entityName: props.parameter.entityName || '', // 实体名称
    title: '', // 名称(中文)
    viewName: '', // 数据库中的表名
    viewType: 'custom', // 视图类型 default:默认视图;custom:自定义视图
    viewConstruct: '',
    viewColumn: '',
    enableStatus: 1, // 状态
    seqNo: 1, // 排序
    linked: 0, // 已链接
    description: '', // 补充描述
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());

// 表单
const columnData = ref<Record<string, any>[]>([]);
const handleChange = (_data: any[]) => {
  columnData.value = _data;
}

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryViewForm, successBack?: any, failBack?: any) => {
  tabsKey.value = 1;
  const res = await validateForm.value?.validate();
  if (!res) {
    params.viewName = props.formState === 'add' ? `v_${params.viewName}` : params.viewName;
    params.viewColumn = JSON.stringify(columnData.value);
    try {
      const {data} = await modelApi.createOrUpdateView(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else {
    if (failBack && typeof failBack === 'function') failBack();
    setTimeout(() => {
      if (!params.viewConstruct) {
        tabsKey.value = 2;
      } else if (columnData.value.length == 0) {
        tabsKey.value = 3;
      }
    }, 1000 * 3);
  }
};
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.getView(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 唯一性校验
 * @param params
 * @param successBack
 * @param failBack
 */
const validateTableView = async (params: QueryViewForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await modelApi.validateMetaView(params.connectId, params.viewConstruct);
      successBack(data);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};

const viewNameBlur = (ev?: FocusEvent) => {
  const entity = formData.value.entityName.toLowerCase();
  const view = formData.value.viewName ? formData.value.viewName.toLowerCase() : "";
  if (formData.value.viewType === "custom" && entity === view) {
    global.$message.warning({content: `[v_${entity}] 这是’默认视图‘的名称`});
  }
  formData.value.viewName = view;
}
const editorMounted = (editor: any) => {
  console.log('editor实例加载完成', editor)
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
    if (params.viewName && !params.viewName.startsWith("v_")) params.viewName = `v_${params.viewName}`;
    const {data} = await modelApi.validateViewName(params);
    if (!data) callback('不能重复');
  } catch (err) {
    console.log(err);
  }
}
const matchViewConstruct = (value: any, callback: any) => {
  const regex = /^select .* from .*$/i;
  if (formData.value.viewConstruct) {
    const str = formData.value.viewConstruct.replace(/\r\n/g, ' ').replace(/\r\n\t/g, ' ');
    console.log(str)
    if (!str.match(regex)) callback('匹配：‘select * from table_name ...’');
  }
}
/**
 * 必填校验
 * @param value
 * @param callback
 */
const validateViewColumn = async (value: any, callback: any) => {
  if (columnData.value.length === 0) callback('这是必填项');
}

const validateViewSql = () => {
  validateTableView(formData.value, (result: boolean) => {
    if (result === true) {
      global.$message.success({content: '验证成功！'});
    } else {
      global.$message.warning({content: '验证失败，请检查Sql的正确性。'});
    }
  }, () => {
  });
}

const deleteViewColumn = (tableName: string, columnName: string) => {
  let index = -1;
  for (let i = 0; i < columnData.value.length; i += 1) {
    if (columnData.value[i].tableName === tableName && columnData.value[i].fieldName === columnName) {
      index = i;
    }
  }
  columnData.value.splice(index, 1);
}

/**
 * 添加，自定义字段
 */
const customAddEntityClick = (ev?: MouseEvent) => {
  columnData.value.push({
    id: '', // *
    tableId: '', // 表id *
    title: '', // 实体属性中文,中文名
    abstractColumnExpressions: '', //
    fieldName: '',// 列名
    tableSchema: '', // 数据库名
    tableName: '', // 表名
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
    deptId: '',
    buId: '',
    delStatus: 0,
    updateAt: '',
    updater: '',
    updaterName: '',
    createAt: '',
    creator: '',
    creatorName: '',
    deleteAt: '',
  } as QueryTableColumnForm);
}

/* 模型、字段选择 */
const entityPopover = ref(false);
const validateEntityForm = ref<FormInstance>();
const entityData = ref({tableId: '', columnIds: []});
const selectEntityOptions = ref<QueryTableForm[]>([]);
const selectEntityColumnOptions = ref<QueryTableColumnForm[]>([]);
const entityColumnSelectAll = ref<boolean>(false);
/**
 * 获取模型，启用的，当前租户
 * @param params
 */
const getSelectEntityOptions = async (params?: Record<string, any>) => {
  try {
    const {data} = await modelApi.queryTables({
      ...params,
      enableStatus: 1, tableType: 'table', appId: '', tenantCode: props.parameter.tenantCode || ''
    });
    selectEntityOptions.value = data || [];
  } catch (err) {
    selectEntityOptions.value = [];
  }
}
/**
 * 获取模型字段，启用的，当前租户的，选中的模型
 * @param params
 */
const getSelectEntityColumnOptions = async (params?: Record<string, any>) => {
  try {
    if (entityData.value.tableId) {
      const {data} = await modelApi.queryTableColumns({
        ...params,
        enableStatus: 1, tableId: entityData.value.tableId, appId: '', tenantCode: props.parameter.tenantCode || ''
      });
      selectEntityColumnOptions.value = [];
      data.forEach((item, index) => {
        if (!defaultColumnMetas.value.includes((item as unknown as QueryTableColumnForm).name)) {
          selectEntityColumnOptions.value.push(item);
        }
      });
    } else {
      selectEntityColumnOptions.value = [];
    }
  } catch (err) {
    selectEntityColumnOptions.value = [];
  }
}
/**
 * 模型选择变更
 * @param value
 */
const entityChange = () => {
  // 清理模型字段，
  entityData.value.columnIds = [];
  // 取消全选
  entityColumnSelectAll.value = false;
  // 重置模型字段集合
  getSelectEntityColumnOptions();
}
/**
 * 打开表单
 * @param ev
 */
const entityPopoverClick = async (ev?: MouseEvent) => {
  // 取消全选
  entityColumnSelectAll.value = false;
  // 清理选择，
  entityData.value = {tableId: "", columnIds: []};
  selectEntityColumnOptions.value = [];
  // 清理验证，
  await validateEntityForm.value?.resetFields();
  // 获取模型，
  await getSelectEntityOptions();
  // 打开表单
  entityPopover.value = true;
}
/**
 * 模型字段变更与全选的联动
 */
const entityColumnChange = () => {
  let isSelectedAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of selectEntityColumnOptions.value) {
    // @ts-ignore
    if (!entityData.value.columnIds.includes(item.id)) {
      isSelectedAll = false;
    }
  }
  entityColumnSelectAll.value = isSelectedAll;
}
/**
 * 全选变更与模型字段选择联动
 */
const entityColumnSelectAllChange = () => {
  if (entityColumnSelectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of selectEntityColumnOptions.value) {
      // @ts-ignore
      if (!entityData.value.columnIds.includes(item.id)) {
        // @ts-ignore
        entityData.value.columnIds.push(item.id);
      }
    }
  } else {
    entityData.value.columnIds = [];
  }
}
/**
 * 点击添加按钮
 * @param ev
 */
const entitySubmitClick = async (ev?: MouseEvent) => {
  const res = await validateEntityForm.value?.validate();
  if (!res) {
    entityPopover.value = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of entityData.value.columnIds) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of selectEntityColumnOptions.value) {
        if (item.id === entity) {
          columnData.value.push(item);
        }
      }
    }
  }
}

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, (data: QueryViewForm) => {
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

// 页面样式
const resetPageStyle = () => {
  return {
    width: document.documentElement.clientWidth / 2,
    height: document.documentElement.clientHeight * 2 / 3,
    theme: document.body.getAttribute('arco-theme') === 'dark' ? 'vs-dark' : 'vs'
  };
}
const pageStyle = ref(resetPageStyle());
// html 属性变化监听
const bodyObserver = new MutationObserver(function (mutations, instance) {
  mutations.forEach(function (mutation) {
    pageStyle.value = resetPageStyle();
  });
});

watch(() => props, () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    // 调整高度
    tableTabHeight.value = window.innerHeight * 0.6;
    tableTabStyle.value.height = `${tableTabHeight.value}px`;
    scroll.value.y = tableTabHeight.value - 118;
    // 应用信息
    applicationApi.getAppSelectOptions({
      id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data || [];
    }, () => {
      appSelectOptions.value = [];
    });
    // 清理视图字段
    columnData.value = [];
    // 表单数据重置
    formData.value = generateFormData();
    // 重置验证
    resetValidate();
    pageStyle.value = resetPageStyle();
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      getData(props.modelValue, (data: QueryViewForm) => {
        data.seqNo = Number(data.seqNo);
        formData.value = data;
        columnData.value = utils.isJSON(data.viewColumn) ? JSON.parse(data.viewColumn) : [];
      });
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});

type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'" :title="title" :width="width"
           cancel-text="取消" ok-text="确认" title-align="start"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="tableTabStyle" position="left" type="line">
      <a-tab-pane :key="1" class="a-tabs-one" title="基础信息">
        <a-card class="general-card">
          <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
            <a-row :gutter="wrapperCol">
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="title" label="名称(中文)">
                  <a-input v-if="formState!=='view'" v-model.trim="formData.title" :max-length="32"/>
                  <span v-else>{{ formData.title }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: formState==='add',message: '这是必填项'},
                {match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message: '不以‘v_’、‘V_’开头'},
                {match:formState==='add'?/^(?!v_|V_)/:/^[vV][a-zA-Z0-9_]*$/,message: '不以‘v_’、‘V_’开头'},
                {validator:validateCode}]" field="viewName" label="名称(英文)">
                  <a-input v-if="formState==='add'" v-model.trim="formData.viewName" :max-length="32" @blur="viewNameBlur">
                    <template #prepend>
                      v_
                    </template>
                  </a-input>
                  <span v-else>{{ formData.viewName }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'},{validator:matchViewConstruct}]" field="viewConstruct" label="视图语句">
                  <a-space>
                    <a-button @click="()=>{tabsKey=2}">
                      <template #icon>
                        <gl-iconfont type="gl-edit-square"/>
                      </template>
                      编辑视图语句
                    </a-button>
                    <a-popconfirm content="是否验证视图语句有效性？" position="tr" type="info" @ok="validateViewSql">
                      <a-button status="success" type="primary">
                        验证
                        <template #icon>
                          <gl-iconfont type="gl-list"/>
                        </template>
                      </a-button>
                    </a-popconfirm>
                  </a-space>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{validator:validateViewColumn}]" field="viewColumn" label="视图字段">
                  <a-button @click="()=>{tabsKey=3}">
                    <template #icon>
                      <gl-iconfont type="gl-edit-square"/>
                    </template>
                    编辑视图字段
                  </a-button>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="viewType" label="视图类型">
                  <span>{{ utils.getOptionLabel(formData.viewType, viewTypeOptions) }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: false,message: '这是必填项'}]" field="appId" label="所属应用">
                  <a-select v-model="formData.appId" :disabled="formState==='view'">
                    <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
                  <a-select v-if="formState!=='view'" v-model="formData.enableStatus" :options="enableStatusOptions"/>
                  <span v-else>{{ utils.getOptionLabel(formData.enableStatus, enableStatusOptions) }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="linked" label="连接状态">
                  <a-select v-if="formState!=='view'" v-model="formData.linked" :options="linkedOptions"/>
                  <span v-else>{{ utils.getOptionLabel(formData.linked, linkedOptions) }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="seqNo" label="排序">
                  <a-input-number v-if="formState!=='view'" v-model="formData.seqNo" :max="999999999" :min="1" :precision="0" placeholder="长度[0,999999999]"/>
                  <span v-else>{{ formData.seqNo }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="labelCol+wrapperCol">
                <a-form-item :label-col-props="{ span: labelCol/formCol }"
                             :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                             field="description" label="补充描述">
                  <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
                  <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{
                      formData.description
                    }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="2" class="a-tabs-one" title="视图语句">
        <a-card class="general-card">
          <div class="trigger-demo-translate">
            <GlMonacoEditor v-model="formData.viewConstruct" :height="tableTabHeight-34" language="sql" style="width: 100%;"/>
          </div>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="3" class="a-tabs-two" title="视图字段">
        <a-card class="general-card">
          <a-space v-if="formState!=='view'" style="margin-bottom: 10px">
            <a-button size="medium" type="primary" @click="customAddEntityClick">
              <template #icon>
                <gl-iconfont type="gl-plus-circle"/>
              </template>
              自定义字段
            </a-button>
            <a-popover v-model:popup-visible="entityPopover" position="right" style="max-width: 400px" trigger="click">
              <a-button size="medium" type="primary" @click="entityPopoverClick">
                <template #icon>
                  <gl-iconfont type="gl-plus-circle"/>
                </template>
                模型字段
              </a-button>
              <template #content>
                <a-form ref="validateEntityForm" :label-col-props="{ span: labelCol }" :model="entityData" :wrapper-col-props="{ span: wrapperCol }"
                        class="form2">
                  <a-row :gutter="wrapperCol">
                    <a-col :span="(labelCol+wrapperCol)">
                      <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="tableId" label="模型">
                        <a-select v-model="entityData.tableId" allow-search @change="entityChange">
                          <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="(labelCol+wrapperCol)">
                      <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="columnIds" label="字段">
                        <a-select v-model="entityData.columnIds" allow-search multiple @change="entityColumnChange">
                          <a-option v-for="item of selectEntityColumnOptions" :key="item.id" :label="`${item.title}[${item.fieldName}]`" :value="item.id"/>
                          <template #header>
                            <div class="check-all">
                              <a-checkbox v-model="entityColumnSelectAll" class="check-all-radio" @change="entityColumnSelectAllChange">
                            <span class="check-all-span">
                              全选
                            </span>
                              </a-checkbox>
                            </div>
                          </template>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
                <a-divider style="margin: 5px 0px"/>
                <a-space style="display: flex;align-items: center;justify-content: end;">
                  <a-button size="medium" type="primary" @click="entitySubmitClick">
                    确定
                  </a-button>
                </a-space>
              </template>
            </a-popover>
          </a-space>
          <a-table
              :key="tableTabHeight"
              :bordered="{cell:true}"
              :columns="(cloneColumns as TableColumnData[])"
              :data="columnData"
              :draggable="formState!=='view'?{type:'handle',width:40}:{}"
              :pagination="false"
              :scroll="scroll"
              :scrollbar="scrollbar"
              :stripe="true"
              column-resizable
              row-key="id" @change="handleChange">
            <template #columns>
              <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="title" fixed="left" title="名称（中文）">
                <template #cell="{record}">
                  <a-input v-if="formState!=='view'" v-model.trim="record.title" :max-length="32"/>
                  <span v-else>{{ record.title }}</span>
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="name" title="字段标识">
                <template #cell="{record}">
                  <a-input v-if="formState!=='view'&&!record.tableName" v-model.trim="record.name" :max-length="32"/>
                  <span v-else>{{ record.name }}</span>
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="fieldName" title="名称（英文）">
                <template #cell="{record}">
                  <a-input v-if="formState!=='view'" v-model.trim="record.fieldName" :max-length="32"/>
                  <span v-else>{{ record.fieldName }}</span>
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="selectType" title="数据类型">
                <template #cell="{record}">
                  <a-select v-if="formState!=='view'" v-model="record.selectType" :options="selectTypeOptions" allow-search/>
                  <span v-else>{{ utils.getOptionLabel(record.selectType, selectTypeOptions) }}</span>
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="tableName" title="模型名称"/>
              <a-table-column v-if="formState!=='view'" :width="60" align="center" data-index="operations" fixed="right" title="操作">
                <template #cell="{record}">
                  <a-button status="danger" type="text" @click="deleteViewColumn(record.tableName,record.fieldName)">
                    <template #icon>
                      <gl-iconfont type="gl-delete"/>
                    </template>
                  </a-button>
                </template>
              </a-table-column>
            </template>
            <template #empty>
              <a-empty style="width: 57%;"/>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style lang="less" scoped>
.check-all {
  padding: 0px 12px;
  line-height: 33px;
  display: flex;
  align-items: center;

  &-radio {
    width: 100%
  }

  &-span {
    font-weight: 600;
    color: rgb(var(--primary-6));
  }
}
</style>