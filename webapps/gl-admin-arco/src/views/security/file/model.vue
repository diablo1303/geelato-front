<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }" class="form">
    <a-row :gutter="16">
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.title')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="title">
          <a-input v-if="pageData.button" v-model.trim="formData.title" :max-length="32"/>
          <span v-else>{{ formData.title }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.useType')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="useType">
          <a-select v-if="pageData.button" v-model="formData.useType">
            <a-option v-for="item of useTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.file.index.form.useType.${formData.useType}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.template')"
            :rules="[{required: !['import'].includes(formData.useType),message: $t('security.form.rules.match.required')}]"
            field="template">
          <!--        <a-upload :action="getUploadUrl()"
                            :file-list="templateFile"
                            :headers="uploadHeader()"
                            :limit="1"
                            :show-remove-button="pageData.button"
                            :accept="formData.useType==='import'?'.xls,.xlsx':'.doc,.docx,.xls,.xlsx'"
                            list-type="text"
                            @error="uploadError" @success="uploadTSuccess" @before-remove="beforeRemoveT"/>-->
          <UploadBase64 v-model="formData.template"
                        :accept="formData.useType==='import'?'.xls,.xlsx':'.doc,.docx,.xls,.xlsx'"
                        :disabled="!pageData.button" @change="configValueBase64"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.fileType')"
            :rules="[{required: !['import'].includes(formData.useType),message: $t('security.form.rules.match.required')}]"
            field="fileType">
        <span>{{
            formData.fileType ? $t(`security.file.index.form.fileType.${formData.fileType}`) : $t('security.file.index.form.fileType.placeholder')
          }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.templateRule')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
            field="templateRule">
          <!--        <a-upload :action="getUploadUrl()"
                            :file-list="templateRuleFile"
                            :headers="uploadHeader()"
                            :limit="1"
                            :show-remove-button="pageData.button"
                            accept=".xls,.xlsx"
                            list-type="text"
                            @error="uploadError" @success="uploadTRSuccess" @before-remove="beforeRemoveTR"/>-->
          <UploadBase64 v-model="formData.templateRule" :disabled="!pageData.button" accept=".xls,.xlsx"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.fileCode')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
            field="fileCodeFormat">
          <a-input-tag v-if="pageData.button" v-model="formData.fileCodeFormat" :placeholder="$t('security.file.index.form.fileCode.placeholder')"
                       :unique-value="true"
                       allow-clear/>
          <a-space v-else :style="{'flex-wrap':'wrap'}">
            <a-tag v-for="(item, index) of formData.fileCodeFormat" :key="index" :style="{'margin-bottom':'4px'}">{{ item }}</a-tag>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.file.index.form.appId')" field="appId">
          <a-select v-model="formData.appId" :disabled="!pageData.button" :field-names="{value: 'id', label: 'name'}"
                    :options="selectAppOptions" allow-search/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.file.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.file.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.file.index.form.description')" field="description">
          <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>

  <a-collapse v-if="['import'].includes(formData.useType)" :key="pageData.key" :default-active-key="[1,2,3]">
    <template #expand-icon="{ active }">
      <icon-double-down v-if="active"/>
      <icon-double-right v-else/>
    </template>
    <ImportBusinessType v-model="formData.businessTypeData" :disabled="!pageData.button"/>
    <ImportBusinessRule v-model="formData.businessRuleData" :business-type-data="formData.businessTypeData as any[]" :disabled="!pageData.button"/>
    <ImportBusinessMeta v-model="formData.businessMetaData" :business-type-data="formData.businessTypeData as any[]" :disabled="!pageData.button"/>
  </a-collapse>
  <a-collapse v-if="['export'].includes(formData.useType)" :key="pageData.key" :default-active-key="[1]">
    <template #expand-icon="{ active }">
      <icon-double-down v-if="active"/>
      <icon-double-right v-else/>
    </template>
    <ExportBusinessMeta v-model="formData.businessMetaData" :disabled="!pageData.button"/>
  </a-collapse>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {FileItem, FormInstance, Modal, Notification} from "@arco-design/web-vue";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateFileTemplate as createOrUpdateForm, getFileTemplate as getForm, QueryFileTemplateForm as QueryForm} from '@/api/template'
import {enableStatusOptions, useTypeOptions,} from "@/views/security/file/searchTable";
import {AttachmentForm, Base64FileParams, fetchFileToBase64, getAttachmentByIds} from "@/api/attachment";
import UploadBase64 from "@/components/upload-base64/index.vue";
import {isJSON} from "@/utils/is";
import ImportBusinessType from "@/views/security/file/import/type.vue";
import ImportBusinessRule from "@/views/security/file/import/rule.vue";
import ImportBusinessMeta from "@/views/security/file/import/meta.vue";
import ExportBusinessMeta from "@/views/security/file/export/meta.vue";
import {generateRandom} from "@/utils/strings";
import {QueryAppForm, QueryAppForm as QuerySelectForm, queryApps as querySelectOptions} from "@/api/security";
import {cloneDeep} from "lodash";

const route = useRoute();
const {t} = useI18n();
const pageData = ref({formState: 'add', button: true, formCol: 1, key: generateRandom()});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    title: '',
    useType: '',
    fileType: '',
    fileCode: '',
    fileCodeFormat: [],
    template: '',
    templateRule: '',
    enableStatus: 1,
    description: '',
    appId: (route.params && route.params.appId as string) || '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    businessTypeData: [],
    businessMetaData: [],
    businessRuleData: [],
  };
}
const formData = ref(generateFormData());
const templateFile = ref<FileItem[]>([]);
const templateRuleFile = ref<FileItem[]>([]);

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  console.log(params);
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      params.fileCode = params.fileCodeFormat ? params.fileCodeFormat.join(",") : '';
      params.fileType = params.useType === 'import' ? 'excel' : params.fileType;
      params.businessTypeData = params.businessTypeData && params.businessTypeData.length > 0 ? JSON.stringify(params.businessTypeData) : '';
      params.businessRuleData = params.businessRuleData && params.businessRuleData.length > 0 ? JSON.stringify(params.businessRuleData) : '';
      params.businessMetaData = params.businessMetaData && params.businessMetaData.length > 0 ? JSON.stringify(params.businessMetaData) : '';
      delete params.fileCodeFormat;
      const {data} = await createOrUpdateForm(params);
      templateFile.value = [];
      templateRuleFile.value = [];
      successBack(data);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    failBack(err);
  }
};

