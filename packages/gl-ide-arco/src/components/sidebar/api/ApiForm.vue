<script lang="ts">
export default {
  name: 'ApiForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import type {FormInstance} from "@arco-design/web-vue";
import {applicationApi, interApi, useGlobal} from "@geelato/gl-ui";
import type {QueryApiForm, QueryApiParamForm, QueryAppForm} from "@geelato/gl-ui";
import {enableStatusOptions} from "./searchTable";
import GlApiParamListTabs from "./param/listTabs.vue";

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
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
const tableTabStyle = ref({height: `${tableTabHeight.value}px`});
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
const visibleForm = ref<boolean>(false);// 弹层-是否显示
const tabsKey = ref<number>(1);// 定位tabs页面
const parameterDefinition = ref<QueryApiParamForm[]>([])

/* 表单 */
const generateFormData = (): QueryApiForm => {
  return {
    id: props.modelValue || '',
    name: '',
    code: '',
    version: 0,
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
const appSelectOptions = ref<QueryAppForm[]>([]);

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
      formData.value.parameters = parameterDefinition.value || [];
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

const dataTypeChange = (record: QueryApiParamForm) => {
  record.defaultValue = '';
  record.demoValue = '';
}

watch(() => props, async () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    tableTabHeight.value = window.innerHeight * 0.86 - 160;
    tableTabStyle.value.height = `${tableTabHeight.value}px`;
    parameterDefinition.value = [];
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
        parameterDefinition.value = data.parameters || [];
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
           :title="title" :width="width || ''" cancel-text="取消"
           ok-text="确定" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :destroy-on-hide="true" :style="tableTabStyle" position="left" type="line">
      <a-tab-pane :key="1" title="基本信息">
        <a-card class="general-card">
          <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
            <a-row :gutter="wrapperCol">
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="name" label="名称">
                  <a-input v-if="formState!=='view'" v-model="formData.name" :max-length="32"/>
                  <span v-else>{{ formData.name }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'},{validator:validate}]" field="code" label="编码">
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
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="所属应用">
                  <a-select v-model="formData.appId" :disabled="formState==='view'">
                    <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="是否启用">
                  <a-select v-model="formData.enableStatus" :disabled="formState==='view'" :options="enableStatusOptions"/>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)">
                <a-form-item :label-col-props="{ span: labelCol/formCol }"
                             :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                             field="remark" label="备注">
                  <a-textarea v-if="formState!=='view'" v-model="formData.remark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
                  <span v-else :title="formData.remark" class="textarea-span" @click="openModal(`${formData.remark}`)">
            {{ formData.remark }}
          </span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="2" title="参数定义">
        <a-card class="general-card">
          <GlApiParamListTabs v-if="visibleForm"
                              v-model="parameterDefinition"
                              :form-state="formState"
                              :height="tableTabHeight-170"
                              :is-modal="true"
                              :parameter="{'apiId':formData.id,'appId':formData.appId,'tenantCode':formData.tenantCode}"/>
        </a-card>
      </a-tab-pane>
    </a-tabs>
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