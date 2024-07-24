<script lang="ts">
export default {
  name: 'SystemConfigModel'
};
</script>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {Message, Modal} from "@arco-design/web-vue";
import type {FileItem, FormInstance} from "@arco-design/web-vue";
import {authUtil, isUtil, sysConfigApi, fileApi, applicationApi, securityApi} from '@geelato/gl-ui'
import type {QuerySysConfigForm, AttachmentForm, Base64FileParams, UploadFileParams, QueryAppForm} from '@geelato/gl-ui';
import {enableStatusOptions, purposeOptions, valueTypeOptions} from "./searchTable";
import UploadBase64 from "../../../components/upload-base64/index.vue";
import AccountValid from "../../../components/account/components/account-valid.vue";

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  visible: {type: Boolean, default: false},// 显示
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
});

const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
const uploadParams = ref<UploadFileParams>({
  tableType: 'resources',// 类型
  isRename: true,// 文件重命名，默认：true
  genre: 'sysConfig',// 类型
  objectId: '',// 文件所属对象id
  appId: props.parameter?.appId || '',// 所属应用
  tenantCode: props.parameter?.tenantCode || '',// 所属租户
});// 上传参数
/* 表单 */
const generateFormData = (): QuerySysConfigForm => {
  return {
    id: props.modelValue || '',
    keyType: [],
    configKey: '',
    valueType: 'string',
    configValue: '',
    configAssist: '',
    remark: '',
    purpose: '',
    enableStatus: 1,
    encrypted: 0,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const templateFile = ref<FileItem[]>([]);
const appSelectOptions = ref<QueryAppForm[]>([]);

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QuerySysConfigForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      params.keyType = params.keyType ? (params.keyType as string[]).join(",") : '';
      delete params.configAssist;
      const {data} = await sysConfigApi.createOrUpdateSysConfig(params);
      templateFile.value = [];
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else if (failBack && typeof failBack === 'function') failBack();
};
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, encrypt?: boolean, successBack?: any, failBack?: any) => {
  try {
    const {data} = await sysConfigApi.getSysConfig(id, encrypt);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
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
    const {data} = await sysConfigApi.validateSysConfigKey(params);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
/**
 * 文本域查看
 * @param content
 */
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
/**
 * 重置验证信息
 */
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

const visibleData = ref(false);
const editEncrypt = ref(false);
const getEncryptValue = () => {
  getData(props.modelValue, true, (data: QuerySysConfigForm) => {
    editEncrypt.value = true;
    if (props.formState === 'view') {
      openModal(data.configValue as string);
    } else {
      formData.value.configValue = data.configValue;
    }
  }, () => {
    editEncrypt.value = true;
  });
}
const editEncryptValue = () => {
  if (authUtil.isValidUser()) {
    getEncryptValue();
  } else {
    visibleData.value = true;
  }
}

const selectTypeChange = (value: string) => {
  formData.value.configValue = '';
  formData.value.configAssist = '';
  if (['boolean'].includes(formData.value.valueType)) formData.value.configValue = false;
  if (['number'].includes(formData.value.valueType)) formData.value.configValue = 0;
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
    deleteFileItem(templateFile.value, fileItem.uid);
    setTemplate('');
    Message.success("删除成功");
    return true;
  } catch (err) {
    return false;
  }
}
const uploadTSuccess = (fileItem: FileItem) => {
  fileItem.uid = fileItem.response.data.id;
  templateFile.value.push(fileItem);
  setTemplate(fileItem.name);
  Message.success("上传成功");
}
const uploadError = (fileItem: FileItem) => {
  Message.error("上传失败，请重试！");
}
const loadFiles = (attachmentIds: string) => {
  if (attachmentIds !== null && attachmentIds !== '') {
    fileApi.getAttachmentByIds(attachmentIds, (attachs: AttachmentForm[]) => {
      if (attachs != null && attachs.length > 0) {
        attachs.forEach((value, index, array) => {
          if (value.delStatus === 0) {
            const file = {uid: value.id, name: value.name, url: fileApi.getDownloadUrlById(value.id, false, true)};
            templateFile.value.push(file);
          }
        });
      }
    }, () => {
    });
  }
}

/**
 * 页面数据创建或更新方法，对外提供
 * @param successBack
 * @param failBack
 */
const saveOrUpdate = (successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, (data: QuerySysConfigForm) => {
    // 设计当前页面的操作
    if (successBack && typeof successBack === 'function') successBack(data);
  }, () => {
    if (failBack && typeof failBack === 'function') failBack();
  });
}

const appSelectChange = () => {
  uploadParams.value.appId = formData.value.appId || '';
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  visibleData.value = false;
  editEncrypt.value = false;
  // 应用信息
  applicationApi.getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 表单数据重置
  formData.value = generateFormData();
  Object.assign(uploadParams.value, {
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  });
  // 重置验证
  resetValidate();
  // 其他初始化
  templateFile.value = [];
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, false, (data: QuerySysConfigForm) => {
      // 表格数据处理
      data.encrypted = data.encrypted === true ? 1 : 0;
      if (data.keyType) {
        data.keyType = (data.keyType as string).split(",") || [];
      }
      formData.value = data;
      Object.assign(uploadParams.value, {
        objectId: "",
        appId: formData.value.appId || '', tenantCode: formData.value.tenantCode || ''
      });
      if (['upload'].includes(formData.value.valueType)) {
        loadFiles(formData.value.configValue as string);
      } else if (['base64'].includes(formData.value.valueType) && isUtil.isJSON(formData.value.configValue as string)) {
        const baseData: Base64FileParams = JSON.parse(formData.value.configValue as string);
        formData.value.configAssist = baseData && baseData.name || '';
      } else if (['number'].includes(formData.value.valueType)) {
        formData.value.configValue = Number(formData.value.configValue);
      } else if (['boolean'].includes(formData.value.valueType)) {
        formData.value.configValue = formData.value.configValue === 'true';
      }
    });
  }
}

