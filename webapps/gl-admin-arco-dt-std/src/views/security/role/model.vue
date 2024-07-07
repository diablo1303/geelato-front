<script lang="ts">
export default {
  name: 'RoleModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal} from "@arco-design/web-vue";
import {getAppSelectOptions} from "@/api/application";
import {
  createOrUpdateRole as createOrUpdateForm,
  getRole as getForm,
  QueryAppForm,
  QueryRoleForm as QueryForm,
  validateRoleCode
} from '@/api/security';
import {enableStatusOptions, typeOptions, usedAppOptions} from "@/views/security/role/searchTable";
import ButtonTooltipIndex from "@/components/button-tooltip/index.vue";
import {autoIncrementOptions} from "@/views/model/column/searchTable";

// 页面所需 参数
type PageParams = {
  type: string; // 角色类型
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
    name: '',
    code: '',
    type: props.parameter.type || '',
    weight: 5,
    enableStatus: 1,
    seqNo: 999,
    description: '',
    usedApp: 0,
    appName: '',
    appIds: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<QueryAppForm[]>([]);
const selectAll = ref<boolean>(false);
const selectData = ref<string[]>([]);

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
      params.appId = ["app"].includes(params.type) ? params.appId : '';
      params.appIds = selectData.value && selectData.value.toString();
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
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const {data} = await validateRoleCode(formData.value);
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

/**
 * 类型变更
 */
const typeChange = () => {
  formData.value.appId = '';
  formData.value.appName = '';
  formData.value.usedApp = 0;
  selectAll.value = false;
  selectData.value = [];
}

const usedAppChange = () => {
  selectAll.value = false;
  selectData.value = [];
}

/**
 * 选择内容与全选联动
 */
const selectChange = () => {
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of appSelectOptions.value) {
    if (!selectData.value.includes(item.id)) {
      isAll = false;
    }
  }
  selectAll.value = isAll;
}
/**
 * 全选与选择项联动
 */
const selectAllChange = () => {
  if (selectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of appSelectOptions.value) {
      if (!selectData.value.includes(item.id)) {
        selectData.value.push(item.id);
      }
    }
  } else {
    selectData.value = [];
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
  // 应用信息
  getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 表单数据重置
  selectAll.value = false;
  selectData.value = [];
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      // 表格数据处理
      data.seqNo = Number(data.seqNo);
      data.usedApp = data.usedApp === true ? 1 : 0;
      formData.value = data;
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
            :label="$t('security.role.index.form.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="formState!=='view'" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.role.index.form.code')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
            field="code">
          <a-input v-if="formState!=='view'" v-model="formData.code" :max-length="32"/>
          <span v-else>{{ formData.code }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.role.index.form.type')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="type">
          <a-select v-if="formState==='add'&&!parameter.type" v-model="formData.type" @change="typeChange">
            <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.role.index.form.type.${formData.type}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col v-if="['app'].includes(formData.type)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.roleApp.index.form.appName')"
                     :rules="[{required: ['app'].includes(formData.type),message: $t('security.form.rules.match.required')}]"
                     field="appId">
          <a-select v-if="formState==='add'" v-model="formData.appId" :field-names="{value: 'id', label: 'name'}"
                    :options="appSelectOptions" allow-search/>
          <span v-else>{{ formData.appName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.role.index.form.weight')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="weight">
          <a-input-number
              v-if="formState!=='view'" v-model="formData.weight" :max="999" :min="0"
              :placeholder="$t('security.form.rules.match.length.title')+'[0,999]'"
              :precision="0" :step="1"/>
          <span v-else>{{ formData.weight }}</span>
          <ButtonTooltipIndex v-if="formData.weight!==5&&formState!=='view'"
                              :content="$t('security.role.index.form.weight.reset.tip')"
                              @click="ev => {formData.weight=5;}">
            <icon-undo/>
          </ButtonTooltipIndex>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.role.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.role.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.role.index.form.seqNo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number
              v-if="formState!=='view'" v-model="formData.seqNo" :max="999999999" :min="1"
              :placeholder="$t('security.form.rules.match.length.title')+'[0,999999999]'"
              :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col v-if="['platform'].includes(formData.type)" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.role.index.form.usedApp')" field="usedApp">
          <a-radio-group v-model="formData.usedApp" :options="usedAppOptions" @change="usedAppChange">
            <template #label="{ data }">{{ $t(`${data.label}`) }}</template>
          </a-radio-group>
          <template #extra>
            {{ $t('security.role.index.form.usedApp.extra') }}
          </template>
        </a-form-item>
      </a-col>
      <a-col v-if="formState==='add'&&['platform'].includes(formData.type)&&formData.usedApp" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.role.index.form.appIds')"
                     :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="appIds">
          <a-select v-model="selectData" :field-names="{value: 'id', label: 'name'}" :options="appSelectOptions"
                    :placeholder="$t('security.role.index.form.appIds.placeholder')"
                    multiple allow-clear allow-search @change="selectChange">
            <template #header>
              <div class="check-all">
                <a-checkbox v-model="selectAll" class="check-all-radio" @change="selectAllChange">
                  <span class="check-all-span">全选</span>
                </a-checkbox>
              </div>
            </template>
          </a-select>
          <template #extra>
            {{ $t('security.role.index.form.appIds.extra') }}
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.role.index.form.description')" :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }" field="description">
          <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
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
}

.select-button {
  height: 31.6px;
  padding: 0 8px;
  font-weight: bold;
}

.button-success {
  color: rgb(var(--success-6));
}

.button-primary {
  color: rgb(var(--primary-6));
}

.check-all {
  padding: 6px 12px;

  &-radio {
    width: 100%
  }

  &-span {
    font-weight: 600;
    color: rgb(var(--primary-6));
  }
}
</style>