<script lang="ts">
export default {
  name: 'ApiForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import type {FormInstance, TableColumnData} from "@arco-design/web-vue";
import {applicationApi, interApi, utils, useGlobal} from "@geelato/gl-ui";
import type {QueryApiForm, QueryApiParamForm, QueryAppForm} from "@geelato/gl-ui";
import {enableStatusOptions, paramTypeOptions, dataTypeOptions, dataType2Options, dataTypeBooleanOptions} from "./searchTable";

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

interface ParamTableData {
  index: number;
  label: string;
  value: string;
  remark: string;
  data: QueryApiParamForm[];
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// 表单 - 主键
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  title: {type: String, default: ''},// 弹层 - 标题
  width: {type: String, default: ''},// 弹层 - 高度，为空-自然变化
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 页面状态
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const global = useGlobal();
const tableTabHeight = ref<number>(555);
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
const visibleForm = ref<boolean>(false);// 弹层-是否显示

const tabsKey = ref<number>(1);// 定位tabs页面

/* 表单 */
const generateFormData = (): QueryApiForm => {
  return {
    id: props.modelValue || '',
    name: '',
    code: '',
    version: '',
    remark: '',
    groupName: '',
    sourceContent: '',
    releaseContent: '',
    enableStatus: 1,
    parameters: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const generateParamData = (): QueryApiParamForm => {
  return {
    id: utils.generateRandom(64),
    apiId: props.modelValue || '',
    paramType: '',
    name: '',
    dataType: 'string',
    required: false,
    demoValue: '',
    defaultValue: '',
    remark: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const paramData = ref(generateParamData());
const appSelectOptions = ref<QueryAppForm[]>([]);
const paramTableData = ref<ParamTableData[]>([]);

const formParamsToTableData = () => {
  const result: ParamTableData[] = [];
  if (paramTypeOptions.value && paramTypeOptions.value.length > 0) {
    for (let i = 0; i < paramTypeOptions.value.length; i += 1) {
      result.push({
        index: i + 1,
        label: paramTypeOptions.value[i].label as string,
        value: paramTypeOptions.value[i].value as string,
        remark: paramTypeOptions.value[i]?.other || '',
        data: (formData.value?.parameters && formData.value?.parameters.length > 0) ? formData.value?.parameters.filter(item => item.paramType === paramTypeOptions.value[i].value) : [],
      });
    }
  }
  paramTableData.value = result;
}

const tableDataToFormParams = () => {
  const result: QueryApiParamForm[] = [];
  if (paramTableData.value && paramTableData.value.length > 0) {
    for (const option of paramTableData.value) {
      if (option.data && option.data.length > 0) {
        for (const item of option.data) {
          result.push(item);
        }
      }
    }
  }
  formData.value.parameters = result;
}

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryApiForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await interApi.createOrUpdateApi(params);
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
    const {data} = await interApi.getApi(id);
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
const validate = async (value: any, callback: any) => {
  try {
    const {data} = await interApi.validateApiCode(formData.value);
    if (!data) callback('不能重复');
  } catch (err) {
    console.log(err);
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
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  tableDataToFormParams();
  createOrUpdateData(formData.value, (data: QueryApiForm) => {
    done();
    visibleForm.value = false;
    emits('saveSuccess', data, props.formState);
  }, () => {
    done(false)
  });
};
/**
 * 取消按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

const addApiParam = () => {
  if (paramTableData.value && paramTableData.value.length > 0) {
    for (const item of paramTableData.value) {
      if (item.index === tabsKey.value) {
        const data: QueryApiParamForm = generateParamData();
        data.paramType = item.value as string;
        item.data.push(data);
      }
    }
  }
}
const emptyApiParam = () => {
  if (paramTableData.value && paramTableData.value.length > 0) {
    for (const item of paramTableData.value) {
      if (item.index === tabsKey.value) {
        item.data = [];
      }
    }
  }
}

const delApiParam = (record: QueryApiParamForm) => {
  if (paramTableData.value && paramTableData.value.length > 0) {
    for (let i = 0; i < paramTableData.value.length; i += 1) {
      const item = paramTableData.value[i];
      let index = -1;
      if (item.data && item.data.length > 0) {
        for (let i = 0; i < item.data.length; i += 1) {
          if (item.data[i].id === record.id) {
            index = i;
          }
        }
        if (index > -1) {
          item.data.splice(index, 1);
        }
      }
    }
  }
}

const dataTypeChange = (record: QueryApiParamForm) => {
  record.defaultValue = '';
  record.demoValue = '';
}

watch(() => props, async () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    tableTabHeight.value = window.innerHeight * 0.86 - 160;
    formParamsToTableData();
    // 应用信息
    await applicationApi.getAppSelectOptions({
      id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data || [];
    }, () => {
      appSelectOptions.value = [];
    });
    // 表单数据重置
    formData.value = generateFormData();
    // 重置验证
    resetValidate();
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      await getData(props.modelValue, (data: QueryApiForm) => {
        formData.value = data;
        formParamsToTableData();
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
  <a-modal v-model:visible="visibleForm"
           :footer="formState!=='view'"
           :title="title" cancel-text="取消" ok-text="确定"
           :width="width || ''" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <a-scrollbar :style="{overflow:'auto',height: `${tableTabHeight}px`}">
      <div style="width: 98.6%;">
        <a-divider orientation="left" style="font-weight: bold;margin: 10px 0;">基本信息</a-divider>
        <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
          <a-row :gutter="wrapperCol">
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="name" label="名称">
                <a-input v-if="formState!=='view'" v-model="formData.name" :max-length="32"/>
                <span v-else>{{ formData.name }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item :rules="[{required: formState==='add',message: '这是必填项'},{validator:validate}]" field="code" label="编码">
                <a-input v-if="formState!=='view'" v-model="formData.code" :max-length="32"/>
                <span v-else>{{ formData.code }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item field="version" label="版本">
                <a-input-number v-if="formState!=='view'" v-model="formData.version"/>
                <span v-else>{{ formData.version }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item field="groupName" label="分组名称">
                <a-input v-if="formState!=='view'" v-model="formData.groupName" :max-length="32"/>
                <span v-else>{{ formData.groupName }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="appId" label="所属应用">
                <a-select v-model="formData.appId" :disabled="formState==='view'">
                  <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="enableStatus" label="是否启用">
                <a-select v-model="formData.enableStatus" :disabled="formState==='view'" :options="enableStatusOptions"/>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)">
              <a-form-item :label-col-props="{ span: labelCol/formCol }"
                           :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                           label="备注" field="remark">
                <a-textarea v-if="formState!=='view'" v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
                <span v-else :title="formData.remark" class="textarea-span" @click="openModal(`${formData.remark}`)">
            {{ formData.remark }}
          </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-divider orientation="left" style="font-weight: bold;margin: 10px 0;">请求参数定义</a-divider>
        <a-tabs v-model:active-key="tabsKey" :default-active-tab="0" position="top" type="line" :destroy-on-hide="true">
          <template #extra>
            <a-space v-if="formState!=='view'">
              <a-button type="primary" @click="addApiParam">
                <template #icon>
                  <gl-iconfont type="gl-plus-circle"/>
                </template>
                添加
              </a-button>
              <a-button type="primary" status="danger" @click="emptyApiParam">
                <template #icon>
                  <gl-iconfont type="gl-delete"/>
                </template>
                清除
              </a-button>
            </a-space>
          </template>
          <a-tab-pane v-for="item of paramTableData" :key="item.index" class="a-tabs-three" :title="`${item.label} ${item.data.length>0?item.data.length:''}`">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="item.data"
                     :pagination="false"
                     :scroll="{x:1000}"
                     :scrollbar="true"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="name" title="参数名">
                  <template #cell="{record}">
                    <a-input v-if="formState!=='view'" v-model="record.name" :max-length="32"/>
                    <span v-else>{{ record.name }}</span>
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" align="center" :width="120" data-index="dataType" title="类型">
                  <template #cell="{record}">
                    <a-select v-if="formState!=='view'" v-model="record.dataType" :options="item.value==='body'?dataType2Options:dataTypeOptions"
                              @change="dataTypeChange(record)"/>
                    <span v-else>{{ record.dataType }}</span>
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" align="center" :width="90" data-index="required" title="是否必填">
                  <template #cell="{record}">
                    <a-switch v-if="formState!=='view'" v-model="record.required"/>
                    <span v-else>{{ record.required ? '是' : '否' }}</span>
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="demoValue" title="示例值">
                  <template #cell="{record}">
                    <GlUpload v-if="['file'].includes(record.dataType)" :disabled="formState==='view'" :limit="1" v-model="record.demoValue"/>
                    <a-select v-else-if="['boolean'].includes(record.dataType)&&formState!=='view'" v-model="record.demoValue"
                              :options="dataTypeBooleanOptions"/>
                    <a-input v-else-if="formState!=='view'" v-model="record.demoValue" :max-length="512" allow-clear/>
                    <span v-else>{{ record.demoValue }}</span>
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="defaultValue" title="默认值">
                  <template #cell="{record}">
                    <GlUpload v-if="['file'].includes(record.dataType)" :disabled="formState==='view'" :limit="1" v-model="record.defaultValue"/>
                    <a-select v-else-if="['boolean'].includes(record.dataType)&&formState!=='view'" v-model="record.defaultValue"
                              :options="dataTypeBooleanOptions"/>
                    <a-input v-else-if="formState!=='view'" v-model="record.defaultValue" :max-length="512" allow-clear/>
                    <span v-else>{{ record.defaultValue }}</span>
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="remark" title="备注">
                  <template #cell="{record}">
                    <a-textarea v-if="formState!=='view'" v-model="record.remark" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
                    <span v-else>{{ record.remark }}</span>
                  </template>
                </a-table-column>
                <a-table-column v-show="formState==='edit'" title="操作" :width="60" align="center" data-index="operations" fixed="right">
                  <template #cell="{ record }">
                    <a-button status="danger" type="text" @click="delApiParam(record)">
                      <gl-iconfont type="gl-delete"/>
                    </a-button>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-scrollbar>
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
  white-space: normal;
  word-wrap: break-word;
}
</style>