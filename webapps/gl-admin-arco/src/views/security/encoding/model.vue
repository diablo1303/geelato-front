<script lang="ts">
export default {
  name: 'EncodingModel'
};
</script>
<script lang="ts" setup>
import {ref, watch, computed} from "vue";
import {useI18n} from 'vue-i18n';
import cloneDeep from "lodash/cloneDeep";
import {FormInstance, Modal, TableData, SelectOptionData} from "@arco-design/web-vue";
import type {CascaderOption} from "@arco-design/web-vue";
import {formatTime, generateRandom} from '@/utils/strings';
import {QueryAppForm, getAppSelectOptions} from "@/api/application";
import {createOrUpdateEncoding as createOrUpdateForm, EncodingItem, getEncoding as getForm, QueryEncodingForm as QueryForm} from '@/api/encoding'
import {dateTypeOptions, enableStatusOptions, separatorsOptions, serialTypeOptions, variableTypeOptions} from "@/views/security/encoding/searchTable";

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
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: props.modelValue || '',
    title: '',
    separators: '',
    template: '',
    example: '',
    enableStatus: 1,
    description: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<QueryAppForm[]>([]);
const argumentReg = /^[a-zA-Z][a-zA-Z0-9_]+$/;
const variableOptions = ref<CascaderOption[]>([]);

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res && validateTemplate()) {
    try {
      params.template = JSON.stringify(templateData.value);
      const {data} = await createOrUpdateForm(params);
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


/* 模板 */
const templateData = ref<EncodingItem[]>([]);
const isShowTable = computed(() => {
  return templateData.value.length > 0;
});
const serialDigitOptions = ref<number[]>([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
const modelItemTypeOptions = computed<SelectOptionData[]>(() => {
  const options = [
    {label: 'security.encoding.index.form.itemType.constant', value: 'constant'},
    {label: 'security.encoding.index.form.itemType.variable', value: 'variable'},
    {label: 'security.encoding.index.form.itemType.argument', value: 'argument'},
  ];
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
  switch (type) {
    case 'constant':
      templateData.value.push({id: generateRandom(), itemType: type, seqNo: templateData.value.length + 1, constantValue: ''} as unknown as EncodingItem);
      break;
    case 'variable':
      templateData.value.push({id: generateRandom(), itemType: type, seqNo: templateData.value.length + 1, constantValue: ''} as unknown as EncodingItem);
      break;
    case 'argument':
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
        case 'variable':
          if (item.constantValue)
            example.push(`[${item.constantValue}]`);
          break;
        case 'argument':
          if (item.constantValue)
            example.push(`{${item.constantValue}}`);
          break;
        case 'serial':
          // eslint-disable-next-line no-nested-ternary
          if (serialDigitOptions.value.includes(serialDigit) && item.serialType) {
            if (item.serialType === 'order') {
              if (item.coverPos === false) {
                example.push(1);
              } else {
                example.push('1'.padStart(item.serialDigit, '0'));
              }
            } else {
              example.push(generateRandom(serialDigit));
            }
          }
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
 * @param record
 */
const constantInputValueBlur = (record: EncodingItem) => {
  record.validate = !!record.constantValue;
  record.errorMsg = record.validate === false ? t('security.encoding.index.form.validate.warning') : '';
  exampleChange();
}
/**
 * 系统变量变更
 * @param record
 */
const variableTypeChange = (record: EncodingItem) => {
  record.validate = !!record.constantValue;
  record.errorMsg = record.validate === false ? t('security.encoding.index.form.validate.warning') : '';
  exampleChange();
}
/**
 *
 * @param record
 */
const argumentInputValueBlur = (record: EncodingItem) => {
  record.validate = !!record.constantValue;
  record.errorMsg = record.validate === false ? t('security.encoding.index.form.validate.warning') : '';
  if (record.validate !== false) {
    record.validate = (!(record.constantValue && !argumentReg.test(record.constantValue)));
    record.errorMsg = record.validate === false ? t('security.encoding.index.form.itemType.argument.placeholder') : '';
  }
  exampleChange();
}
const coverPosCheckBoxChange = (record: EncodingItem) => {
  exampleChange();
}
/**
 * 日期类型变更
 */
const dateTypeChange = (record: EncodingItem) => {
  record.validate = !!record.dateType;
  record.errorMsg = record.validate === false ? t('security.encoding.index.form.validate.warning') : '';
  exampleChange();
}
/**
 * 系统变量展示
 * @param options
 */
const formatCascader = (options: CascaderOption[]) => {
  const labels = options.map(option => t(`${option.label}`))
  return labels.join(' / ')
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
        item.coverPos = true;
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
      item.validate = true;
      // 校验规则
      if (item.itemType === 'argument' && item.constantValue && !argumentReg.test(item.constantValue)) {
        isValid = false;
        item.validate = false;
        item.errorMsg = item.validate === false ? t('security.encoding.index.form.itemType.argument.placeholder') : '';
      }
      if (['constant', 'variable', 'argument'].includes(item.itemType) && !item.constantValue) {
        isValid = false;
        item.validate = false;
        item.errorMsg = item.validate === false ? t('security.encoding.index.form.validate.warning') : '';
      }
      if (item.itemType === 'serial' && (!serialDigitOptions.value.includes(item.serialDigit) || !item.serialType)) {
        isValid = false;
        item.validate = false;
        item.errorMsg = item.validate === false ? t('security.encoding.index.form.validate.warning') : '';
      }
      if (item.itemType === 'date' && !item.dateType) {
        isValid = false;
        item.validate = false;
        item.errorMsg = item.validate === false ? t('security.encoding.index.form.validate.warning') : '';
      }
    }
  }

  return isValid;
}

const formatVariableTypeOptions = (options: CascaderOption[]) => {
  if (options && options.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of options) {
      item.label = t(`${item.label}`);
      formatVariableTypeOptions(item.children || []);
    }
  }
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
  variableOptions.value = cloneDeep(variableTypeOptions.value);
  formatVariableTypeOptions(variableOptions.value);
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
  templateData.value = [];
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      // 表格数据处理
      formData.value = data;
      templateData.value = data.template ? JSON.parse(data.template) : [];
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
  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.encoding.index.form.title')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="title">
          <a-input v-if="formState!=='view'" v-model.trim="formData.title" :max-length="32"/>
          <span v-else>{{ formData.title }}</span>
        </a-form-item>
      </a-col>
      <a-col v-show="formState!=='view'" :span="(labelCol+wrapperCol)/formCol">
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
                    :disabled="formState==='view'"
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
                    :disabled="formState==='view'"
                    @click="sepTemplate(item.value as string)">
                  {{ $t(item.label) }}
                </a-doption>
              </template>
            </a-dropdown-button>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col v-show="isShowTable" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.encoding.index.form.rule')" :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }">
          <a-table
              :bordered="{cell:true}"
              :data="(templateData as TableData[])"
              :draggable="formState!=='view'?{ type: 'handle', width: 30 }:{}"
              :pagination="false"
              :scrollbar="false"
              :show-header="false"
              :stripe="true"
              column-resizable
              row-key="id"
              size="small" @change="handleChange">
            <template #columns>
              <a-table-column v-if="formState==='view'" :ellipsis="true" :title="$t('security.encoding.index.form.seqNo')" :tooltip="true" :width="30"
                              align="center" data-index="seqNo"/>
              <a-table-column :ellipsis="true" :title="$t('security.encoding.index.form.itemType')" :tooltip="true" :width="60" data-index="itemType">
                <template #cell="{record}">
                  {{ $t(`security.encoding.index.form.itemType.${record.itemType}`) }}
                </template>
              </a-table-column>
              <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemContent')" :tooltip="true" :width="240" data-index="itemContent">
                <template #cell="{record}">
                  <!--        固定字符          -->
                  <a-input
                      v-if="record.itemType==='constant'&&formState!=='view'"
                      v-model.trim="record.constantValue"
                      :error="record.validate===false"
                      :max-length="32" :placeholder="$t('security.encoding.index.form.itemType.constant.placeholder')"
                      allow-clear
                      @blur="constantInputValueBlur(record)"/>
                  <span v-if="record.itemType==='constant'&&formState==='view'">{{ record.constantValue }}</span>
                  <!--        系统变量          -->
                  <a-cascader v-if="record.itemType==='variable'&&formState!=='view'" v-model="record.constantValue"
                              :error="record.validate===false" :format-label="formatCascader" :options="variableOptions"
                              :placeholder="$t('security.encoding.index.form.itemType.variable.placeholder')"
                              allow-clear allow-search expand-trigger="hover" @change="variableTypeChange(record)"/>
                  <span v-if="record.itemType==='variable'&&formState==='view'">{{ record.constantValue }}</span>
                  <!--        传递参数          -->
                  <a-input
                      v-if="record.itemType==='argument'&&formState!=='view'"
                      v-model.trim="record.constantValue"
                      :error="record.validate===false"
                      :max-length="32" :placeholder="$t('security.encoding.index.form.itemType.argument.placeholder')"
                      allow-clear
                      @blur="argumentInputValueBlur(record)"/>
                  <span v-if="record.itemType==='argument'&&formState==='view'">{{ record.constantValue }}</span>
                  <!--        序列号（唯一）          -->
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
                            :disabled="formState==='view'"
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
                            :disabled="formState==='view'"
                            @click="serialDropdownClick(record.id,'serialType',item.value as string)">
                          {{ $t(item.label) }}
                        </a-doption>
                      </template>
                    </a-dropdown-button>
                    <a-checkbox v-if="record.serialType==='order'" v-model="record.coverPos" :disabled="formState==='view'"
                                @change="coverPosCheckBoxChange(record)">
                      {{ $t(`security.encoding.index.form.coverPos`) }}
                    </a-checkbox>
                  </a-space>
                  <!--        日期          -->
                  <a-select v-if="record.itemType==='date'&&formState!=='view'" v-model="record.dateType"
                            :error="record.validate===false" @change="dateTypeChange(record)">
                    <a-option v-for="(item,index) of dateTypeOptions" :key="index" :label="$t(`${item.label}`)" :value="item.value"/>
                  </a-select>
                  <span v-if="record.itemType==='date'&&formState==='view'">{{ record.dateType }}</span>
                  <div v-if="record.validate===false" style="min-height: 20px;color: rgb(var(--danger-6));font-size: 12px;line-height: 20px;">
                    {{ record.errorMsg }}
                  </div>
                </template>
              </a-table-column>
              <a-table-column v-if="formState!=='view'" :title="$t('model.column.index.form.operations')" :width="30" align="center"
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
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.encoding.index.form.example')" :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }" field="example">
          <span style="color: rgb(var(--primary-6));">{{ formData.example }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.encoding.index.form.appId')" field="appId">
          <a-select v-model="formData.appId" :disabled="formState==='view'" :field-names="{value: 'id', label: 'name'}"
                    :options="appSelectOptions" allow-search/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.encoding.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.encoding.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.encoding.index.form.description')" :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }" field="description">
          <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
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