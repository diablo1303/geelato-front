<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('sercurity.roleUser.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('sercurity.roleUser.index.model.ok.text')"
      :title="$t(`sercurity.roleUser.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.roleId"/>
        <a-input v-show="false" v-model="formData.roleName"/>
        <a-input v-show="false" v-model="formData.userName"/>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.roleUser.index.form.userName')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="userId">
        <a-select v-if="pageData.button" v-model="formData.userId" :field-names="{value: 'id', label: 'name'}" :options="selectOptions"
                  allow-clear allow-search/>
        <span v-else>{{ formData.userName }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {
  getRoleUser as getForm,
  insertRoleUser as createOrUpdateForm,
  ListUrlParams,
  QueryRoleUserForm as QueryForm,
  QueryUserForm as QuerySelectForm,
  queryUsers as querySelectOptions
} from '@/api/sercurity_service'
import {FormInstance} from "@arco-design/web-vue/es/form";

const pageData = ref({formState: 'add', button: true});
const validateForm = ref<FormInstance>();
const selectOptions = ref<QuerySelectForm[]>([]);
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const generateFormData = (): QueryForm => {
  return {id: '', roleId: '', roleName: '', userId: '', userName: ''};
}
const formData = ref(generateFormData());
// 页面响应
let okSuccessBack: any;

const getSelectOptions = async () => {
  try {
    const {data} = await querySelectOptions();
    selectOptions.value = data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
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
const handleModelCancel = () => {
  visibleModel.value = false;
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

const openForm = (urlParams: ListUrlParams) => {
  // 组织加载
  getSelectOptions();
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  formData.value = generateFormData();
  formData.value.roleId = urlParams.params?.roleId || '';
  formData.value.roleName = urlParams.params?.roleName || '';
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