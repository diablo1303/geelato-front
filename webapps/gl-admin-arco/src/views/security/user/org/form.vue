<template>
  <a-modal
      v-model:visible="visibleModel"
      :title="$t(`${modelAttr.title}`)"
      :footer="modelAttr.footer"
      :cancel-text="$t(`${modelAttr.cancelText}`)"
      :ok-text="$t('sercurity.orgUser.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.userId"/>
        <a-input v-show="false" v-model="formData.userName"/>
        <a-input v-show="false" v-model="formData.orgName"/>
      </a-form-item>
      <a-form-item field="orgId" :label="$t('sercurity.orgUser.index.form.orgName')">
        <a-cascader v-model="formData.orgId" :options="orgSelectOptions" check-strictly/>
      </a-form-item>
      <a-form-item field="defaultOrg" :label="$t('sercurity.orgUser.index.form.defaultOrg')">
        <a-select v-if="modelAttr.footer" v-model="formData.defaultOrg">
          <a-option v-for="item of defaultOrgOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)" :disabled="true"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.orgUser.index.form.defaultOrg.${formData.defaultOrg}`) }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {getOrgUser, insertOrgUser, QueryOrgForm, queryOrgs, QueryOrgUserForm, QueryUserForm, SelectOption} from '@/api/sercurity_service'
import {defaultOrgOptions} from "@/views/security/user/org/searchTable";

const generateFormData = () => {
  return {id: '', userId: '', userName: '', orgId: '', orgName: '', defaultOrg: 0};
}
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const formData = ref(generateFormData());
const orgSelectOptions = ref<SelectOption[]>([]);
// 不同 action 表单显示
const modelAdd = {title: 'sercurity.orgUser.index.model.title.add', cancelText: 'sercurity.orgUser.index.model.cancel.text', footer: true};
const modelEdit = {title: 'sercurity.orgUser.index.model.title.edit', cancelText: 'sercurity.orgUser.index.model.cancel.text', footer: true};
const modelView = {title: 'sercurity.orgUser.index.model.title.view', cancelText: 'sercurity.orgUser.index.model.close.text', footer: false};
let modelAttr = modelAdd;
// 页面响应
let okSuccessBack: any;
const buildOrgOptions = (defaultData: SelectOption[], totalData: QueryOrgForm[]): SelectOption[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (item.pid === data.value) {
        data.children.push({value: item.id, label: item.name, children: []});
      }
    }
    if (data.children.length > 0) {
      buildOrgOptions(data.children, totalData);
    } else {
      delete data.children;
    }
  }

  return defaultData;
}
const getOrgOptions = async () => {
  try {
    const {data} = await queryOrgs();
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: '根目录', children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children;
  } catch (err) {
    console.log(err);
  }
}
/**
 * 创建、更新
 * @param params
 * @param done
 */
const createOrUpdateData = async (params: QueryOrgUserForm, done: any) => {
  try {
    const {data} = await insertOrgUser(params);
    done();
    okSuccessBack();
  } catch (err) {
    console.log(err);
  }
};

/**
 * 获取一条数据
 * @param id
 * @param successBack
 */
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getOrgUser(id);
    successBack(data);
  } catch (err) {
    console.log(err);
  }
};

/**
 * 打开表单
 * @param action 状态
 * @param id  数据id
 * @param okBack 响应方法
 */
const openForm = (action: string, id: string, okBack?: any, userForm?: QueryUserForm) => {
  getOrgOptions();
  if (action === "add") {
    formData.value = generateFormData();
    formData.value.userId = userForm?.id || '';
    formData.value.userName = userForm?.name || '';
    modelAttr = modelAdd;
    visibleModel.value = true;
  } else {
    formData.value = generateFormData();
    modelAttr = (action === "edit") ? modelEdit : modelView;

    getData(id, function (data: QueryOrgUserForm) {
      formData.value = data;
      visibleModel.value = true;
    });
  }

  okSuccessBack = okBack || null;
}

/* 表单 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, done);
};
const handleModelCancel = () => {
  visibleModel.value = false;
}

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}

// 将方法暴露出去
defineExpose({openForm});
</script>

<style scoped lang="less">
div.arco-form-item-content > a-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
</style>