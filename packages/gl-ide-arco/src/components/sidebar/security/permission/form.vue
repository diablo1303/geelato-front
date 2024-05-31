<script lang="ts">
export default {
  name: 'GlSecurityPermissionForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import type {FormInstance} from "@arco-design/web-vue";
import {Modal} from "@arco-design/web-vue";
import type {QueryAppForm, QueryPermissionForm} from '@geelato/gl-ui';
import {applicationApi, securityApi, useGlobal, utils} from "@geelato/gl-ui";
import {ruleOptions, typeOptions} from "./searchTable";

type PageParams = {
  object: string; // 实体对象
  type: string; // 权限类型
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
  title: {type: String, default: '权限'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
  autoCode: {type: Boolean, default: false}
});

const global = useGlobal();
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const appSelectOptions = ref<QueryAppForm[]>([]);

const generateFormData = (): QueryPermissionForm => {
  return {
    id: props.modelValue || '',
    name: '',
    code: props.autoCode ? utils.uuid(19) : '',
    type: props.parameter.type || '',
    object: props.parameter.object || '',
    rule: '',
    description: '',
    default: false,
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
const createOrUpdateData = async (params: QueryPermissionForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await securityApi.createOrUpdatePermission(params);
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
    const {data} = await securityApi.getPermission(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 省略内容完全展示
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
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const {data} = await securityApi.validatePermissionCode(formData.value);
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
  createOrUpdateData(formData.value, (data: QueryPermissionForm) => {
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
    applicationApi.getAppSelectOptions({
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
      getData(props.modelValue, (data: QueryPermissionForm) => {
        formData.value = data;
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
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'" :title="title" :width="width"
           cancel-text="取消" ok-text="确认" title-align="start"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }">
      <a-row :gutter="wrapperCol">
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="name" label="名称">
            <a-input v-if="formState!=='view'" v-model="formData.name" :max-length="32"/>
            <span v-else>{{ formData.name }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'},{validator:validateCode}]" field="code" label="编码">
            <a-input v-if="formState!=='view'&&!formData.default&&!autoCode" v-model="formData.code" :max-length="32"/>
            <span v-else>{{ formData.code }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="type" label="类型">
            <a-select v-if="formState==='add'&&parameter.type===''" v-model="formData.type" :options="typeOptions"/>
            <span v-else>{{ utils.getOptionLabel(formData.type, typeOptions) }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="object" label="对象">
            <a-input v-if="formState==='add'&&parameter.object===''" v-model="formData.object" :max-length="32"/>
            <span v-else>{{ formData.object }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="所属应用">
            <a-select v-model="formData.appId" :disabled="formState==='view'" :field-names="{value: 'id', label: 'name'}" :options="appSelectOptions"
                      allow-search/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]"
                       :label-col-props="{ span: labelCol/formCol }"
                       :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                       field="rule" label="规则">
            <a-textarea v-if="formState!=='view'" v-model="formData.rule" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
            <span v-else :title="formData.rule" class="textarea-span" @click="openModal(`${formData.rule}`)">{{ formData.rule }}</span>
            <template v-if="formState!=='view'" #extra>
              <a-descriptions size="small" :column="formCol" layout="" bordered="true">
                <a-descriptions-item v-for="(item,index) of ruleOptions" :key="index" :label="item.label">
                  <GlCopyToClipboard v-if="item.value" :model-value="item.value"/>
                  {{ item.value }}
                </a-descriptions-item>
              </a-descriptions>
            </template>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)">
          <a-form-item :label-col-props="{ span: labelCol/formCol }" :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                       field="description" label="描述">
            <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
            <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
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
</style>