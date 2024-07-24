<script lang="ts">
export default {
  name: 'GlAccountPassword',
};
</script>


<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import type {FormInstance} from "@arco-design/web-vue";
import type {AuthCodeForm} from "@geelato/gl-ui";
import {userApi} from "@geelato/gl-ui";
import {useUserStore} from "../../../store";

const props = defineProps({modelValue: {type: Boolean, default: false}});
const emits = defineEmits(['update:modelValue', 'completeEvent']);
const {t} = useI18n();
const userStore = useUserStore();
const visible = ref(false);
const validFormRef = ref<FormInstance>();
const buttonLoading = ref(false);
const errorMessage = ref('');
const formatValidData = (): AuthCodeForm => {
  return {
    action: 'updatePassword', validType: '3', prefix: '', validBox: '', userId: userStore.id as string, authCode: ''
  };
}
const formData = ref(formatValidData());

const inputChange = () => {
  errorMessage.value = '';
  if (formData.value.authCode && formData.value.validBox) {
    if (formData.value.validBox !== formData.value.authCode) {
      errorMessage.value = t('account.manage.password.error.msg.authCode');
    }
  }
  if (!formData.value.authCode) {
    errorMessage.value = t('account.manage.password.authCode.rules.required');
  }
}
const cancelModalClick = (ev?: Event) => {
  emits('update:modelValue', false);
}
const okModelClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
    if (formData.value.validBox !== formData.value.authCode) {
      errorMessage.value = t('account.manage.password.error.msg.authCode');
      return;
    }
    buttonLoading.value = true;
    try {
      await userApi.bindAccount(formData.value);
      emits('update:modelValue', false);
      emits('completeEvent');
    } catch (err) {
      console.log(err);
    } finally {
      buttonLoading.value = false;
    }
  }
}

watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue === true) {
        formData.value = formatValidData();
      }
      visible.value = newValue;
    }
)
</script>

<template>
  <a-modal draggable  v-model:visible="visible" :title="$t('account.manage.password.validBox.title')"
           title-align="start" width="360px" @cancel="cancelModalClick">
    <a-form ref="validFormRef" :model="formData" :wrapper-col-props="{ span: 24 }" class="form" size="large">
      <a-form-item
          :hide-asterisk="true"
          :rules="[{required: true,message:$t('account.manage.password.validBox.rules.required')}]"
          field="validBox">
        <a-input-password v-model="formData.validBox" :placeholder="$t('account.manage.password.validBox.placeholder')" allow-clear
                          @change="inputChange"/>
      </a-form-item>
      <a-form-item
          :hide-asterisk="true"
          :rules="[{required: true,message:$t('account.manage.password.authCode.rules.required')}]"
          field="authCode">
        <a-input-password v-model="formData.authCode" :placeholder="$t('account.manage.password.authCode.placeholder')" allow-clear
                          @change="inputChange"/>
        <template #help>
          <span class="account-password-error-msg">{{ errorMessage }}</span>
        </template>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button type="outline" @click="cancelModalClick">
          {{ $t('account.manage.password.button.cancel') }}
        </a-button>
        <a-button :loading="buttonLoading" type="primary" @click="okModelClick($event)">
          {{ $t('account.manage.password.button.ok') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.account-password {
  &-error-msg {
    color: rgb(var(--red-6));
  }
}
</style>