watch(() => props, () => {
  if (props.visible === true) loadPage();
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({saveOrUpdate, loadPage});
</script>

<template>
  <AccountValid v-model="visibleData" @validEvent="getEncryptValue"/>
  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.sysConfig.index.form.keyType')" field="keyType">
          <a-input-tag v-if="formState!=='view'" v-model="formData.keyType as string[]"
                       :placeholder="$t('security.file.index.form.fileCode.placeholder')"
                       :unique-value="true" allow-clear/>
          <a-space v-else :style="{'flex-wrap':'wrap'}">
            <a-tag v-for="(item, index) of formData.keyType" :key="index" :style="{'margin-bottom':'4px'}">{{ item }}</a-tag>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.sysConfig.index.form.configKey')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
            field="configKey">
          <a-input v-if="formState!=='view'" v-model.trim="formData.configKey" :max-length="100"/>
          <span v-else>{{ formData.configKey }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.sysConfig.index.form.appId')" field="appId">
          <a-select v-model="formData.appId" :disabled="formState==='view'" :field-names="{value: 'id', label: 'name'}"
                    :options="appSelectOptions" allow-search @change="appSelectChange"/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.sysConfig.index.form.purpose')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="purpose">
          <a-select v-if="formState!=='view'" v-model="formData.purpose">
            <a-option v-for="item of purposeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ formData.purpose ? $t(`security.sysConfig.index.form.purpose.${formData.purpose}`) : '' }}</span>
          <template #help>
            {{ $t('security.sysConfig.index.form.purpose.help') }}
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.sysConfig.index.form.valueType')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="valueType">
          <a-select v-model="formData.valueType" :disabled="formState==='view'" allow-search @change="selectTypeChange(formData.valueType)">
            <a-option v-for="(item,index) of valueTypeOptions" :key="index" :value="item.value" :label="$t(`${item.label}`)"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col v-if="['upload'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <a-upload :action="fileApi.getUploadUrl(uploadParams)"
                    :file-list="templateFile"
                    :headers="fileApi.uploadHeader()"
                    :limit="1"
                    :show-remove-button="formState!=='view'"
                    list-type="text"
                    @error="uploadError" @success="uploadTSuccess" @before-remove="beforeRemoveT"/>
        </a-form-item>
      </a-col>
      <a-col v-else-if="['base64'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <UploadBase64 v-model="formData.configValue as string" :disabled="formState==='view'"/>
        </a-form-item>
      </a-col>
      <a-col v-else-if="['encrypt'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <template #label>
            {{ $t('security.sysConfig.index.form.configValue') }}
            <a-tooltip :content="$t('security.sysConfig.index.form.configValue.encrypt.edit')">
              <icon-edit v-if="formState==='edit'&&!editEncrypt&&formData.configValue" style="color: rgb(var(--primary-6));cursor: pointer;"
                         @click.stop="editEncryptValue"/>
            </a-tooltip>
            <a-tooltip :content="$t('security.sysConfig.index.form.configValue.encrypt.view')">
              <icon-eye v-if="formState==='view'" :size="16" style="color: rgb(var(--primary-6));cursor: pointer;" @click.stop="editEncryptValue"/>
            </a-tooltip>
          </template>
          <a-textarea v-if="formState==='add'||((editEncrypt || !formData.configValue)&&formState==='edit')" v-model="formData.configValue as string"
                      :auto-size="{minRows:1,maxRows:4}" :max-length="4000" allow-clear show-word-limit/>
          <span v-else :title="formData.configValue as string" class="textarea-span">{{ formData.configValue }}</span>
        </a-form-item>
      </a-col>
      <a-col v-else-if="['json'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <a-textarea v-if="formState!=='view'" v-model="formData.configValue as string" :auto-size="{minRows:4,maxRows:6}" :max-length="4000" allow-clear
                      show-word-limit/>
          <span v-else :title="formData.configValue as string" class="textarea-span" @click="openModal(`${formData.configValue}`)">
            {{ formData.configValue }}
          </span>
        </a-form-item>
      </a-col>
      <a-col v-else-if="['datetime'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <a-date-picker v-if="formState!=='view'" v-model="formData.configValue as string" showTime allow-clear/>
          <span v-else>{{ formData.configValue }}</span>
        </a-form-item>
      </a-col>
      <a-col v-else-if="['boolean'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <a-switch :disabled="formState==='view'" type="round" v-model="formData.configValue as boolean">
            <template #checked>
              ON
            </template>
            <template #unchecked>
              OFF
            </template>
          </a-switch>
        </a-form-item>
      </a-col>
      <a-col v-else-if="['number'].includes(formData.valueType)" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <a-input-number v-if="formState!=='view'" v-model="formData.configValue as number" allow-clear/>
          <span v-else>{{ formData.configValue }}</span>
        </a-form-item>
      </a-col>
      <a-col v-else :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.configValue')" :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="configValue">
          <a-textarea v-if="formState!=='view'" v-model="formData.configValue as string" :auto-size="{minRows:1,maxRows:4}" :max-length="4000" allow-clear
                      show-word-limit/>
          <span v-else :title="formData.configValue as string" class="textarea-span" @click="openModal(`${formData.configValue}`)">{{ formData.configValue }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.sysConfig.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.sysConfig.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.sysConfig.index.form.remark')" :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }" field="remark">
          <a-textarea v-if="formState!=='view'" v-model="formData.remark" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.remark" class="textarea-span" @click="openModal(`${formData.remark}`)">{{ formData.remark }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
}
</style>