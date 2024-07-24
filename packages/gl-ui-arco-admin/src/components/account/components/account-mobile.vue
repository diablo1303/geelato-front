<script lang="ts">
export default {
  name: 'GlAccountMobile',
};
</script>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {Message} from "@arco-design/web-vue";
import type {FormInstance, SelectOptionData} from "@arco-design/web-vue";
import {userApi} from "@geelato/gl-ui";
import type {AuthCodeForm} from "@geelato/gl-ui";
import mobilePrefix from '../../../assets/mobilePrefix.json';
import {useUserStore} from "../../../store";

const props = defineProps({modelValue: {type: Boolean, default: false}});
const emits = defineEmits(['update:modelValue', 'completeEvent']);
const {t} = useI18n();
const userStore = useUserStore();
const visible = ref(false);
const validFormRef = ref<FormInstance>();
const buttonLoading = ref(false);
const authCodeData = ref({disabled: false, content: ''});
const formatValidData = (): AuthCodeForm => {
  return {
    action: 'updateMobile', validType: '1', prefix: '+86', validBox: '', userId: userStore.id as string, authCode: ''
  };
}
const formData = ref(formatValidData());
const prefixTypeOptions = computed<SelectOptionData[]>(() => {
  const options: SelectOptionData[] = [];
  mobilePrefix.forEach((item, index) => {
    options.push({value: item.code, label: `${item.area} ${item.code}`});
  });
  return options;
});
/* 区域选择框宽度变化 */
const prefixStyle = ref({width: '86px'});
const prefixVisibleChange = (visible: boolean) => {
  prefixStyle.value = {width: visible ? '200px' : '94px'};
}

const authCodeInterval = () => {
  let remainingSeconds = 60;
  const resetContent = t('account.manage.mobile.authCode.button.reset.content');
  const handler = () => {
    authCodeData.value = {content: `${resetContent}(${remainingSeconds})`, disabled: true};
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      authCodeData.value = {content: `${resetContent}`, disabled: false};
      clearInterval(autoTimer);
    }
  }
  handler();
  const autoTimer = setInterval(() => {
    handler();
  }, 1000);
}
const authCodeClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validateField("validBox");
  if (res) return;
  if (formData.value.userId) {
    try {
      await userApi.generateAuthCode(formData.value);
      authCodeInterval();
    } catch (err) {
      console.log(err);
    }
  } else {
    Message.warning({
      content: t('account.manage.valid.error.msg.missingUser'),
      duration: 5 * 1000,
    });
  }
}
const cancelModalClick = (ev?: Event) => {
  emits('update:modelValue', false);
}
const okModelClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
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
  <a-modal draggable  v-model:visible="visible" :title="$t('account.manage.mobile.validBox.title')"
           title-align="start" width="360px" @cancel="cancelModalClick">
    <a-form ref="validFormRef" :model="formData" :wrapper-col-props="{ span: 24 }" class="form" size="large">
      <!--   新   -->
      <a-form-item
          :hide-asterisk="true"
          :rules="[{required: true,message: $t('account.manage.mobile.validBox.rules.required')}]"
          field="validBox">
        <a-select v-model="formData.prefix" :style="prefixStyle" allow-search @popupVisibleChange="prefixVisibleChange">
          <a-option v-for="(item,index) in prefixTypeOptions" :key="index" :disabled="item.disabled"
                    :label="item.label" :title="item.label" :value="item.value"/>
          <template #label="{data}">
            {{ data.value }}
          </template>
        </a-select>
        <a-input v-model="formData.validBox" :placeholder="$t('account.manage.mobile.validBox.placeholder')"/>
      </a-form-item>
      <!--   获取验证码   -->
      <a-form-item
          :hide-asterisk="true"
          :rules="[{required: true,message:$t('account.manage.mobile.authCode.rules.required')},
            {length:6,message:$t('account.manage.mobile.authCode.rules.length')}]"
          field="authCode">
        <a-input v-model="formData.authCode" :placeholder="$t('account.manage.mobile.authCode.placeholder')"/>
        <a-button :disabled="authCodeData.disabled" class="account-mobile-authCode-button"
                  type="outline" @click="authCodeClick($event)">
          {{ authCodeData.content ? authCodeData.content : $t('account.manage.mobile.authCode.button.default.content') }}
        </a-button>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button type="outline" @click="cancelModalClick">
          {{ $t('account.manage.mobile.button.cancel') }}
        </a-button>
        <a-button :loading="buttonLoading" type="primary" @click="okModelClick($event)">
          {{ $t('account.manage.mobile.button.ok') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.account-mobile {
  &-authCode-button {
    margin-left: 20px;
    border-radius: 8px;
  }
}
</style>