/* 文件上传 */
const deleteFileItem = (fileList: FileItem[], delUid: string) => {
  if (fileList != null && fileList.length > 0) {
    let delIndex = -1;
    for (let i = 0; i < fileList.length; i += 1) {
      if (fileList[i].uid === delUid) {
        delIndex = i;
      }
    }
    if (delIndex > -1) {
      fileList.splice(delIndex, 1);
    }
  }
}
const uploadError = (fileItem: FileItem) => {
  Notification.error("上传失败，请重试！");
}
const setTemplate = (fileName?: string) => {
  formData.value.template = templateFile.value.map((item) => {
    return item.uid;
  }).join(",");
  formData.value.fileType = '';
  if (fileName) {
    if (fileName.lastIndexOf('.xls') !== -1 || fileName.lastIndexOf('.xlsx') !== -1) {
      formData.value.fileType = 'excel';
    } else if (fileName.lastIndexOf('.doc') !== -1 || fileName.lastIndexOf('.docs') !== -1) {
      formData.value.fileType = 'doc';
    }
  }
}
const beforeRemoveT = async (fileItem: FileItem): Promise<boolean> => {
  try {
    // await deleteAttachment(fileItem.uid);
    Notification.success("删除成功");
    deleteFileItem(templateFile.value, fileItem.uid);
    setTemplate('');
    return true;
  } catch (err) {
    return false;
  }
}
const uploadTSuccess = (fileItem: FileItem) => {
  Notification.success("上传成功");
  fileItem.uid = fileItem.response.data.id;
  templateFile.value.push(fileItem);
  setTemplate(fileItem.name);
}
const setTemplateRule = () => {
  formData.value.templateRule = templateRuleFile.value.map((item) => {
    return item.uid;
  }).join(",");
}
const beforeRemoveTR = async (fileItem: FileItem): Promise<boolean> => {
  try {
    // await deleteAttachment(fileItem.uid);
    Notification.success("删除成功");
    deleteFileItem(templateRuleFile.value, fileItem.uid);
    setTemplateRule();
    return true;
  } catch (err) {
    return false;
  }
}
const uploadTRSuccess = (fileItem: FileItem) => {
  Notification.success("上传成功");
  fileItem.uid = fileItem.response.data.id;
  templateRuleFile.value.push(fileItem);
  setTemplateRule();
}
const loadFiles = (attachmentIds: string, type: string) => {
  if (attachmentIds !== null && attachmentIds !== '' && !isJSON(attachmentIds)) {
    getAttachmentByIds(attachmentIds, (attachs: AttachmentForm[]) => {
      if (attachs != null && attachs.length > 0) {
        attachs.forEach((value, index, array) => {
          if (value.delStatus === 0) {
            fetchFileToBase64(value.id, (base64String: string) => {
              if (base64String) {
                const data: Base64FileParams = {
                  base64: base64String.split(",")[1],
                  name: value.name, size: Number(value.size), type: value.type
                };
                if (type === 't') {
                  formData.value.template = JSON.stringify(data);
                } else if (type === 'tr') {
                  formData.value.templateRule = JSON.stringify(data);
                }
              }
            });
          }
        });
      }
    }, () => {
    });
  }
}

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

