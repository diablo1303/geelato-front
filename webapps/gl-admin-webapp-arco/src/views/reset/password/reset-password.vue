<template>
  <div class="reset-form-wrapper">
    <div class="reset-form-title">找回密码</div>
    <div class="reset-form-error-msg">{{ errorMessage }}</div>
    <a-steps v-model:current="step" changeab="false" class="reset-form-steps">
      <a-step>验证</a-step>
      <a-step>重置</a-step>
      <a-step :status="step===3?'finish':'wait'">完成</a-step>
    </a-steps>
    <a-divider/>
    <keep-alive class="reset-form-keep-alive">
      <a-form ref="validFormRef" :model="formData" :wrapper-col-props="{ span: 24 }" class="form" size="large">
        <a-form-item
            v-show="step===1"
            :hide-asterisk="true"
            :rules="[{required: true,message: $t('stepForm.form.error.activityName.required')}]"
            field="validType">
          <a-select v-model="formData.validType" :options="validTypeOptions" @change="validateChange"/>
        </a-form-item>
        <a-form-item
            v-if="[1,2].includes(step)&&formData.validType==='1'"
            :hide-asterisk="true"
            :rules="[{required: true,message: '请输入手机号'}]"
            field="validBox">
          <a-input v-model="formData.validBox" :disabled="step===2" placeholder="账号绑定的手机号">
            <template #prepend>
              <a-select v-model="formData.prefix" :disabled="step===2" :options="prefixTypeOptions" :style="{width:'112.5px'}"
                        allow-search>
                <template #label="{data}">
                  {{ data.value }}
                </template>
              </a-select>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            v-if="[1,2].includes(step)&&formData.validType==='2'"
            :hide-asterisk="true"
            :rules="[{required: true,message:'请输入邮箱'},
                {match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message: '请输入正确的邮箱'}]"
            field="validBox">
          <a-input v-model="formData.validBox" :disabled="step===2" placeholder="账号绑定的邮箱"/>
        </a-form-item>
        <!--     重置密码     -->
        <a-form-item
            v-show="step===2"
            :hide-asterisk="true"
            :rules="[{required: step===2,message:'请输入验证码'},{length:6,message:'请输入6位验证码'}]"
            field="authCode">
          <a-input v-model="formData.authCode" placeholder="6位验证码"/>
          <a-button :disabled="autoCodeData.disabled" style="margin-left: 20px;border-radius: 8px;"
                    type="outline" @click="autoCodeClick($event)">
            {{ autoCodeData.content ? autoCodeData.content : '获取验证码' }}
          </a-button>
        </a-form-item>
        <a-form-item
            v-show="step===2"
            :hide-asterisk="true"
            :rules="[{required: step===2,message:'请输入新密码'}]"
            field="password">
          <a-input-password v-model="formData.password" placeholder="请输入新密码"/>
        </a-form-item>
        <a-form-item
            v-show="step===2"
            :hide-asterisk="true"
            :rules="[{required: step===2,message:'请再次输入新密码'}]"
            field="rPassword">
          <a-input-password v-model="formData.rPassword" placeholder="确认密码"/>
        </a-form-item>
        <a-space v-show="step===1" class="reset-form-one-button">
          <a-button :loading="validNextButtonLoading" type="primary" @click="validNextClick($event)">下一步</a-button>
        </a-space>
        <a-space v-show="step===2" class="reset-form-two-button">
          <a-button type="primary" @click="validLastClick($event)">上一步</a-button>
          <a-button :loading="updatePwdButtonLoading" type="primary" @click="updatePwdClick($event)">确认重置</a-button>
        </a-space>
        <div v-show="step===3" class="reset-form-success-wrap">
          <a-result status="success" title="重置成功"/>
        </div>
      </a-form>
    </keep-alive>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {FormInstance, SelectOptionData} from "@arco-design/web-vue";
import {forgetPasswordEdit, forgetPasswordValid, ResetPasswordForm} from "@/api/user";
import mobilePrefix from '@/config/mobilePrefix.json';

const step = ref(1);
const errorMessage = ref('');
/* 验证方式 */
const validFormRef = ref<FormInstance>();
const validNextButtonLoading = ref(false);
const formatValidData = (): ResetPasswordForm => {
  return {
    validType: '1', prefix: '+86', validBox: '',
    authCode: '', password: '', rPassword: '', userId: ''
  };
}
const formData = ref(formatValidData());
/* 重置密码 */
const updatePwdButtonLoading = ref(false);
const autoCodeData = ref({disabled: false, content: ''});
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
      errorMessage.value = '没有找到匹配的帐户';
    } finally {
      validNextButtonLoading.value = false;
    }
  }
};
/* 重置密码 */
const autoCodeClick = (ev?: MouseEvent) => {
  let remainingSeconds = 60;
  const handler = () => {
    autoCodeData.value = {content: `重新获取(${remainingSeconds})`, disabled: true};
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      autoCodeData.value = {content: `重新获取`, disabled: false};
      clearInterval(autoTimer);
    }
  }
  handler();
  const autoTimer = setInterval(() => {
    handler();
  }, 1000);
}
const validLastClick = (ev?: MouseEvent) => {
  errorMessage.value = '';
  autoCodeData.value = {content: `获取验证码`, disabled: false};
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
      errorMessage.value = '两次输入的密码不相同，请重新输入！';
      return;
    }
    updatePwdButtonLoading.value = true;
    try {
      await forgetPasswordEdit(formData.value);
      errorMessage.value = '';
      step.value = 3;
    } catch (err) {
      errorMessage.value = '重置密码失败，请重试！';
    } finally {
      updatePwdButtonLoading.value = false;
    }
  }
}

/* 选项数据 */
const validTypeOptions = computed<SelectOptionData[]>(() => [{label: '通过手机号找回', value: '1',}, {label: "通过邮箱找回", value: '2',}]);
const prefixTypeOptions = computed<SelectOptionData[]>(() => {
  const options: SelectOptionData[] = [];
  mobilePrefix.forEach((item, index) => {
    options.push({value: item.code, label: `${item.area} ${item.code}`});
  });
  return options;
});
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

  &-one-button, &-two-button {
    justify-content: center;
    margin-top: 12px;
  }

  &-success-wrap {

  }
}


</style>
