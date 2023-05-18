<template>
  <a-modal
      v-model:visible="visibleModel"
      :title="$t(`${modelAttr.title}`)"
      :footer="modelAttr.footer"
      :cancel-text="$t(`${modelAttr.cancelText}`)"
      :ok-text="$t('sercurity.org.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.pid"/>
      </a-form-item>
      <a-form-item field="name" :label="$t('sercurity.org.index.form.name')">
        <a-input v-if="modelAttr.footer" v-model="formData.name" :max-length="32"/>
        <a-span v-else>{{ formData.name }}</a-span>
      </a-form-item>
      <a-form-item field="code" :label="$t('sercurity.org.index.form.code')">
        <a-input v-if="modelAttr.footer" v-model="formData.code" :max-length="32"/>
        <a-span v-else>{{ formData.code }}</a-span>
      </a-form-item>
      <a-form-item field="type" :label="$t('sercurity.org.index.form.type')">
        <a-select v-if="modelAttr.footer" v-model="formData.type">
          <a-option v-for="item of typeOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.org.index.form.type.${formData.type}`) }}</a-span>
      </a-form-item>
      <a-form-item field="status" :label="$t('sercurity.org.index.form.status')">
        <a-select v-if="modelAttr.footer" v-model="formData.status">
          <a-option v-for="item of statusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.org.index.form.status.${formData.status}`) }}</a-span>
      </a-form-item>
      <a-form-item field="seqNo" :label="$t('sercurity.org.index.form.seqNo')">
        <a-input-number v-if="modelAttr.footer" v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
        <a-span v-else>{{ formData.seqNo }}</a-span>
      </a-form-item>
      <a-form-item field="description" :label="$t('sercurity.org.index.form.description')">
        <a-textarea v-if="modelAttr.footer" v-model="formData.description" :max-length="512" :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
        <a-span v-else :title="formData.description" @click="openModal(`${formData.description}`)">{{ formData.description }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {statusOptions, typeOptions} from "@/views/security/org/searchTable";
import {createOrUpdateOrg, getOrg, QueryOrgForm} from '@/api/sercurity_service'

const generateFormData = () => {
  return {id: '', pid: '', name: '', code: new Date().getTime().toString(), status: 1, type: 'outside', seqNo: 999, description: ''};
}
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const formData = ref(generateFormData());
// 不同 action 表单显示
const modelAdd = {title: 'sercurity.org.index.model.title.add', cancelText: 'sercurity.org.index.model.cancel.text', footer: true};
const modelEdit = {title: 'sercurity.org.index.model.title.edit', cancelText: 'sercurity.org.index.model.cancel.text', footer: true};
const modelView = {title: 'sercurity.org.index.model.title.view', cancelText: 'sercurity.org.index.model.close.text', footer: false};
let modelAttr = modelAdd;
// 页面响应
let okSuccessBack: any;

/**
 * 创建、更新
 * @param params
 * @param done
 */
const createOrUpdateData = async (params: QueryOrgForm, done: any) => {
  try {
    const {data} = await createOrUpdateOrg(params);
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
    const {data} = await getOrg(id);
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

    getData(id, function (data: QueryOrgForm) {
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