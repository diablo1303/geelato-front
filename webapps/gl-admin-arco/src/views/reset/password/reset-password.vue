<template>
  <div class="reset-form-wrapper">
    <div class="reset-form-title">{{ $t('reset.password.title') }}</div>
    <div class="reset-form-error-msg">{{ errorMessage }}</div>
    <a-steps v-model:current="step" changeab="false" class="reset-form-steps">
      <a-step>{{ $t('reset.password.step.one') }}</a-step>
      <a-step>{{ $t('reset.password.step.two') }}</a-step>
      <a-step :status="step===3?'finish':'wait'">{{ $t('reset.password.step.three') }}</a-step>
    </a-steps>
    <a-divider/>
    <keep-alive class="reset-form-keep-alive">
      <a-form ref="validFormRef" :model="formData" :wrapper-col-props="{ span: 24 }" class="form" size="large">
        <a-form-item
            v-show="step===1"
            :hide-asterisk="true"
            :rules="[{required: true,message: $t('reset.password.validType.rules.required')}]"
            field="validType">
          <a-select v-model="formData.validType"
                    :options="validTypeOptions"
                    :placeholder="$t('reset.password.validType.placeholder')"
                    @change="validateChange"/>
        </a-form-item>
        <a-form-item
            v-if="[1,2].includes(step)&&formData.validType==='1'"
            :hide-asterisk="true"
            :rules="[{required: true,message: $t('reset.password.validBox.mobile.rules.required')}]"
            field="validBox">
          <a-select v-model="formData.prefix" :disabled="step===2" :style="prefixStyle"
                    allow-search @popupVisibleChange="prefixVisibleChange">
            <a-option v-for="(item,index) in prefixTypeOptions" :key="index" :title="item.label"
                      :label="item.label" :value="item.value" :disabled="item.disabled"/>
            <template #label="{data}">
              {{ data.value }}
            </template>
          </a-select>
          <a-input v-model="formData.validBox" :disabled="step===2" :placeholder="$t('reset.password.validBox.mobile.placeholder')"/>
        </a-form-item>
        <a-form-item
            v-if="[1,2].includes(step)&&formData.validType==='2'"
            :hide-asterisk="true"
            :rules="[{required: true,message:$t('reset.password.validBox.email.rules.required')},
                {match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message: $t('reset.password.validBox.email.rules.match')}]"
            field="validBox">
          <a-input v-model="formData.validBox" :disabled="step===2" :placeholder="$t('reset.password.validBox.email.placeholder')"/>
        </a-form-item>
        <!--     重置密码     -->
        <a-form-item
            v-show="step===2"
            :hide-asterisk="true"
            :rules="[{required: step===2,message:$t('reset.password.authCode.rules.required')},
            {length:6,message:$t('reset.password.authCode.rules.length')}]"
            field="authCode">
          <a-input v-model="formData.authCode" :placeholder="$t('reset.password.authCode.placeholder')"/>
          <a-button :disabled="authCodeData.disabled" class="reset-form-authCode-button"
                    type="outline" @click="authCodeClick($event)">
            {{ authCodeData.content ? authCodeData.content : $t('reset.password.authCode.button.default.content') }}
          </a-button>
        </a-form-item>
        <a-form-item
            v-show="step===2"
            :hide-asterisk="true"
            :rules="[{required: step===2,message:$t('reset.password.password.rules.required')}]"
            field="password">
          <a-input-password v-model="formData.password" :placeholder="$t('reset.password.password.placeholder')"/>
        </a-form-item>
        <a-form-item
            v-show="step===2"
            :hide-asterisk="true"
            :rules="[{required: step===2,message:$t('reset.password.rPassword.rules.required')}]"
            field="rPassword">
          <a-input-password v-model="formData.rPassword" :placeholder="$t('reset.password.rPassword.placeholder')"/>
        </a-form-item>
        <a-space v-show="step===1" class="reset-form-one-button">
          <a-button :loading="validNextButtonLoading" type="primary" @click="validNextClick($event)">
            {{ $t('reset.password.button.next.content') }}
          </a-button>
        </a-space>
        <a-space v-show="step===2" class="reset-form-two-button">
          <a-button type="primary" @click="validLastClick($event)">
            {{ $t('reset.password.button.last.content') }}
          </a-button>
          <a-button :loading="updatePwdButtonLoading" type="primary" @click="updatePwdClick($event)">
            {{ $t('reset.password.button.update.content') }}
          </a-button>
        </a-space>
        <div v-show="step===3" class="reset-form-success-wrap">
          <a-result :title="$t('reset.password.result.success.title')" status="success"/>
        </div>
      </a-form>
    </keep-alive>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {FormInstance, SelectOptionData} from "@arco-design/web-vue";
