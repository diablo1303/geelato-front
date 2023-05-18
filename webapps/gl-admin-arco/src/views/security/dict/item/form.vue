<template>
  <a-modal
      v-model:visible="visibleModel"
      :title="$t(`${modelAttr.title}`)"
      :footer="modelAttr.footer"
      :cancel-text="$t(`${modelAttr.cancelText}`)"
      :ok-text="$t('sercurity.dictItem.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.dictId"/>
      </a-form-item>
      <a-form-item field="itemText" :label="$t('sercurity.dictItem.index.form.itemText')">
        <a-input v-if="modelAttr.footer" v-model="formData.itemText" :max-length="32"/>
        <a-span v-else>{{ formData.itemText }}</a-span>
      </a-form-item>
      <a-form-item field="itemCode" :label="$t('sercurity.dictItem.index.form.itemCode')">
        <a-input v-if="modelAttr.footer" v-model="formData.itemCode" :max-length="32"/>
        <a-span v-else>{{ formData.itemCode }}</a-span>
      </a-form-item>
      <a-form-item field="enableStatus" :label="$t('sercurity.dictItem.index.form.enableStatus')">
        <a-select v-if="modelAttr.footer" v-model="formData.enableStatus">
          <a-option v-for="item of enableStatusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.dictItem.index.form.enableStatus.${formData.enableStatus}`) }}</a-span>
      </a-form-item>
      <a-form-item field="seqNo" :label="$t('sercurity.dictItem.index.form.seqNo')">
        <a-input-number v-if="modelAttr.footer" v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
        <a-span v-else>{{ formData.seqNo }}</a-span>
      </a-form-item>
      <a-form-item field="dataRemark" :label="$t('sercurity.dictItem.index.form.dataRemark')">
        <a-textarea v-if="modelAttr.footer" v-model="formData.dataRemark" :max-length="512" :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
        <a-span v-else :title="formData.dataRemark" @click="openModal(`${formData.dataRemark}`)">{{ formData.dataRemark }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {createOrUpdateDictItem as createOrUpdateForm, getDictItem as getForm, QueryDictItemForm as QueryForm} from '@/api/sercurity_service'
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";

/* 表单 */
const generateFormData = (): QueryForm => {
  return {id: '', dictId: '', itemText: '', itemCode: '', enableStatus: 1, seqNo: 999, dataRemark: ''};
}
const visibleModel = ref(false);
const formData = ref(generateFormData());
const modelAdd = {title: 'sercurity.dictItem.index.model.title.add', cancelText: 'sercurity.dictItem.index.model.cancel.text', footer: true};
const modelEdit = {title: 'sercurity.dictItem.index.model.title.edit', cancelText: 'sercurity.dictItem.index.model.cancel.text', footer: true};
const modelView = {title: 'sercurity.dictItem.index.model.title.view', cancelText: 'sercurity.dictItem.index.model.close.text', footer: false};
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

const openForm = (action: string, id: string, okBack?: any, pid?: string) => {
  if (action === "add") {
    formData.value = generateFormData();
    formData.value.dictId = pid || '';
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