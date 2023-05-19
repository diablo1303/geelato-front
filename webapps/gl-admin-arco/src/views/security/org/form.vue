<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :title="$t(`sercurity.org.index.model.title.${pageData.formState}`)"
      :footer="pageData.button"
      :cancel-text="$t(`sercurity.org.index.model.cancel.text`)"
      :ok-text="$t('sercurity.org.index.model.ok.text')"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.pid"/>
      </a-form-item>
      <a-form-item field="name" :label="$t('sercurity.org.index.form.name')">
        <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
        <a-span v-else>{{ formData.name }}</a-span>
      </a-form-item>
      <a-form-item field="code" :label="$t('sercurity.org.index.form.code')">
        <a-input v-if="pageData.button" v-model="formData.code" :max-length="32"/>
        <a-span v-else>{{ formData.code }}</a-span>
      </a-form-item>
      <a-form-item field="type" :label="$t('sercurity.org.index.form.type')">
        <a-select v-if="pageData.button" v-model="formData.type">
          <a-option v-for="item of typeOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.org.index.form.type.${formData.type}`) }}</a-span>
      </a-form-item>
      <a-form-item field="status" :label="$t('sercurity.org.index.form.status')">
        <a-select v-if="pageData.button" v-model="formData.status">
          <a-option v-for="item of statusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
        </a-select>
        <a-span v-else>{{ $t(`sercurity.org.index.form.status.${formData.status}`) }}</a-span>
      </a-form-item>
      <a-form-item field="seqNo" :label="$t('sercurity.org.index.form.seqNo')">
        <a-input-number v-if="pageData.button" v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
        <a-span v-else>{{ formData.seqNo }}</a-span>
      </a-form-item>
      <a-form-item field="description" :label="$t('sercurity.org.index.form.description')">
        <a-textarea v-if="pageData.button" v-model="formData.description" :max-length="512" :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
        <a-span v-else :title="formData.description" @click="openModal(`${formData.description}`)">{{ formData.description }}</a-span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {statusOptions, typeOptions} from "@/views/security/org/searchTable";
import {createOrUpdateOrg as createOrUpdateForm, getOrg as getForm, QueryOrgForm as QueryForm} from '@/api/sercurity_service'

const pageData = ref({formState: 'add', button: true});
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const generateFormData = (): QueryForm => {
  return {id: '', pid: '', name: '', code: new Date().getTime().toString(), status: 1, type: 'outside', seqNo: 999, description: ''};
}
const formData = ref(generateFormData());
// 页面响应
let okSuccessBack: any;

/**
 * 创建、更新
 * @param params
 */
const createOrUpdateData = async (params: QueryForm, done: any) => {
  try {
    await createOrUpdateForm(params);
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
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
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
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}

/**
 * 打开表单
 * @param action 状态
 * @param id  数据id
 * @param okBack 响应方法
 */
const openForm = (action: string, id: string, okBack?: any) => {
  // 全局
  pageData.value.formState = action;
  pageData.value.button = (action === 'add' || action === 'edit');
  formData.value = generateFormData();
  // 特色
  if (action === "add") {
    visibleModel.value = true;
  } else {
    getData(id, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
      formData.value = data;
      visibleModel.value = true;
    });
  }

  okSuccessBack = okBack || null;
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