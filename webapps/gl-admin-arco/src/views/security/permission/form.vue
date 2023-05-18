<template>
  <a-modal
      v-model:visible="visibleModel"
      :title="$t(`${modelAttr.title}`)"
      :footer="modelAttr.footer"
      :cancel-text="$t(`${modelAttr.cancelText}`)"
      :ok-text="$t('sercurity.permission.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
      </a-form-item>
      <a-form-item field="name" :label="$t('sercurity.permission.index.form.name')">
        <a-input v-if="modelAttr.footer" v-model="formData.name" :max-length="32"/>
        <a-span v-else>{{ formData.name }}</a-span>
      </a-form-item>
      <a-form-item field="text" :label="$t('sercurity.permission.index.form.text')">
        <a-input v-if="modelAttr.footer" v-model="formData.text" :max-length="32"/>
        <a-span v-else>{{ formData.text }}</a-span>
      </a-form-item>
      <a-form-item field="description" :label="$t('sercurity.permission.index.form.description')">
        <a-textarea v-if="modelAttr.footer" v-model="formData.description" :max-length="512" :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
        <a-span v-else :title="formData.description" @click="openModal(`${formData.description}`)">{{ formData.description }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {createOrUpdatePermission, getPermission, QueryPermissionForm} from '@/api/sercurity_service'

const generateFormData = () => {
  return {id: '', name: '', text: '', description: ''};
}
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const formData = ref(generateFormData());
// 不同 action 表单显示
const modelAdd = {title: 'sercurity.permission.index.model.title.add', cancelText: 'sercurity.permission.index.model.cancel.text', footer: true};
const modelEdit = {title: 'sercurity.permission.index.model.title.edit', cancelText: 'sercurity.permission.index.model.cancel.text', footer: true};
const modelView = {title: 'sercurity.permission.index.model.title.view', cancelText: 'sercurity.permission.index.model.close.text', footer: false};
let modelAttr = modelAdd;
// 页面响应
let okSuccessBack: any;

/**
 * 创建、更新
 * @param params
 * @param done
 */
const createOrUpdateData = async (params: QueryPermissionForm, done: any) => {
  try {
    const {data} = await createOrUpdatePermission(params);
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
    const {data} = await getPermission(id);
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
const openForm = (action: string, id: string, okBack?: any) => {
  if (action === "add") {
    formData.value = generateFormData();
    modelAttr = modelAdd;
    visibleModel.value = true;
  } else {
    formData.value = generateFormData();
    modelAttr = (action === "edit") ? modelEdit : modelView;

    getData(id, function (data: QueryPermissionForm) {
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