<script lang="ts">
export default {
  name: 'GlModelViewViewForm'
};
</script>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import type {TableColumnData, FormInstance, SelectOptionGroup, SelectOptionData} from "@arco-design/web-vue";
import type {QueryAppForm, QueryPermissionForm, QueryAppViewForm, QueryTableForm, QueryViewForm} from '@geelato/gl-ui';
import {modelApi, applicationApi, useGlobal, utils, securityApi} from "@geelato/gl-ui";
import {enableStatusOptions, approvalNeedOptions, approvalStatusOptions} from "../searchTable";
import {classifyOptions} from "../../../security/permission/searchTable";
import {sourceTypeOptions, tableSyncOptions} from "../../table/searchTable";
import {pageQueryView} from "@geelato/gl-ui/src/m/datasource/Model";

type PageParams = {
  viewId: string; // 数据库链接id
  viewName: string; // 模型名称
  author: boolean; // 创建人
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
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const tableTabHeight = ref<number>(555);
const tableTabStyle = ref({height: `${tableTabHeight.value}px`});
const appSelectOptions = ref<QueryAppForm[]>([]);
const tableSelectOptions = ref<SelectOptionGroup[]>([]);
const permissionSelectOptions = ref<SelectOptionGroup[]>([]);
const selectAll = ref<boolean>(false);
const selectData = ref<string[]>([]);

const generateFormData = (): QueryAppViewForm => {
  return {
    id: props.modelValue || '',
    appName: '',
    tableName: '',
    viewId: '',
    viewName: '',
    viewTitle: '',
    viewAppId: '',
    permissionId: '',
    permissionName: '',
    approvalStatus: 'draft',
    approvalNeed: false,
    enableStatus: 1,
    description: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryAppViewForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      params.permissionId = selectData.value && selectData.value.toString();
      const {data} = await modelApi.createOrUpdateAppView(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else {
    if (failBack && typeof failBack === 'function') failBack();
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
    const {data} = await modelApi.getAppView(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};


const viewTypes = ["&all", "&myBusiness", "&myDept", "&myself"];
const editTypes = ["&insert", "&update", "&delete"];

const handleSelectOptionGroup = (type: string, optionGroup: SelectOptionGroup[], options: QueryPermissionForm[]) => {
  const handle: SelectOptionData[] = [];
  if (options && options.length > 0) {
    for (const item of options) {
      handle.push({value: item.id, label: `${item.name}（${item.description || item.code}）`, other: item,});
    }
  }
  optionGroup.push({isGroup: true, label: utils.getOptionLabel(type, classifyOptions.value), options: handle,});
}

const queryTablePermission = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await securityApi.queryPermissions(params);
    const permissionGroup: SelectOptionGroup[] = [];
    const viewGroup: QueryPermissionForm[] = data.filter((item) => viewTypes.includes(`${item.code.replace(item.object, '')}`));
    viewGroup.sort((a, b) => viewTypes.indexOf(a.code.replace(a.object, '')) - viewTypes.indexOf(b.code.replace(b.object, '')));
    handleSelectOptionGroup('view', permissionGroup, viewGroup);
    const editGroup: QueryPermissionForm[] = data.filter((item) => editTypes.includes(`${item.code.replace(item.object, '')}`));
    editGroup.sort((a, b) => editTypes.indexOf(a.code.replace(a.object, '')) - editTypes.indexOf(b.code.replace(b.object, '')));
    handleSelectOptionGroup('edit', permissionGroup, editGroup);
    const customGroup: QueryPermissionForm[] = data.filter((item) =>
        !(viewTypes.includes(`${item.code.replace(item.object, '')}`) || editTypes.includes(`${item.code.replace(item.object, '')}`)));
    handleSelectOptionGroup('custom', permissionGroup, customGroup);
    if (successBack && typeof successBack === 'function') successBack(permissionGroup);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const queryTableSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.pageQueryView(params);
    if (successBack && typeof successBack === 'function') successBack(data.items || []);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const queryConnectSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await applicationApi.pageQueryAppConnectOf({
      current: 1, pageSize: 10000, order: 'updateAt|asc', ...params,
    });
    if (successBack && typeof successBack === 'function') successBack(data.items || []);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

/**
 * 单个数据删除接口
 * @param id
 * @param successBack
 * @param failBack
 */
const deleteData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    await modelApi.deleteAppTable(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}

const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/**
 * 选择内容与全选联动
 */
const selectChange = () => {
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const record of permissionSelectOptions.value) {
    if (record.isGroup && record.options && record.options.length > 0) {
      for (const item of record.options) {
        // @ts-ignore
        if (!selectData.value.includes(item.value)) {
          isAll = false;
        }
      }
    }
  }
  selectAll.value = isAll;
}
/**
 * 全选与选择项联动
 */
const selectAllChange = () => {
  if (selectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const record of permissionSelectOptions.value) {
      if (record.isGroup && record.options && record.options.length > 0) {
        for (const item of record.options) {
          // @ts-ignore
          if (!selectData.value.includes(item.value)) {
            // @ts-ignore
            selectData.value.push(item.value);
          }
        }
      }
    }
  } else {
    selectData.value = [];
  }
}

const getTablePermission = (viewName: string) => {
  queryTablePermission({
    object: viewName, order: 'updateAt|desc',
    appId: '', tenantCode: props.parameter?.tenantCode || '',
  }, (data: SelectOptionGroup[]) => {
    permissionSelectOptions.value = data || [];
  }, () => {
    permissionSelectOptions.value = [];
  });
}

const tableIdClear = () => {
  selectData.value = [];
  selectAll.value = false;
  permissionSelectOptions.value = [];
}

const tableAppIdClear = () => {
  tableSelectOptions.value = [];
  formData.value.viewId = '';
}


const tableIdChange = () => {
  tableIdClear();
  for (const record of tableSelectOptions.value) {
    for (const item of record.options) {
      // @ts-ignore
      if (item.value === formData.value.viewId) {
        // @ts-ignore
        getTablePermission(item.other.viewName);
        break;
      }
    }
  }
}

const tableAppIdChange = () => {
  tableIdClear();
  tableAppIdClear();
  if (formData.value.viewAppId) {
    queryConnectSelectOptions({
      appId: formData.value.viewAppId, tenantCode: props.parameter?.tenantCode || ''
    }, (connectData: Record<string, any>[]) => {
      const connectIds = connectData.map((item) => item.connectId);
      queryTableSelectOptions({
        connectId: connectIds.join(','), order: 'viewName|asc',
        appId: formData.value.viewAppId, tenantCode: props.parameter?.tenantCode || ''
      }, (tableData: QueryViewForm[]) => {
        // tableData = tableData.filter((item) => item.appId !== props.parameter?.appId);
        for (const connectItem of connectData) {
          const option: SelectOptionData[] = [];
          const tableDataFormat = tableData.filter((item) => item.connectId === connectItem.connectId);
          for (const item of tableDataFormat) {
            option.push({
              label: `${item.title}[${item.viewName}]`,
              value: item.id,
              disabled: item.enableStatus === 0,
              other: item,
            });
          }
          tableSelectOptions.value.push({isGroup: true, label: connectItem.connectName, options: option});
        }
      });
    });
  }
}

/**
 * 删除
 */
const handleModelDelete = () => {
  if (formData.value.id) {
    deleteData(formData.value.id, (id: string) => {
      visibleForm.value = false;
      emits('saveSuccess', formData.value, 'delete');
    });
  }
}
/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = () => {
  createOrUpdateData(formData.value, (data: QueryAppViewForm) => {
    visibleForm.value = false;
    emits('saveSuccess', data, props.formState);
  }, () => {
    visibleForm.value = true;
  });
};
const handleModelReset = () => {
  formData.value.approvalStatus = 'draft';
  formData.value.enableStatus = 1;
  handleModelOk();
}
/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

watch(() => props, () => {
  // 显示页面
  visibleForm.value = props.visible === true;
  if (props.visible === true) {
    // 应用信息
    applicationApi.getAppSelectOptions({
      id: '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data.filter((item) => item.id !== props.parameter?.appId) || [];
    }, () => {
      appSelectOptions.value = [];
    });
    // 表单数据重置
    selectAll.value = false;
    selectData.value = [];
    formData.value = generateFormData();
    // 重置验证
    resetValidate();
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      getData(props.modelValue, (data: QueryAppViewForm) => {
        formData.value = JSON.parse(JSON.stringify(data));
        tableAppIdChange();
        formData.value.viewId = data.viewId;
        getTablePermission(props.parameter.tableName);
        selectData.value = data.permissionId && data.permissionId.split(',') || [];
        selectChange()
      });
    }
  }
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});

type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'&&['draft','reject'].includes(formData.approvalStatus)" :width="width"
           cancel-text="取消" ok-text="确认" title-align="start"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <template #title>
      <a-space>
        {{ title || '视图权限申请 |' }}
        <span v-for="option of approvalStatusOptions.filter((item)=> item.value===formData.approvalStatus)"
              :style="option.other">{{ option.label }}</span>
      </a-space>
    </template>
    <template #footer>
      <a-space style="float: left;">
        <a-popconfirm v-if="formState==='edit'&&!!parameter.author" content="是否删除该条数据？" position="tl" type="warning" @ok="handleModelDelete">
          <a-button status="danger">删除</a-button>
        </a-popconfirm>
      </a-space>
      <a-space>
        <a-button @click="handleModelCancel">取消</a-button>
        <a-button v-if="!parameter.author || (!!parameter.author&&['draft'].includes(formData.approvalStatus))"
                  type="primary" @click="handleModelOk">
          确认
        </a-button>
        <a-popconfirm v-if="!!parameter.author&&['reject'].includes(formData.approvalStatus)"
                      content="是否重新申请？" position="tr" type="warning" @ok="handleModelReset">
          <a-button type="primary">重新申请</a-button>
        </a-popconfirm>
      </a-space>
    </template>
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col v-if="!parameter.author" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="appId" label="申请来源">
            <span>{{ formData.appName }}</span>
          </a-form-item>
        </a-col>
        <a-col v-else :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="viewAppId" label="所属应用">
            <a-select v-if="formState!=='view'&&!!parameter.author" allow-search v-model="formData.viewAppId" @change="tableAppIdChange">
              <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
            </a-select>
            <span v-else>{{ formData.appName }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="viewId" label="视图名称">
            <a-select v-if="formState!=='view'&&!!parameter.author" v-model="formData.viewId" :disabled="!!parameter.viewId"
                      :options="tableSelectOptions" allow-search @change="tableIdChange"/>
            <span v-else>{{ `${formData.viewTitle}[${formData.viewName}]` }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: false,message: '这是必填项'}]" field="permissionId" label="权限名称">
            <a-select v-if="formState!=='view'" v-model="selectData" :options="permissionSelectOptions"
                      multiple allow-clear allow-search @change="selectChange">
              <template #header>
                <div class="check-all">
                  <a-checkbox v-model="selectAll" class="check-all-radio" @change="selectAllChange">
                    <span class="check-all-span">全选</span>
                  </a-checkbox>
                </div>
              </template>
            </a-select>
            <a-space v-else v-if="formData.permissionName" direction="vertical">
              <span v-for="item of formData.permissionName.split('\n\t')">{{ item }}</span>
            </a-space>
          </a-form-item>
        </a-col>
        <!--        <a-col :span="(labelCol+wrapperCol)/formCol">
                  <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="approvalNeed" label="是否审批">
                    <a-select v-if="formState!=='view'&&!parameter.author" v-model="formData.approvalNeed" :options="approvalNeedOptions"/>
                    <span v-else>{{ utils.getOptionLabel(formData.approvalNeed, approvalNeedOptions) }}</span>
                    <template #extra>
                      申请需要走过审批流程才能生效
                    </template>
                  </a-form-item>
                </a-col>-->
        <!--        <a-col v-if="!!parameter.author" :span="(labelCol+wrapperCol)/formCol">
                  <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
                    <a-select v-if="formState!=='view'" v-model="formData.enableStatus" :options="enableStatusOptions"/>
                    <span v-else>{{ utils.getOptionLabel(formData.enableStatus, enableStatusOptions) }}</span>
                  </a-form-item>
                </a-col>-->
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
  </a-modal>
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