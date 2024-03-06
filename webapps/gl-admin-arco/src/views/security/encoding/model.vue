<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 4 }" :model="formData" :wrapper-col-props="{ span: 20 }" class="form">
    <a-row :gutter="16">
      <a-form-item
          :label="$t('security.encoding.index.form.title')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="title">
        <a-input v-if="pageData.button" v-model.trim="formData.title" :max-length="32"/>
        <span v-else>{{ formData.title }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.encoding.index.form.template')" field="template">
        <a-space>
          <a-dropdown-button>
            {{ $t('security.encoding.index.form.selectItemType') }}
            <template #icon>
              <icon-down/>
            </template>
            <template #content>
              <a-doption
                  v-for="item in modelItemTypeOptions"
                  :key="item.value as string"
                  :disabled="!pageData.button"
                  @click="addTemplate(item.value as string)">
                {{ $t(item.label) }}
              </a-doption>
            </template>
          </a-dropdown-button>
          <a-dropdown-button>
            {{ $t('security.encoding.index.form.separators') }}{{ ` [ ${formData.separators} ]` }}
            <template #icon>
              <icon-down/>
            </template>
            <template #content>
              <a-doption
                  v-for="item in separatorsOptions"
                  :key="item.value as string"
                  :disabled="!pageData.button"
                  @click="sepTemplate(item.value as string)">
                {{ $t(item.label) }}
              </a-doption>
            </template>
          </a-dropdown-button>
        </a-space>
      </a-form-item>
      <a-form-item v-show="isShowTable" :wrapper-col-props="{ span: 20 }">
        <a-table
            :bordered="{cell:true}"
            :data="(templateData as TableData[])"
            :draggable="pageData.button?{ type: 'handle', width: 30 }:{}"
            :pagination="false"
            :show-header="false"
            :stripe="true"
            column-resizable
            row-key="id"
            size="small" @change="handleChange">
          <template #columns>
            <a-table-column v-if="!pageData.button" :ellipsis="true" :title="$t('security.encoding.index.form.seqNo')" :tooltip="true" :width="40"
                            align="center" data-index="seqNo"/>
            <a-table-column :ellipsis="true" :title="$t('security.encoding.index.form.itemType')" :tooltip="true" :width="100" data-index="itemType">
              <template #cell="{record}">
                {{ $t(`security.encoding.index.form.itemType.${record.itemType}`) }}
              </template>
            </a-table-column>
            <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemContent')" :tooltip="true" :width="220" data-index="itemContent">
              <template #cell="{record}">
                <a-input
                    v-if="record.itemType==='constant'&&pageData.button"
                    v-model.trim="record.constantValue"
                    :max-length="32"
                    :placeholder="$t('security.encoding.index.form.itemType.constant.placeholder')"
                    @blur="inputValueBlur($event)"/>
                <span v-if="record.itemType==='constant'&&!pageData.button">{{ record.constantValue }}</span>
                <a-space v-if="record.itemType==='serial'">
                  <a-dropdown-button>
                    {{ `${record.serialDigit} ` }}{{ $t('security.encoding.index.form.itemType.serial.digit') }}
                    <template #icon>
                      <icon-down/>
                    </template>
                    <template #content>
                      <a-doption
                          v-for="item in serialDigitOptions"
                          :key="item"
                          :disabled="!pageData.button"
                          @click="serialDropdownClick(record.id,'serialDigit',item)">
                        {{ `${item} ` }}{{ $t('security.encoding.index.form.itemType.serial.digit') }}
                      </a-doption>
                    </template>
                  </a-dropdown-button>
                  <a-dropdown-button>
                    {{ $t(`security.encoding.index.form.serialType.${record.serialType}`) }}
                    <template #icon>
                      <icon-down/>
                    </template>
                    <template #content>
                      <a-doption
                          v-for="item in serialTypeOptions"
                          :key="item.value as string"
                          :disabled="!pageData.button"
                          @click="serialDropdownClick(record.id,'serialType',item.value as string)">
                        {{ $t(item.label) }}
                      </a-doption>
                    </template>
                  </a-dropdown-button>
                </a-space>
                <a-select v-if="record.itemType==='date'&&pageData.button" v-model="record.dateType" @change="dateTypeChange">
                  <a-option v-for="item of dateTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
                </a-select>
                <span v-if="record.itemType==='date'&&!pageData.button">{{ record.dateType }}</span>
              </template>
            </a-table-column>
            <a-table-column v-if="pageData.button" :title="$t('model.column.index.form.operations')" :width="55" align="center"
                            data-index="operations" fixed="right">
              <template #cell="{record}">
                <a-button status="danger" type="text" @click="deleteItemColumn(record.id)">
                  <template #icon>
                    <IconClose/>
                  </template>
                </a-button>
              </template>
            </a-table-column>
          </template>
          <template #empty></template>
        </a-table>
      </a-form-item>
      <a-form-item
          :label="$t('security.encoding.index.form.example')"
          field="example">
        <span>{{ formData.example }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.encoding.index.form.appId')" field="appId">
        <a-select :disabled="!pageData.button" v-model="formData.appId" :field-names="{value: 'id', label: 'name'}"
                  :options="selectAppOptions" allow-search/>
      </a-form-item>
      <a-form-item
          :label="$t('security.encoding.index.form.enableStatus')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="enableStatus">
        <a-select v-if="pageData.button" v-model="formData.enableStatus">
          <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.encoding.index.form.enableStatus.${formData.enableStatus}`) }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.encoding.index.form.description')" field="description">
        <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
      </a-form-item>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {FormInstance, Modal, Notification} from "@arco-design/web-vue";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateEncoding as createOrUpdateForm, EncodingItem, getEncoding as getForm, QueryEncodingForm as QueryForm} from '@/api/encoding'
import {formatTime, generateRandom} from '@/utils/strings';
import {dateTypeOptions, enableStatusOptions, separatorsOptions, serialTypeOptions} from "@/views/security/encoding/searchTable";
import {TableData} from "@arco-design/web-vue/es/table/interface";
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
import {QueryAppForm, QueryAppForm as QuerySelectForm, queryApps as querySelectOptions} from "@/api/security";

const route = useRoute();
const {t} = useI18n();
const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    title: '',
    separators: '',
    template: '',
    example: '',
    enableStatus: 1,
    description: '',
    appId: (route.params && route.params.appId as string) || '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
}
const formData = ref(generateFormData());

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res && validateTemplate()) {
    try {
      params.template = JSON.stringify(templateData.value);
      const {data} = await createOrUpdateForm(params);
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

/* 模板 */
const templateData = ref<EncodingItem[]>([]);
const isShowTable = computed(() => {
  return templateData.value.length > 0;
});
const serialDigitOptions = ref<number[]>([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
const modelItemTypeOptions = computed<SelectOptionData[]>(() => {
  const options = [{label: 'security.encoding.index.form.itemType.constant', value: 'constant'}];
  const isExist = {date: false, serial: false, business: false};
  if (templateData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of templateData.value) {
      if (item.itemType === 'business') isExist.business = true;
      if (item.itemType === 'date') isExist.date = true;
      if (item.itemType === 'serial') isExist.serial = true;
    }
  }
  // if (!isExist.business) options.push({label: 'security.encoding.index.form.itemType.business', value: 'business'});
  if (!isExist.date) options.push({label: 'security.encoding.index.form.itemType.date', value: 'date'});
  if (!isExist.serial) options.push({label: 'security.encoding.index.form.itemType.serial', value: 'serial'});
  return options;
});
/**
 * 模板项，添加
 * @param type
 */
const addTemplate = (type: string) => {
  if (validateTemplate()) {
    switch (type) {
      case 'constant':
        templateData.value.push({id: generateRandom(), itemType: type, seqNo: templateData.value.length + 1, constantValue: ''} as unknown as EncodingItem);
        break;
      case 'serial':
        templateData.value.push({
          id: generateRandom(),
          itemType: type,
          seqNo: templateData.value.length + 1,
          serialDigit: 4,
          serialType: 'random'
        } as unknown as EncodingItem);
        break;
      case 'date':
        templateData.value.push({id: generateRandom(), itemType: type, seqNo: templateData.value.length + 1, dateType: 'yyyyMMdd'} as unknown as EncodingItem);
        break;
      default:
        break;
    }
    exampleChange();
  }
}
/**
 * 选择分隔符
 * @param value
 */
const sepTemplate = (value: string) => {
  formData.value.separators = value;
  exampleChange();
}
/**
 * 模板项，排序
 * @param _data
 */
const handleChange = (_data: any[]) => {
  templateData.value = _data;
  exampleChange();
}
/**
 * 模板项，删除
 * @param key
 */
const deleteItemColumn = (key: string) => {
  const indexs = [];
  for (let i = 0; i < templateData.value.length; i += 1) {
    if (templateData.value[i].id === key) {
      indexs.push(i);
    }
  }
  for (let i = 0; i < indexs.length; i += 1) {
    templateData.value.splice(indexs[i], 1);
  }
  exampleChange();
}
/**
 * 示例生成
 */
const exampleChange = () => {
  const example = [];
  if (templateData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of templateData.value) {
      const serialDigit = Number(item.serialDigit);
      switch (item.itemType) {
        case 'constant':
          if (item.constantValue)
            example.push(item.constantValue);
          break;
        case 'serial':
          // eslint-disable-next-line no-nested-ternary
          if (serialDigitOptions.value.includes(serialDigit) && item.serialType)
            example.push(item.serialType === 'order' ? '1'.padStart(item.serialDigit, '0') : generateRandom(serialDigit));
          break;
        case 'date':
          if (item.dateType)
            example.push(formatTime(new Date(), item.dateType));
          break;
        default:
          break;
      }
    }
  }
  formData.value.example = example.join(formData.value.separators);
}
/**
 * 固定字段值变更
 * @param ev
 */
const inputValueBlur = (ev?: FocusEvent) => {
  exampleChange();
}
/**
 * 日期类型变更
 */
const dateTypeChange = () => {
  exampleChange();
}
/**
 * 序列号，位数、类型 设置值
 * @param id
 * @param type
 * @param value
 */
const serialDropdownClick = (id: string, type: string, value: number | string) => {
  if (templateData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of templateData.value) {
      if (item.id === id) {
        // @ts-ignore
        item[type] = value;
        exampleChange();
      }
    }
  }
}
/**
 * 模板项，校验
 */
const validateTemplate = () => {
  let isValid = true;
  if (templateData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of templateData.value) {
      if ((item.itemType === 'constant' && item.constantValue) ||
        (item.itemType === 'serial' && serialDigitOptions.value.includes(item.serialDigit) && item.serialType) ||
        (item.itemType === 'date' && item.dateType)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      isValid = false;
      break;
    }
  }
  if (!isValid) {
    Notification.warning(t('security.encoding.index.form.validate.warning'));
  }
  return isValid;
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
  templateData.value = [];
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      formData.value = data;
      templateData.value = data.template ? JSON.parse(data.template) : [];
      urlParams.loadSuccessBack(data);
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
  name: 'EncodingModel'
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