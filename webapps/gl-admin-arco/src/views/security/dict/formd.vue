<template>
  <a-modal
      v-model:visible="visibleModel"
      :title="$t(`${modelAttr.title}`)"
      :footer="modelAttr.footer"
      :cancel-text="$t(`${modelAttr.cancelText}`)"
      :ok-text="$t('sercurity.dict.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
      </a-form-item>
      <a-form-item field="dicName" :label="$t('sercurity.dict.index.form.dicName')">
        <a-input v-if="modelAttr.footer" v-model="formData.dicName" :max-length="32"/>
        <a-span v-else>{{ formData.dicName }}</a-span>
      </a-form-item>
      <a-form-item field="dicCode" :label="$t('sercurity.dict.index.form.dicCode')">
        <a-input v-if="modelAttr.footer" v-model="formData.dicCode" :max-length="32"/>
        <a-span v-else>{{ formData.dicCode }}</a-span>
      </a-form-item>
      <a-form-item field="tenantCode" :label="$t('sercurity.dict.index.form.tenantCode')">
        <a-input v-if="modelAttr.footer" v-model="formData.tenantCode" :max-length="32"/>
        <a-span v-else>{{ formData.tenantCode }}</a-span>
      </a-form-item>
      <a-form-item field="enableStatus" :label="$t('sercurity.dict.index.form.enableStatus')">
        <a-select v-if="modelAttr.footer" v-model="formData.enableStatus">
          <a-option v-for="item of enableStatusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.dict.index.form.enableStatus.${formData.enableStatus}`) }}</a-span>
      </a-form-item>
      <a-form-item field="seqNo" :label="$t('sercurity.dict.index.form.seqNo')">
        <a-input-number v-if="modelAttr.footer" v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
        <a-span v-else>{{ formData.seqNo }}</a-span>
      </a-form-item>
      <a-form-item field="dicRemark" :label="$t('sercurity.dict.index.form.dicRemark')">
        <a-textarea v-if="modelAttr.footer" v-model="formData.dicRemark" :max-length="512" :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
        <a-span v-else :title="formData.dicRemark" @click="openModal(`${formData.dicRemark}`)">{{ formData.dicRemark }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {createOrUpdateDict as createOrUpdateForm, getDict as getForm, QueryDictForm as QueryForm} from '@/api/sercurity_service'
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";

/* 表单 */
const generateFormData = (): QueryForm => {
  return {id: '', tenantCode: '', dicName: '', dicCode: '', dicRemark: '', enableStatus: 1, seqNo: 999};
}
const dictItemListRef = ref(null);
const visibleModel = ref(false);
const formData = ref(generateFormData());
const modelAdd = {title: 'sercurity.dict.index.model.title.add', cancelText: 'sercurity.dict.index.model.cancel.text', footer: true};
const modelEdit = {title: 'sercurity.dict.index.model.title.edit', cancelText: 'sercurity.dict.index.model.cancel.text', footer: true};
const modelView = {title: 'sercurity.dict.index.model.title.view', cancelText: 'sercurity.dict.index.model.close.text', footer: false};
let modelAttr = modelAdd;

// 页面响应
let okSuccessBack: any;
const createOrUpdateData = async (params: QueryForm, done: any) => {
  try {
    const {data} = await createOrUpdateForm(params);
    done();
    okSuccessBack();
  } catch (err) {
    console.log(err);
  }
};
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
    console.log(err);
  }
};

const openForm = (action: string, id: string, okBack?: any) => {
  if (action === "add") {
    formData.value = generateFormData();
    modelAttr = modelAdd;
    visibleModel.value = true;
  } else {
    formData.value = generateFormData();
    modelAttr = (action === "edit") ? modelEdit : modelView;

    getData(id, function (data: QueryForm) {
      data.seqNo = Number(data.seqNo);
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