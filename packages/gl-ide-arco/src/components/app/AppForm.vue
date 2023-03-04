<template>
  <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
  >
    <a-form-item ref="name" label="应用名称" name="name">
      <a-input v-model="formState.name"/>
    </a-form-item>
    <a-form-item label="应用编码" name="code">
      <a-input v-model="formState.code" aria-readonly="true"/>
    </a-form-item>
    <a-form-item label="应用图标" name="icon">
      <a-input v-model="formState.icon"/>
    </a-form-item>
    <a-form-item label="应用描述" name="description">
      <a-textarea v-model="formState.description"/>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 24, offset: 0 }" style="text-align: center">
      <a-button type="primary" @click="onSubmit">创建</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import {ValidateErrorEntity} from 'ant-design-vue/es/form/interface';
import {Moment} from 'moment';
import {defineComponent, reactive, ref, toRaw, UnwrapRef} from 'vue';
import utils from "@geelato/gl-ui";

interface FormState {
  name: string;
  code: string;
  icon: string;
  description: string;
}

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      code: utils.gid('', 16),
      icon: '',
      description: '',
    });
    const rules = {
      name: [
        {required: true, message: '请输入应用名称', trigger: 'blur'},
        {min: 3, max: 5, message: '长度为2到20个字符', trigger: 'blur'},
      ],
      code: [{required: true, message: '请输入应用编码', trigger: 'change'}],
      icon: [{required: true, message: '请选对应用图标', trigger: 'change'}],
      description: [{required: false, message: '', trigger: 'blur'}],
    };
    const onSubmit = () => {
      formRef.value
          .validate()
          .then(() => {
            console.log('values', formState, toRaw(formState));
          })
          .catch((error: ValidateErrorEntity<FormState>) => {
            console.log('error', error);
          });
    };
    const resetForm = () => {
      formRef.value.ruleformState.resetFields();
    };
    return {
      formRef,
      labelCol: {span: 6},
      wrapperCol: {span: 16},
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>
