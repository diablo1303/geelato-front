<script lang="ts">
export default {
  name: 'FileTemplateModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FileItem, FormInstance, Message, Modal} from "@arco-design/web-vue";
import {createOrUpdateFileTemplate as createOrUpdateForm, getFileTemplate as getForm, QueryFileTemplateForm as QueryForm} from '@/api/template'
import {enableStatusOptions, useTypeOptions,} from "@/views/security/file/searchTable";
import {AttachmentForm, Base64FileParams, fetchFileToBase64, getAttachmentByIds} from "@/api/attachment";
import UploadBase64 from "@/components/upload-base64/index.vue";
import {isJSON} from "@/utils/is";
import ImportBusinessType from "@/views/security/file/import/type.vue";
import ImportBusinessRule from "@/views/security/file/import/rule.vue";
import ImportBusinessMeta from "@/views/security/file/import/meta.vue";
import ExportBusinessMeta from "@/views/security/file/export/meta.vue";
import {getAppSelectOptions, QueryAppForm} from "@/api/application";
import cloneDeep from "lodash/cloneDeep";

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
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
});


const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: props.modelValue || '',
    title: '',
    useType: '',
    fileType: '',
    fileCode: '',
    fileCodeFormat: [],
    template: '',
    templateRule: '',
    enableStatus: 1,
    description: '',
    businessTypeData: [],
    businessMetaData: [],
    businessRuleData: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());

const templateFile = ref<FileItem[]>([]);
const templateRuleFile = ref<FileItem[]>([]);
const appSelectOptions = ref<QueryAppForm[]>([]);