const configValueBase64 = (base64String: string) => {
  formData.value.fileType = '';
  if (base64String && isJSON(base64String)) {
    const baseData: Base64FileParams = JSON.parse(base64String);
    if (baseData && baseData.name) {
      const suffix = baseData.name.split(".").pop() || '';
      if (['xls', 'xlsx'].includes(suffix)) {
        formData.value.fileType = 'excel';
      } else if (['doc', 'docx'].includes(suffix)) {
        formData.value.fileType = 'doc';
      }
    }
  }
}

const selectAppOptions = ref<QuerySelectForm[]>([]);
const getSelectAppOptions = async () => {
  try {
    const {data} = await querySelectOptions({
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as unknown as QueryAppForm);
    selectAppOptions.value = data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  getSelectAppOptions();
  pageData.value.key = generateRandom();
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  templateFile.value = [];
  templateRuleFile.value = [];
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      formData.value = data;
      formData.value.fileCodeFormat = data.fileCode ? data.fileCode.split(",") : [];
      loadFiles(data.template, 't');
      loadFiles(data.templateRule, 'tr');
      formData.value.businessTypeData = data.businessTypeData && typeof data.businessTypeData === 'string' ? JSON.parse(data.businessTypeData) : [];
      formData.value.businessRuleData = data.businessRuleData && typeof data.businessRuleData === 'string' ? JSON.parse(data.businessRuleData) : [];
      formData.value.businessMetaData = data.businessMetaData && typeof data.businessMetaData === 'string' ? JSON.parse(data.businessMetaData) : [];
      urlParams.loadSuccessBack(data);
    }, urlParams.loadFailBack);
  }
}
const submitModel = (done: any, successBack?: any, failBack?: any) => {
  createOrUpdateData(cloneDeep(formData.value), successBack, failBack);
};

// 将方法暴露出去
defineExpose({loadModel, submitModel});
</script>
<script lang="ts">
export default {
  name: 'FileTemplateModel'
};
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

.arco-collapse-item-active > .arco-collapse-item-header {
  background-color: #FFFFFF !important;
}
</style>