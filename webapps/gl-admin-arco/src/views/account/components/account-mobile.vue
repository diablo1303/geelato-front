<template>
  <a-modal v-model:visible="visible" title="更改电话号码" title-align="start" width="360px" @cancel="cancelModalClick($event)">
    <a-form ref="validFormRef" :model="formData" :wrapper-col-props="{ span: 24 }" class="form" size="large">
      <!--   新   -->
      <a-form-item
          :hide-asterisk="true"
          :rules="[{required: true,message: $t('account.manage.mobile.validBox.rules.required')}]"
          field="validBox">
        <a-input v-model="formData.validBox" :placeholder="$t('account.manage.mobile.validBox.placeholder')">
          <template #prepend>
            <a-select v-model="formData.prefix" :options="prefixTypeOptions" :style="{width:'112.5px'}"
                      allow-search>
              <template #label="{data}">
                {{ data.value }}
              </template>
            </a-select>
          </template>
        </a-input>
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
        <a-button type="outline" @click="cancelModalClick($event)">
          {{ $t('account.manage.mobile.button.cancel') }}
        </a-button>
        <a-button :loading="buttonLoading" type="primary" @click="okModelClick($event)">
          {{ $t('account.manage.mobile.button.ok') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
import {AuthCodeForm, bindAccount, generateAuthCode} from "@/api/user";
import {FormInstance} from "@arco-design/web-vue/es/form";
import mobilePrefix from '@/config/mobilePrefix.json';
import {Message} from "@arco-design/web-vue";
import {useUserStore} from "@/store";

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
    action: 'updateMobile', validType: '1', prefix: '+86', validBox: '', userId: userStore.userInfo.id as string, authCode: ''
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
      await generateAuthCode(formData.value);
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
const cancelModalClick = (ev?: MouseEvent) => {
  emits('update:modelValue', false);
}
const okModelClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
    buttonLoading.value = true;
    try {
      await bindAccount(formData.value);
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

<script lang="ts">
export default {
  name: 'AccountMobile',
};
</script>

<style lang="less" scoped>
.account-mobile {
  &-authCode-button {
    margin-left: 20px;
    border-radius: 8px;
  }
}
</style>
