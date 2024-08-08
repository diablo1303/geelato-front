<script lang="ts">
export default {
  name: 'ApiForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import type {FormInstance} from "@arco-design/web-vue";
import {applicationApi, restfulApi, utils, useGlobal, isUtil} from "@geelato/gl-ui";
import type {QueryRestfulForm, QueryAppForm, QueryApiParamForm} from "@geelato/gl-ui";
import {enableStatusOptions} from "../../../api/searchTable";
import {configTypeOptions, getConfigTypeOther} from "./searchTable";
import GlModelResfulAppList from "./list.vue";
import GlApiParamListTabs from '../../../api/param/listTabs.vue'

// 页面所需 参数
type PageParams = {
  author: boolean; // 创建人
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
const paramTabsKey = ref<number>(1);// 定位tabs页面
/* 表单 */
const generateFormData = (): QueryRestfulForm => {
  return {
    id: props.modelValue || '',
    title: '',
    keyName: '',
    parameterDefinition: '',
    configType: 'sql',
    encodingContent: getConfigTypeOther('sql'),
    description: '', // 描述
    enableStatus: 1,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const parameterDefinition = ref<QueryApiParamForm[]>([]);
const appSelectOptions = ref<QueryAppForm[]>([]);
const listParams = ref({
  id: '', visible: false, formState: 'edit', height: tableTabHeight.value - 248,
  parameter: {
    author: props.parameter.author || false,
    restfulId: '', restfulAppId: '',
    appId: '', tenantCode: ''
  }
});

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryRestfulForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      formData.value.parameterDefinition = JSON.stringify(parameterDefinition.value || []);
      const {data} = await restfulApi.createOrUpdateRestful(params);
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
    const {data} = await restfulApi.getRestful(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 删除
 * @param id
 * @param successBack
 * @param failBack
 */
const deleteData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await restfulApi.deleteRestful(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validate = async (value: any, callback: any) => {
  try {
    const {data} = await restfulApi.validateRestfulKeyName(formData.value);
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
  createOrUpdateData(formData.value, (data: QueryRestfulForm) => {
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

const deleteRestfulModel = () => {
  if (formData.value && formData.value.id) {
    deleteData(formData.value.id, () => {
      global.$message.success('删除成功');
      visibleForm.value = false;
      emits('saveSuccess', formData.value, 'delete');
    }, () => {
      global.$message.error('删除失败');
    });
  }
}

const configTypeChange = () => {
  formData.value.encodingContent = getConfigTypeOther(formData.value.configType);
}

watch(() => props, async () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    paramTabsKey.value = 1;
    parameterDefinition.value = [];
    tableTabHeight.value = window.innerHeight * 0.86 - (props.formState === 'view' ? 100 : 160);
    tableTabStyle.value.height = `${tableTabHeight.value}px`;
    // 应用信息
    await applicationApi.getAppSelectOptions({
      id: props.parameter.author ? '' : (props.parameter?.appId || ''), tenantCode: props.parameter?.tenantCode || ''
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
      await getData(props.modelValue, (data: QueryRestfulForm) => {
        formData.value = data;
        // 参数定义
        if (isUtil.isJSON(data.parameterDefinition)) {
          parameterDefinition.value = JSON.parse(data.parameterDefinition) || [];
        }
        // 授权申请
        Object.assign(listParams.value, {
          id: '', visible: true, formState: 'edit', height: tableTabHeight.value - (props.formState === 'view' ? 248 : 200),
          parameter: {
            author: props.parameter.author || false,
            restfulId: data.id, restfulAppId: data.appId,
            appId: props.parameter.appId || "", tenantCode: props.parameter.tenantCode || ""
          }
        })
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
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="tableTabStyle" position="left" type="line">
      <a-tab-pane :key="1" class="a-tabs-one" title="基础信息">
        <a-card class="general-card">
          <template v-if="formState==='edit'" #extra>
            <a-popconfirm content="是否删除该条数据？" position="br" type="warning" @ok="deleteRestfulModel">
              <a-tooltip content="删除信息">
                <a-button size="small" status="danger" type="outline">
                  <template #icon>
                    <gl-iconfont type="gl-delete"/>
                  </template>
                  删除
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
            <a-row :gutter="wrapperCol">
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="title" label="标题">
                  <a-input v-if="formState!=='view'" v-model="formData.title" :max-length="100"/>
                  <span v-else>{{ formData.title }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'},{validator:validate}]" field="keyName" label="键名称">
                  <a-input v-if="formState!=='view'" v-model="formData.keyName" :max-length="100"/>
                  <span v-else>{{ formData.keyName }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="configType" label="配置方式">
                  <a-select v-model="formData.configType" :disabled="formState==='view'" :options="configTypeOptions"
                            @change="configTypeChange"/>
                </a-form-item>
              </a-col>
              <a-col :span="(labelCol+wrapperCol)/formCol">
                <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="encodingContent"
                             label="配置方式">
                  <a-button @click="()=>{tabsKey=2}">
                    <template #icon>
                      <gl-iconfont type="gl-edit-square"/>
                    </template>
                    {{ `编辑 ${formData.configType ? formData.configType : ' 脚本'} 配置方式` }}
                  </a-button>
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
                             field="description" label="备注">
                  <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
                  <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">
                    {{ formData.description }}
                  </span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="2" class="a-tabs-one" title="配置方式">
        <a-card class="general-card">
          <div class="trigger-demo-translate">
            <GlMonacoEditor v-model="formData.encodingContent" :height="tableTabHeight-35" :language="formData.configType" style="width: 100%;"/>
          </div>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="3" class="a-tabs-two" title="参数定义">
        <a-card class="general-card">
          <GlApiParamListTabs v-if="visibleForm"
                              v-model="parameterDefinition"
                              :form-state="formState"
                              :height="tableTabHeight-170"
                              :is-modal="true"
                              :parameter="{'apiId':formData.id,'appId':formData.appId,'tenantCode':formData.tenantCode}"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-if="formState!=='add'" :key="4" :title="`${parameter.author?'授权申请':'授权应用'}`" class="a-tabs-two">
        <a-card class="general-card">
          <GlModelResfulAppList v-if="listParams.visible"
                                :form-state="listParams.formState"
                                :height="listParams.height"
                                :is-modal="true"
                                :parameter="listParams.parameter"/>
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