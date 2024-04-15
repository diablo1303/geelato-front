<script lang="ts">
export default {
  name: 'ApplicationModel'
};
</script>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from 'vue-i18n';
import {FileItem, FormInstance, Modal} from "@arco-design/web-vue";
import {iconsJson} from "@geelato/gl-ui";
import {createOrUpdateApp as createOrUpdateForm, getApp as getForm, QueryAppForm as QueryForm, validateAppCode} from '@/api/application'
import {getRoleSelectOptions, QueryRoleForm} from "@/api/security";
import UploadImageBase64 from '@/components/upload-base64/image.vue';
import {statusOptions, watermarkOptions} from "./searchTable";

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
const route = useRoute();// 路由
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
const visible = ref(false);
const searchText = ref('');
const logoFile = ref<FileItem[]>([]);
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: props.modelValue || '',
    name: '',// 应用名称
    code: '',// 应用编码
    icon: '',// 图标
    appKey: '',
    token: '',
    tree: '',
    logo: '',// 标识
    theme: '',
    watermark: 0,// 应用水印
    href: '',// 首页链接
    dependAppCode: '',
    powerInfo: '',
    versionInfo: '',
    description: '',// 描述
    seqNo: 999,
    applyStatus: 1,
    designStatus: 1,
    roles: '',
    tenantCode: props.parameter?.tenantCode || ''
  };
}
const formData = ref(generateFormData());
const roleSelectOptions = ref<QueryRoleForm[]>([]);
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
      params.roles = selectData.value && selectData.value.toString();
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
    const {data} = await validateAppCode(formData.value);
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


const glIconItems = computed(() => {
  const text = searchText.value.trim()
  if (!text) {
    return iconsJson.glyphs
  }
  return iconsJson.glyphs.filter((glyph: any) => {
    return (iconsJson.css_prefix_text + glyph.font_class).indexOf(text) !== -1
  })
})
const onSelected = (iconItem: any) => {
  formData.value.icon = iconsJson.css_prefix_text + iconItem.font_class;
  visible.value = false
}
const showIconSelect = (ev: Event) => {
  visible.value = true
}
const deleteIconClick = (ev?: MouseEvent) => {
  formData.value.icon = ''
}

/**
 * 选择内容与全选联动
 */
const selectChange = () => {
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of roleSelectOptions.value) {
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
    for (const item of roleSelectOptions.value) {
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
    logoFile.value = [];
    if (successBack && typeof successBack === 'function') successBack(data);
  }, () => {
    if (failBack && typeof failBack === 'function') failBack();
  });
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  if (['add'].includes(props.formState)) {
    getRoleSelectOptions({type: 'platform', tenantCode: props.parameter?.tenantCode || ''},
        (data: QueryRoleForm[]) => {
          roleSelectOptions.value = data;
        }, () => {
          roleSelectOptions.value = [];
        });
  }
  selectData.value = [];
  selectAll.value = false;
  logoFile.value = [];
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      data.seqNo = Number(data.seqNo);
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
            :label="$t('application.app.list.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="formState!=='view'" v-model.trim="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.code')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
            field="code">
          <a-input v-if="formState!=='view'" v-model.trim="formData.code" :max-length="32"/>
          <span v-else>{{ formData.code }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.icon')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="icon">
          <a-input v-if="formState!=='view'" v-model="formData.icon" :max-length="32" class="input-icon" readonly>
            <template #prefix>
              <GlIconfont :type="formData.icon"/>
            </template>
            <template #append>
              <a-button class="input-button input-button-primary" type="dashed" @click="showIconSelect($event)">
                <IconPlus/>
              </a-button>
              <a-button class="input-button input-button-close" type="dashed" @click="deleteIconClick($event)">
                <IconClose/>
              </a-button>
            </template>
          </a-input>
          <span v-else><GlIconfont :type="formData.icon"/> {{ formData.icon }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.logo')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
            field="logo">
          <UploadImageBase64 v-model="formData.logo" :disabled="formState==='view'" image-name="logo"/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.applyStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="applyStatus">
          <a-select v-if="formState!=='view'" v-model="formData.applyStatus">
            <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`application.app.list.status.${formData.applyStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.designStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="designStatus">
          <a-select v-if="formState!=='view'" v-model="formData.designStatus">
            <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`application.app.list.status.${formData.designStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.watermark')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="watermark">
          <a-select v-if="formState!=='view'" v-model="formData.watermark">
            <a-option v-for="item of watermarkOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`application.app.list.watermark.${formData.watermark}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('application.app.list.seqNo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number v-if="formState!=='view'"
                          v-model="formData.seqNo" :max="999999999" :min="1" :placeholder="$t('security.form.rules.match.length.title')+'[0,999999999]'"
                          :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col v-if="formState==='add'" :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('application.app.list.roles')"
                     :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="roles">
          <a-select v-model="selectData" :field-names="{value: 'id', label: 'name'}" :options="roleSelectOptions"
                    :placeholder="$t('application.app.list.roles.placeholder')"
                    allow-clear allow-search multiple @change="selectChange">
            <template #header>
              <div class="check-all">
                <a-checkbox v-model="selectAll" class="check-all-radio" @change="selectAllChange">
                  <span class="check-all-span">{{ $t('searchTable.app.operations.all') }}</span>
                </a-checkbox>
              </div>
            </template>
          </a-select>
          <template #extra>
            {{ $t('application.app.list.roles.extra') }}
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('application.app.list.description')"
                     :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="description">
          <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">
        {{ formData.description }}
      </span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>

  <a-modal v-model:visible="visible" :footer="false" style="top: 20px" width="930px">
    <template #title>
      {{ $t('application.app.model.icon.title') }}：
      <a-input-search v-model="searchText" :placeholder="$t('application.app.model.icon.placeholder')" allow-clear
                      style="width: 18em;margin-left: 0.5em"/>
    </template>
    <div :style="{'height':'555px','overflow-y':'scroll','padding':'1em','margin':'-20px'}">
      <div v-for="item in glIconItems" :key="item.icon_id" class="gl-iconfont-setter-icon-item" @click="onSelected(item)">
        <div style="font-size: 2em;">
          <GlIconfont :type="iconsJson.css_prefix_text+item.font_class"/>
        </div>
        <div>{{ iconsJson.css_prefix_text + item.font_class }}</div>
      </div>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.input-button {
  height: 31px;
  padding: 0 8px;
}

.input-button-primary {
  color: rgb(var(--primary-6));
  border-color: var(--color-primary-light-3);
}

.input-button-close {
  color: rgb(var(--danger-6));
  border-color: var(--color-danger-light-3);
}

.input-icon > :last-child {
  padding: 0px !important;
}

.gl-iconfont-setter-icon-item {
  display: inline-block;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  min-width: 9em;
  max-width: 9em;
  height: 9em;
  vertical-align: top;
}

.gl-iconfont-setter-icon-item:hover {
  box-shadow: 0px 0px 4px #1890FF;
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