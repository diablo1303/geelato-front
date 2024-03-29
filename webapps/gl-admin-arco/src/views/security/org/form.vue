<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('security.org.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.org.index.model.ok.text')"
      :title="$t(`security.org.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.name')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="name">
        <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
        <span v-else>{{ formData.name }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.code')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
          field="code">
        <a-input v-if="pageData.button" v-model="formData.code" :max-length="32"/>
        <span v-else>{{ formData.code }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.pid')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="pid">
        <OrgChooseBox v-model="formData.pid" :max-count="1" :has-root="false" :disabled="!pageData.button"/>
        <!--        <a-cascader v-if="pageData.button" v-model="formData.pid" :options="orgSelectOptions" allow-clear allow-search check-strictly/>
                <span v-else>{{ pageData.orgName }}</span>-->
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.type')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="type">
        <a-select v-if="pageData.button" v-model="formData.type">
          <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.org.index.form.type.${formData.type}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.category')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="category">
        <a-select v-if="pageData.button" v-model="formData.category">
          <a-option v-for="item of categoryOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.org.index.form.category.${formData.category}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.status')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="status">
        <a-select v-if="pageData.button" v-model="formData.status">
          <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.org.index.form.status.${formData.status}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.org.index.form.seqNo')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="seqNo">
        <a-input-number
            v-if="pageData.button"
            v-model="formData.seqNo"
            :max="999999999"
            :min="1"
            :placeholder="$t('security.form.rules.match.length.title')+'[0,999999999]'"
            :precision="0"/>
        <span v-else>{{ formData.seqNo }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.org.index.form.description')" field="description">
        <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {FormInstance, Modal} from "@arco-design/web-vue";
import {categoryOptions, statusOptions, typeOptions} from "@/views/security/org/searchTable";
import {createOrUpdateOrg as createOrUpdateForm, getOrg as getForm, QueryOrgForm, QueryOrgForm as QueryForm, queryOrgs, validateOrgCode} from '@/api/security'
import {ListUrlParams, SelectOption} from '@/api/base';
import OrgChooseBox from "@/components/org-choose-box/index.vue";

const route = useRoute();
const pageData = ref({formState: 'add', button: true, orgName: ''});
const validateForm = ref<FormInstance>();
const orgSelectOptions = ref<SelectOption[]>([]);
const orgOptions = ref<QueryForm[]>([]);
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const generateFormData = (): QueryForm => {
  return {
    id: '',
    pid: '0',
    name: '',
    code: new Date().getTime().toString(),
    status: 1,
    type: '',
    category: 'inside',
    seqNo: 999,
    description: '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
}
const formData = ref(generateFormData());
// 页面响应
let okSuccessBack: any;
// 国际化
const {t} = useI18n();

const buildOrgOptions = (defaultData: SelectOption[], totalData: QueryOrgForm[]): SelectOption[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (item.id === formData.value.id) {
        // eslint-disable-next-line no-continue
        continue;
      }
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
const getOrgOptions = async (params: QueryOrgForm = {} as unknown as QueryOrgForm) => {
  const rootName = t('security.org.index.form.root');
  try {
    const {data} = await queryOrgs(params);
    orgOptions.value = data;
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: rootName, children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children || [];
    orgSelectOptions.value.push({value: '0', label: rootName});
    orgOptions.value.push({id: '0', name: rootName} as unknown as QueryForm);
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
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const {data} = await validateOrgCode(formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/* 打开表单 */
const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.orgName = '';
  formData.value = generateFormData();
  formData.value.id = urlParams.id || '';
  // 组织加载
  getOrgOptions({tenantCode: formData.value.tenantCode} as QueryOrgForm);
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.action === "add") {
    visibleModel.value = true;
  } else if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
      formData.value = data;
      // eslint-disable-next-line no-restricted-syntax
      for (const item of orgOptions.value) {
        if (item.id === data.pid) {
          pageData.value.orgName = item.name;
          break;
        }
      }
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