const tabsKey = ref<number>(1);// 定位tabs页面
const importParameter = ref({
  appId: props.parameter?.appId || '',
  tenantCode: props.parameter?.tenantCode || '',
});

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const record = cloneDeep(params);
      record.fileCode = record.fileCodeFormat ? record.fileCodeFormat.join(",") : '';
      record.fileType = record.useType === 'import' ? 'excel' : record.fileType;
      record.businessTypeData = record.businessTypeData && record.businessTypeData.length > 0 ? JSON.stringify(record.businessTypeData) : '';
      record.businessRuleData = record.businessRuleData && record.businessRuleData.length > 0 ? JSON.stringify(record.businessRuleData) : '';
      record.businessMetaData = record.businessMetaData && record.businessMetaData.length > 0 ? JSON.stringify(record.businessMetaData) : '';
      delete record.fileCodeFormat;
      const {data} = await createOrUpdateForm(record);
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
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getForm(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

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
  Message.error("上传失败，请重试！");
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
    Message.success("删除成功");
    deleteFileItem(templateFile.value, fileItem.uid);
    setTemplate('');
    return true;
  } catch (err) {
    return false;
  }
}
const uploadTSuccess = (fileItem: FileItem) => {
  Message.success("上传成功");
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
    Message.success("删除成功");
    deleteFileItem(templateRuleFile.value, fileItem.uid);
    setTemplateRule();
    return true;
  } catch (err) {
    return false;
  }
}
const uploadTRSuccess = (fileItem: FileItem) => {
  Message.success("上传成功");
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

const appSelectChange = () => {
  Object.assign(importParameter.value, {appId: formData.value.appId || ''});
}

/**
 * 页面数据创建或更新方法，对外提供
 * @param successBack
 * @param failBack
 */
const saveOrUpdate = (successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, (data: QueryForm) => {
    // 设计当前页面的操作
    if (successBack && typeof successBack === 'function') successBack(data);
  }, () => {
    if (failBack && typeof failBack === 'function') failBack();
  });
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  // 应用信息
  getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 其他初始化
  tabsKey.value = 1;
  templateFile.value = [];
  templateRuleFile.value = [];
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      // 表格数据处理
      data.fileCodeFormat = data.fileCode ? data.fileCode.split(",") : [];
      // loadFiles(data.template, 't');
      // loadFiles(data.templateRule, 'tr');
      data.businessTypeData = data.businessTypeData && typeof data.businessTypeData === 'string' ? JSON.parse(data.businessTypeData) : [];
      data.businessRuleData = data.businessRuleData && typeof data.businessRuleData === 'string' ? JSON.parse(data.businessRuleData) : [];
      data.businessMetaData = data.businessMetaData && typeof data.businessMetaData === 'string' ? JSON.parse(data.businessMetaData) : [];

      formData.value = data;
      Object.assign(importParameter.value, {
        appId: formData.value.appId || '', tenantCode: formData.value.tenantCode || ''
      });
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
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="{height: `${height}px`}" position="left" type="line">
    <a-tab-pane :key="1" class="a-tabs-one" title="基础信息">
      <a-card class="">
        <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
          <a-row :gutter="wrapperCol">
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item
                  :label="$t('security.file.index.form.title')"
                  :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
                  field="title">
                <a-input v-if="formState!=='view'" v-model.trim="formData.title" :max-length="32"/>
                <span v-else>{{ formData.title }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item
                  :label="$t('security.file.index.form.useType')"
                  :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
                  field="useType">
                <a-select v-if="formState!=='view'" v-model="formData.useType">
                  <a-option v-for="item of useTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
                </a-select>
                <span v-else>{{ $t(`security.file.index.form.useType.${formData.useType}`) }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item
                  :label="$t('security.file.index.form.fileCode')"
                  :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                  field="fileCodeFormat">
                <a-input-tag v-if="formState!=='view'" v-model="formData.fileCodeFormat" :placeholder="$t('security.file.index.form.fileCode.placeholder')"
                             :unique-value="true"
                             allow-clear/>
                <a-space v-else :style="{'flex-wrap':'wrap'}">
                  <a-tag v-for="(item, index) of formData.fileCodeFormat" :key="index" :style="{'margin-bottom':'4px'}">{{ item }}</a-tag>
                </a-space>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item
                  :label="$t('security.file.index.form.fileType')"
                  :rules="[{required: !['import'].includes(formData.useType),message: $t('security.form.rules.match.required')}]"
                  field="fileType">
                <span>{{
                    formData.fileType ? $t(`security.file.index.form.fileType.${formData.fileType}`) : $t('security.file.index.form.fileType.placeholder')
                  }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)">
              <a-form-item
                  :label-col-props="{ span: labelCol/formCol }"
                  :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                  :label="$t('security.file.index.form.template')"
                  :rules="[{required: !['import'].includes(formData.useType),message: $t('security.form.rules.match.required')}]"
                  field="template">
                <UploadBase64 v-model="formData.template"
                              :accept="formData.useType==='import'?'.xls,.xlsx':'.doc,.docx,.xls,.xlsx'"
                              :disabled="formState==='view'" @change="configValueBase64"/>
                <template #help>
                  <p v-if="['import'].includes(formData.useType)">来源：1，手动上传文件；2，数据配置填写保存后，点击列表按钮【生成-模板文件】生成文件。</p>
                  <p v-if="['import'].includes(formData.useType)">优先级：优先使用文件，其次若没有文件则使用模板字段定义信息。</p>
                </template>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)">
              <a-form-item
                  :label-col-props="{ span: labelCol/formCol }"
                  :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                  :label="$t('security.file.index.form.templateRule')"
                  :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
                  field="templateRule">
                <UploadBase64 v-model="formData.templateRule" :disabled="formState==='view'" accept=".xls,.xlsx"/>
                <template #help>
                  <p>来源：1，手动上传文件；2，数据配置填写保存后，点击列表按钮【生成-元数据文件】生成文件。</p>
                  <p>优先级：优先使用文件，其次若没有文件则使用数据配置信息。</p>
                </template>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item :label="$t('security.file.index.form.appId')" field="appId">
                <a-select v-model="formData.appId" :disabled="formState==='view'" :field-names="{value: 'id', label: 'name'}"
                          :options="appSelectOptions" allow-search @change="appSelectChange"/>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)/formCol">
              <a-form-item
                  :label="$t('security.file.index.form.enableStatus')"
                  :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
                  field="enableStatus">
                <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
                  <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
                </a-select>
                <span v-else>{{ $t(`security.file.index.form.enableStatus.${formData.enableStatus}`) }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="(labelCol+wrapperCol)">
              <a-form-item :label="$t('security.file.index.form.description')" :label-col-props="{ span: labelCol/formCol }"
                           :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }" field="description">
                <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
                <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-tab-pane>
    <a-tab-pane v-if="['import'].includes(formData.useType)" :key="2" class="a-tabs-one" title="模板字段定义">
      <ImportBusinessType v-model="formData.businessTypeData" :disabled="formState==='view'" :height="height"/>
    </a-tab-pane>
    <a-tab-pane v-if="['export'].includes(formData.useType)" :key="2" class="a-tabs-one" title="数据配置">
      <ExportBusinessMeta v-model="formData.businessMetaData" :disabled="formState==='view'" :height="height"/>
    </a-tab-pane>
    <a-tab-pane v-if="['import'].includes(formData.useType)" :key="3" class="a-tabs-two" title="数据处理规则">
      <ImportBusinessRule v-model="formData.businessRuleData" :business-type-data="formData.businessTypeData as any[]"
                          :parameter="importParameter" :disabled="formState==='view'" :height="height"/>
    </a-tab-pane>
    <a-tab-pane v-if="['import'].includes(formData.useType)" :key="4" class="a-tabs-two" title="数据保存配置">
      <ImportBusinessMeta v-model="formData.businessMetaData" :business-type-data="formData.businessTypeData as any[]"
                          :parameter="importParameter" :disabled="formState==='view'" :height="height"/>
    </a-tab-pane>
  </a-tabs>
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

.arco-collapse-item-active > .arco-collapse-item-header {
  background-color: #FFFFFF !important;
}
</style>