<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('sercurity.dictItem.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('sercurity.dictItem.index.model.ok.text')"
      :title="$t(`sercurity.dictItem.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
        <a-input v-show="false" v-model="formData.dictId"/>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.dictItem.index.form.itemText')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="itemText">
        <a-input v-if="pageData.button" v-model="formData.itemText" :max-length="32"/>
        <span v-else>{{ formData.itemText }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.dictItem.index.form.itemCode')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="itemCode">
        <a-input v-if="pageData.button" v-model="formData.itemCode" :max-length="32"/>
        <span v-else>{{ formData.itemCode }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.dictItem.index.form.enableStatus')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="enableStatus">
        <a-select v-if="pageData.button" v-model="formData.enableStatus">
          <a-option v-for="item of enableStatusOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`sercurity.dictItem.index.form.enableStatus.${formData.enableStatus}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('sercurity.dictItem.index.form.seqNo')"
          :rules="[{required: true,message: $t('sercurity.form.rules.match.required')}]"
          field="seqNo">
        <a-input-number v-if="pageData.button" v-model="formData.seqNo" :max="999999" :min="1" :placeholder="$t('sercurity.form.rules.match.length.title')+'[0,999999]'"
                        :precision="0"/>
        <span v-else>{{ formData.seqNo }}</span>
      </a-form-item>
      <a-form-item :label="$t('sercurity.dictItem.index.form.dataRemark')" field="dataRemark">
        <a-textarea v-if="pageData.button" v-model="formData.dataRemark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.dataRemark" class="textarea-span" @click="openModal(`${formData.dataRemark}`)">{{ formData.dataRemark }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";
import {createOrUpdateDictItem as createOrUpdateForm, getDictItem as getForm, ListUrlParams, QueryDictItemForm as QueryForm} from '@/api/sercurity_service'
import {FormInstance} from "@arco-design/web-vue/es/form";

/* 表单 */
const pageData = ref({formState: 'add', button: true});
const validateForm = ref<FormInstance>();
// 显示隐藏
const visibleModel = ref(false);
const generateFormData = (): QueryForm => {
  return {id: '', dictId: '', itemText: '', itemCode: '', enableStatus: 1, seqNo: 999, dataRemark: ''};
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

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  formData.value = generateFormData();
  formData.value.dictId = urlParams.params?.dictId || '';
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