import {AuthCodeForm, forgetPasswordEdit, forgetPasswordValid, generateAuthCode, ResetPasswordForm} from "@/api/user";
import mobilePrefix from '@/config/mobilePrefix.json';

const {t} = useI18n();
const step = ref(1);
const errorMessage = ref('');
/* 验证方式 */
const validFormRef = ref<FormInstance>();
const validNextButtonLoading = ref(false);
const formatValidData = (): ResetPasswordForm => {
  return {
    action: 'forgetPassword', userId: '',
    validType: '1', prefix: '+86', validBox: '',
    authCode: '', password: '', rPassword: ''
  };
}
const formData = ref(formatValidData());
/* 重置密码 */
const updatePwdButtonLoading = ref(false);
const authCodeData = ref({disabled: false, content: ''});
/* 完成 */
/* 验证方式 */
const validateChange = () => {
  formData.value.prefix = '+86';
  formData.value.validBox = '';
}
const validNextClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
    validNextButtonLoading.value = true;
    try {
      const {data} = await forgetPasswordValid(formData.value);
      console.log(data);
      // @ts-ignore
      formData.value.userId = data.id as string;
      errorMessage.value = '';
      step.value = 2;
    } catch (err) {
      errorMessage.value = t('reset.password.error.msg.valid');
    } finally {
      validNextButtonLoading.value = false;
    }
  }
};
/* 重置密码 */
const authCodeInterval = () => {
  let remainingSeconds = 60;
  const resetContent = t('reset.password.authCode.button.reset.content');
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
    const {password, rPassword, ...otherParams} = formData.value;
    try {
      await generateAuthCode(otherParams as AuthCodeForm);
      authCodeInterval();
    } catch (err) {
      errorMessage.value = '获取验证码失败！';
    }
  } else {
    errorMessage.value = '缺失用户信息，请重试！';
  }
}
const validLastClick = (ev?: MouseEvent) => {
  errorMessage.value = '';
  authCodeData.value = {content: t('reset.password.authCode.button.default.content'), disabled: false};
  formData.value.authCode = '';
  formData.value.password = '';
  formData.value.rPassword = '';
  step.value = 1;
}
const updatePwdClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
    if (formData.value.password !== formData.value.rPassword) {
      formData.value.rPassword = '';
      errorMessage.value = t('reset.password.error.msg.rPassword');
      return;
    }
    updatePwdButtonLoading.value = true;
    try {
      await forgetPasswordEdit(formData.value);
      errorMessage.value = '';
      step.value = 3;
    } catch (err) {
      errorMessage.value = t('reset.password.error.msg.update');
    } finally {
      updatePwdButtonLoading.value = false;
    }
  }
}

/* 选项数据 */
const validTypeOptions = computed<SelectOptionData[]>(() => [
  {label: t('reset.password.validType.option.mobile'), value: '1',},
  {label: t('reset.password.validType.option.email'), value: '2',}
]);
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
</script>

<script lang="ts">
export default {
  name: 'reset-password',
};
</script>

<style lang="less" scoped>
.reset-form {
  &-wrapper {
    width: 360px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }

  &-steps {
    margin-top: 22px;
  }

  /*&-keep-alive {
    width: 360px;
  }*/

  &-authCode-button {
    margin-left: 20px;
    border-radius: 8px;
  }

  &-one-button, &-two-button {
    justify-content: center;
    margin-top: 12px;
  }

  &-success-wrap {

  }
}


</style>
