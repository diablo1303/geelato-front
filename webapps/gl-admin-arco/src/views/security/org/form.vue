<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('sercurity.org.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('sercurity.org.index.model.ok.text')"
      :title="$t(`sercurity.org.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.pid"/>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.org.index.form.name')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="name">
        <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
        <span v-else>{{ formData.name }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.org.index.form.code')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="code">
        <a-input v-if="pageData.button" v-model="formData.code" :max-length="32"/>
        <span v-else>{{ formData.code }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.org.index.form.type')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="type">
        <a-select v-if="pageData.button" v-model="formData.type">
          <a-option v-for="item of typeOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`sercurity.org.index.form.type.${formData.type}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.org.index.form.status')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="status">
        <a-select v-if="pageData.button" v-model="formData.status">
          <a-option v-for="item of statusOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`sercurity.org.index.form.status.${formData.status}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.org.index.form.seqNo')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="seqNo">
        <a-input-number v-if="pageData.button" v-model="formData.seqNo" :max="999999" :min="1" :placeholder="$t('sercurity.form.rules.match.length.title')+'[0,999999]'"
                        :precision="0"/>
        <span v-else>{{ formData.seqNo }}</span>
      </a-form-item>
      <a-form-item :label="$t('sercurity.org.index.form.description')" field="description">
        <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Modal} from "@arco-design/web-vue";
import {statusOptions, typeOptions} from "@/views/security/org/searchTable";
import {createOrUpdateOrg as createOrUpdateForm, getOrg as getForm, ListUrlParams, QueryOrgForm as QueryForm} from '@/api/sercurity_service'
import {FormInstance} from "@arco-design/web-vue/es/form";

const pageData = ref({formState: 'add', button: true});
const validateForm = ref<FormInstance>();
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
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/* 打开表单 */
const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.action === "add") {
    visibleModel.value = true;
  } else if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
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