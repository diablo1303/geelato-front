<template>
  <a-modal v-model:visible="visible" title="身份验证" title-align="start" width="360px" @cancel="cancelModalClick($event)">
    <a-form ref="validFormRef" :model="formData" :wrapper-col-props="{ span: 24 }" class="form" size="large">
      <!--   验证   -->
      <a-form-item
          :hide-asterisk="true"
          :rules="[{required: true,message: $t('account.manage.valid.validType.rules.required')}]"
          field="validType">
        <a-select v-model="formData.validType" :options="validTypeOptions"
                  :placeholder="$t('account.manage.valid.validType.placeholder')"
                  @change="validTypeChange"/>
      </a-form-item>
      <!--   获取验证码   -->
      <a-form-item
          v-if="['1','2'].includes(formData.validType)"
          :hide-asterisk="true"
          :rules="[{required: true,message:$t('account.manage.valid.authCode.rules.required')},
            {length:6,message:$t('account.manage.valid.authCode.rules.length')}]"
          field="authCode">
        <a-input v-model="formData.authCode" :placeholder="$t('account.manage.valid.authCode.placeholder')"/>
        <a-button :disabled="authCodeData.disabled" class="account-valid-authCode-button"
                  type="outline" @click="authCodeClick($event)">
          {{ authCodeData.content ? authCodeData.content : $t('account.manage.valid.authCode.button.default.content') }}
        </a-button>
      </a-form-item>
      <!--  绑定，账号密码    -->
      <a-form-item
          v-if="['3'].includes(formData.validType)"
          :hide-asterisk="true"
          :rules="[{required: true,message:$t('account.manage.valid.password.rules.required')}]"
          field="authCode">
        <a-input-password v-model="formData.authCode" :placeholder="$t('account.manage.valid.password.placeholder')"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button type="outline" @click="cancelModalClick($event)">
          取消
        </a-button>
        <a-button :loading="buttonLoading" type="primary" @click="nextModelClick($event)">
          下一步
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
import {abbreviateValue, AuthCodeForm, generateAuthCode, validateUser} from "@/api/user";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {clearValidUser, setValidUser} from "@/utils/auth";
import {useUserStore} from "@/store";
import {Message} from "@arco-design/web-vue";

const props = defineProps({modelValue: {type: Boolean, default: false}});
const emits = defineEmits(['update:modelValue', 'validEvent']);
const {t} = useI18n();
const userStore = useUserStore();
const visible = ref(false);
const validFormRef = ref<FormInstance>();
const buttonLoading = ref(false);
const authCodeData = ref({disabled: false, content: ''});
const formatValidData = (): AuthCodeForm => {
  return {
    action: 'validateUser', validType: '3', prefix: '', validBox: '',
    userId: userStore.userInfo.id as string,
    authCode: ''
  };
}
const formData = ref(formatValidData());

let validTypeOptions = computed<SelectOptionData[]>(() => []);
const validTypeData = () => {
  const options: SelectOptionData[] = [];
  if (userStore.userInfo.mobilePhone) {
    options.push({
      value: '1',
      label: `${t('account.manage.valid.validType.mobile.prefix')} ${abbreviateValue(userStore.userInfo.mobilePhone, '1')} ${t('account.manage.valid.validType.suffix')}`
    });
  }
  if (userStore.userInfo.email) {
    options.push({
      value: '2',
      label: `${t('account.manage.valid.validType.email.prefix')} ${abbreviateValue(userStore.userInfo.email, '2')} ${t('account.manage.valid.validType.suffix')}`
    });
  }
  options.push({value: '3', label: `${t('account.manage.valid.validType.password.prefix')}${t('account.manage.valid.validType.suffix')}`});
  validTypeOptions = computed<SelectOptionData[]>(() => options);
}

const validTypeChange = () => {
  formData.value.validBox = '';
  formData.value.authCode = '';
}

const authCodeInterval = () => {
  let remainingSeconds = 60;
  const resetContent = t('account.manage.valid.authCode.button.reset.content');
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
const nextModelClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
    buttonLoading.value = true;
    try {
      await validateUser(formData.value);
      setValidUser(formData.value.userId);
      emits('update:modelValue', false);
      emits('validEvent');
    } catch (err) {
      clearValidUser();
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
      validTypeData();
      formData.value = formatValidData();
    }
    visible.value = newValue;
  }
)
</script>

<script lang="ts">
export default {
  name: 'accountValid',
};
</script>

<style lang="less" scoped>
.account-valid {
  &-authCode-button {
    margin-left: 20px;
    border-radius: 8px;
  }
}
</style>
