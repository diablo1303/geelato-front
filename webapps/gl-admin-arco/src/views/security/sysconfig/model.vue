<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }" class="form">
    <a-row :gutter="16">
      <a-form-item
          :label="$t('security.sysConfig.index.form.keyType')"
          field="keyType">
        <a-input-tag v-if="pageData.button" v-model="formData.keyType"
                     :placeholder="$t('security.file.index.form.fileCode.placeholder')"
                     :unique-value="true" allow-clear/>
        <a-space v-else :style="{'flex-wrap':'wrap'}">
          <a-tag v-for="(item, index) of formData.keyType" :key="index" :style="{'margin-bottom':'4px'}">{{ item }}</a-tag>
        </a-space>
      </a-form-item>
      <a-form-item
          :label="$t('security.sysConfig.index.form.configKey')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
          field="configKey">
        <a-textarea v-if="pageData.button" v-model.trim="formData.configKey" :auto-size="{minRows:1}" :max-length="100" show-word-limit/>
        <span v-else>{{ formData.configKey }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.sysConfig.index.form.valueType')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="valueType">
        <a-select v-model="formData.valueType" :disabled="!pageData.button" :options="selectTypeOptions" allow-search
                  @change="selectTypeChange(formData.valueType)"/>
      </a-form-item>
      <a-form-item
          v-if="['UPLOAD'].includes(formData.valueType)"
          :label="$t('security.sysConfig.index.form.configValue')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="configValue">
        <a-upload :action="getUploadUrl()"
                  :file-list="templateFile"
                  :headers="uploadHeader()"
                  :limit="1"
                  :show-remove-button="pageData.button"
                  list-type="text"
                  @error="uploadError" @success="uploadTSuccess" @before-remove="beforeRemoveT"/>
      </a-form-item>
      <a-form-item
          v-else-if="['BASE64'].includes(formData.valueType)"
          :label="$t('security.sysConfig.index.form.configValue')"
          :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
          field="configValue">
        <UploadBase64 v-model="formData.configValue" :disabled="!pageData.button"/>
      </a-form-item>
      <a-form-item v-else
                   :label="$t('security.sysConfig.index.form.configValue')"
                   :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                   field="configValue">
        <a-textarea v-if="pageData.button" v-model.trim="formData.configValue" :auto-size="{minRows:1}" :max-length="2000" show-word-limit/>
        <span v-else>{{ formData.configValue }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.sysConfig.index.form.appId')" field="appId">
        <a-select :disabled="!pageData.button" v-model="formData.appId" :field-names="{value: 'id', label: 'name'}"
                  :options="selectAppOptions" allow-search/>
      </a-form-item>
      <a-form-item
          :label="$t('security.sysConfig.index.form.enableStatus')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="enableStatus">
        <a-select v-if="pageData.button" v-model="formData.enableStatus">
          <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.sysConfig.index.form.enableStatus.${formData.enableStatus}`) }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.sysConfig.index.form.remark')" field="remark">
        <a-textarea v-if="pageData.button" v-model="formData.remark" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.remark" class="textarea-span" @click="openModal(`${formData.remark}`)">{{ formData.remark }}</span>
      </a-form-item>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {FileItem, FormInstance, Modal, Notification} from "@arco-design/web-vue";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateSysConfig as createOrUpdateForm, getSysConfig as getForm, QuerySysConfigForm as QueryForm, validateSysConfigKey} from '@/api/sysconfig'
import {enableStatusOptions} from "@/views/security/sysconfig/searchTable";
import {selectTypeOptions} from "@/views/model/column/searchTable";
import {AttachmentForm, Base64FileParams, getAttachmentByIds, getDownloadUrlById, getUploadUrl, uploadHeader} from "@/api/attachment";
import UploadBase64 from "@/components/upload-base64/index.vue";
import {isJSON} from "@/utils/is";
import {QueryAppForm, QueryAppForm as QuerySelectForm, queryApps as querySelectOptions} from "@/api/security";

const route = useRoute();
const {t} = useI18n();
const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    keyType: [],
    configKey: '',
    valueType: 'VARCHAR',
    configValue: '',
    configAssist: '',
    remark: '',
    enableStatus: 1,
    appId: (route.params && route.params.appId as string) || '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
}
const formData = ref(generateFormData());
const templateFile = ref<FileItem[]>([]);

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      params.keyType = params.keyType ? (params.keyType as string[]).join(",") : '';
      delete params.configAssist;
      const {data} = await createOrUpdateForm(params);
      templateFile.value = [];
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
    const params = {...formData.value};
    params.keyType = params.keyType ? (params.keyType as string[]).join(",") : '';
    const {data} = await validateSysConfigKey(params);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

const selectTypeChange = (value: string) => {
  formData.value.configValue = '';
  formData.value.configAssist = '';
}

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
const setTemplate = (fileName?: string) => {
  formData.value.configValue = templateFile.value.map((item) => {
    return item.uid;
  }).join(",");
}
const beforeRemoveT = async (fileItem: FileItem): Promise<boolean> => {
  try {
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
const uploadError = (fileItem: FileItem) => {
  Notification.error("上传失败，请重试！");
}
const loadFiles = (attachmentIds: string) => {
  if (attachmentIds !== null && attachmentIds !== '') {
    getAttachmentByIds(attachmentIds, (attachs: AttachmentForm[]) => {
      if (attachs != null && attachs.length > 0) {
        attachs.forEach((value, index, array) => {
          if (value.delStatus === 0) {
            const file = {uid: value.id, name: value.name, url: getDownloadUrlById(value.id)};
            templateFile.value.push(file);
          }
        });
      }
    }, () => {
    });
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
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  templateFile.value = [];
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      if (data.keyType) {
        data.keyType = (data.keyType as string).split(",") || [];
      }
      formData.value = data;
      if (['UPLOAD'].includes(formData.value.valueType)) {
        loadFiles(formData.value.configValue);
      } else if (['BASE64'].includes(formData.value.valueType) && isJSON(formData.value.configValue)) {
        const baseData: Base64FileParams = JSON.parse(formData.value.configValue);
        formData.value.configAssist = baseData && baseData.name || '';
      }
      urlParams.loadSuccessBack(formData.value);
    }, urlParams.loadFailBack);
  }
}
const submitModel = (done: any, successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, successBack, failBack);
};

// 将方法暴露出去
defineExpose({loadModel, submitModel});
</script>
<script lang="ts">
export default {
  name: 'SystemConfigModel'
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
</style>