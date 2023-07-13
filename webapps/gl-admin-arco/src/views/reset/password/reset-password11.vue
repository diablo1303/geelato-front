<template>
  <div class="container">
    <div class="wrapper">
      <a-steps v-model:current="step" style="width: 450px" changeab="false" class="steps">
        <a-step>验证方式</a-step>
        <a-step>重置密码</a-step>
        <a-step :status="step===3?'finish':'wait'">完成</a-step>
      </a-steps>
      <a-divider style="max-width: 450px;min-width: 450px;width: 450px"/>
      <keep-alive style="width: 450px;">
        <a-form
            ref="validFormRef"
            :model="formData" class="form"
            :wrapper-col-props="{ span: 24 }"
            size="large">
          <a-form-item
              v-show="step===1"
              :rules="[{required: true,message: $t('stepForm.form.error.activityName.required')}]"
              :hide-asterisk="true"
              field="validType">
            <a-select v-model="formData.validType" :options="validTypeOptions" @change="validateChange"/>
          </a-form-item>
          <a-form-item
              v-if="[1,2].includes(step)&&formData.validType==='1'"
              :rules="[{required: true,message: '请输入手机号'}]"
              :hide-asterisk="true"
              field="validBox">
            <a-input v-model="formData.validBox" placeholder="账号绑定的手机号" :disabled="step===2">
              <template #prepend>
                <a-select v-model="formData.prefix" :options="prefixTypeOptions" :disabled="step===2" :style="{width:'112.5px'}"
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
              :rules="[{required: true,message:'请输入邮箱'},
                {match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message: '请输入正确的邮箱'}]"
              :hide-asterisk="true"
              field="validBox">
            <a-input v-model="formData.validBox" placeholder="账号绑定的邮箱" :disabled="step===2"/>
          </a-form-item>
          <!--     重置密码     -->
          <a-form-item
              v-show="step===2"
              :rules="[{required: step===2,message:'请输入验证码'},{length:6,message:'请输入6位验证码'}]"
              :hide-asterisk="true"
              field="authCode">
            <a-input v-model="formData.authCode" placeholder="6位验证码"/>
            <a-button type="outline" style="margin-left: 20px;border-radius: 8px;"
                      :disabled="autoCodeData.disabled" @click="autoCodeClick($event)">
              {{ autoCodeData.content ? autoCodeData.content : '获取验证码' }}
            </a-button>
          </a-form-item>
          <a-form-item
              v-show="step===2"
              :rules="[{required: step===2,message:'请输入新密码'}]"
              :hide-asterisk="true"
              field="password">
            <a-input-password v-model="formData.password" placeholder="请输入新密码"/>
          </a-form-item>
          <a-form-item
              v-show="step===2"
              :rules="[{required: step===2,message:'请再次输入新密码'}]"
              :hide-asterisk="true"
              field="rPassword">
            <a-input-password v-model="formData.rPassword" placeholder="确认密码"/>
          </a-form-item>
          <a-form-item>
            <a-space v-show="step===1" style="margin-left: 184.5px;">
              <a-button type="primary" :loading="validNextButtonLoading" @click="validNextClick($event)">下一步</a-button>
            </a-space>
            <a-space v-show="step===2" style="margin-left: 123.5px;">
              <a-button type="primary" @click="validLastClick($event)">上一步</a-button>
              <a-button type="primary" :loading="updatePwdButtonLoading" @click="updatePwdClick($event)">确定修改</a-button>
            </a-space>
          </a-form-item>
          <div v-show="step===3" class="success-wrap">
            <a-result status="success" title="重置成功"/>
          </div>
        </a-form>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {Message} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
import {ResetPasswordForm, resetPwdEdit, resetPwdValid} from "@/api/user";
import mobilePrefix from '@/config/mobilePrefix.json';

const step = ref(1);
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
      const {data} = await resetPwdValid(formData.value);
      console.log(data);
      // @ts-ignore
      formData.value.userId = data.id as string;
      step.value = 2;
    } catch (err) {
      Message.error({content: '没有找到匹配的帐户', duration: 5 * 1000});
    } finally {
      validNextButtonLoading.value = false;
    }
  }
};
/* 重置密码 */
const autoCodeClick = (ev?: MouseEvent) => {
  let remainingSeconds = 10;
  const autoTimer = setInterval(() => {
    autoCodeData.value = {content: `重新获取(${remainingSeconds})`, disabled: true};
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      autoCodeData.value = {content: `重新获取`, disabled: false};
      clearInterval(autoTimer);
    }
  }, 1000);
}
const validLastClick = (ev?: MouseEvent) => {
  formData.value.authCode = '';
  formData.value.password = '';
  formData.value.rPassword = '';
  step.value = 1;
}
const updatePwdClick = async (ev?: MouseEvent) => {
  const res = await validFormRef.value?.validate();
  if (!res) {
    if (formData.value.password !== formData.value.rPassword) {
      Message.error({content: '请输入相同的新密码', duration: 5 * 1000});
      return;
    }
    updatePwdButtonLoading.value = true;
    try {
      await resetPwdEdit(formData.value);
      step.value = 3;
    } catch (err) {
      Message.error({content: '没有找到匹配的帐户', duration: 5 * 1000});
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
  name: 'Step',
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);

  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.form .login-form-error-msg {
  height: 32px;
  color: rgb(var(--red-6));
  line-height: 32px;
}

.steps {
  margin-top: 76px;
}
</style>
