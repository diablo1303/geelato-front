<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('security.orgUser.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.orgUser.index.model.ok.text')"
      :title="$t(`security.orgUser.index.model.title.${pageData.formState}`)"
      width="600px"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.userId"/>
        <a-input v-show="false" v-model="formData.userName"/>
        <a-input v-show="false" v-model="formData.orgName"/>
      </a-form-item>
      <a-form-item
          :label="$t('security.orgUser.index.form.orgName')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="orgId">
        <a-cascader
            v-if="pageData.button" v-model="formData.orgId" :options="orgSelectOptions" allow-clear allow-search
            check-strictly/>
        <span v-else>{{ formData.orgName }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.orgUser.index.form.defaultOrg')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="defaultOrg">
        <a-select v-if="pageData.button" v-model="formData.defaultOrg">
          <a-option
              v-for="item of defaultOrgOptions" :key="item.value as string" :disabled="true" :label="$t(`${item.label}`)"
              :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.orgUser.index.form.defaultOrg.${formData.defaultOrg}`) }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {
  getOrgUser as getForm,
  insertOrgUser as createOrUpdateForm,
  QueryOrgForm,
  queryOrgs,
  QueryOrgUserForm as QueryForm
} from '@/api/service/security_service';
import {ListUrlParams, SelectOption} from '@/api/service/base_service';
import {defaultOrgOptions} from "@/views/security/user/org/searchTable";
import {FormInstance} from "@arco-design/web-vue/es/form";

const pageData = ref({formState: 'add', button: true});
const validateForm = ref<FormInstance>();
const orgSelectOptions = ref<SelectOption[]>([]);
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const generateFormData = () => {
  return {id: '', userId: '', userName: '', orgId: '', orgName: '', defaultOrg: 0};
}
const formData = ref(generateFormData());
// 页面响应
let okSuccessBack: any;

const buildOrgOptions = (defaultData: SelectOption[], totalData: QueryOrgForm[]): SelectOption[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (item.pid === data.value) {
        data.children?.push({value: item.id, label: item.name, children: []});
      }
    }
    if (data.children && data.children.length > 0) {
      buildOrgOptions(data.children, totalData);
    } else {
      delete data.children;
    }
  }

  return defaultData;
}
const getOrgOptions = async (params: QueryOrgForm = {status: 1} as unknown as QueryOrgForm) => {
  try {
    const {data} = await queryOrgs(params);
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: '根目录', children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children || [];
  } catch (err) {
    console.log(err);
  }
}
/**
 * 创建、更新
 * @param params
 * @param done
 */
const createOrUpdateData = async (params: QueryForm, done: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      await createOrUpdateForm(params);
      done();
      okSuccessBack();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      done(false);
    }
  } else {
    done(false);
  }
};

/**
 * 获取一条数据
 * @param id
 * @param successBack
 */
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

/* 表单 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, done);
};
const handleModelCancel = (e: Event) => {
  visibleModel.value = false;
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

const openForm = (urlParams: ListUrlParams) => {
  // 组织加载
  getOrgOptions();
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  formData.value = generateFormData();
  formData.value.userId = urlParams.params?.userId || '';
  formData.value.userName = urlParams.params?.userName || '';
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.action === "add") {
    visibleModel.value = true;
  } else if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      formData.value = data;
      visibleModel.value = true;
    });
  }

  okSuccessBack = urlParams.closeBack || null;
}

// 将方法暴露出去
defineExpose({openForm});
</script>

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