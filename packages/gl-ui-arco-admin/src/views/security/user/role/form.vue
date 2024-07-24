<script lang="ts">
export default {
  name: 'UserSelectRoleForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import type {FormInstance} from "@arco-design/web-vue";
import {securityApi} from '@geelato/gl-ui'
import type {PageQueryRequest, QueryRoleForm} from '@geelato/gl-ui';

// 页面所需 参数
type PageParams = {
  orgId: string; // 组织主键
  orgName: string; // 组织名称
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

type UserRoleForm = {
  orgId: string; // 组织主键
  orgName: string; // 组织名称
  userId: string; // 用户主键
  roleIds: string[]; // 角色主键
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// 表单 - 主键
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  isModal: {type: Boolean, default: true},// 弹层 - 方式，true-弹窗；false-抽屉
  title: {type: String, default: ''},// 弹层 - 标题
  width: {type: String, default: ''},// 弹层 - 高度，为空-自然变化
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 页面状态
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const visibleForm = ref<boolean>(false);

const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
/* 表单 */
const generateFormData = (): UserRoleForm => {
  return {
    orgId: props.parameter.orgId || '',
    orgName: props.parameter.orgName || '',
    userId: '',
    roleIds: [],
  };
}
const formData = ref(generateFormData());

/**
 * 分页查询方法
 * @param params
 */
const queryRoleByUser = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await securityApi.pageQueryRoleUserOf({
      ...params,
      order: 'weight|desc', current: 1, pageSize: 10000,
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    } as PageQueryRequest);
    const roleIds = (data && data.items && data.items.length > 0) ? data.items.map((item: any) => item.roleId) : [];
    if (successBack && typeof successBack === 'function') successBack(roleIds);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = async (done: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    done(true);
    emits('saveSuccess', formData.value);
  } else {
    done(false);
  }
};
/**
 * 取消按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

/**
 * 重置验证信息
 */
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};


/* 常用字段选择 */
const roleSelectOptions = ref<QueryRoleForm[]>([]);
const originRoleSelectOptions = ref<QueryRoleForm[]>([]);
const selectAll = ref<boolean>(false);
const selectData = ref<string[]>([]);
/**
 * 选择内容与全选联动
 */
const selectChange = () => {
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of originRoleSelectOptions.value) {
    if (item.enableStatus && !formData.value.roleIds.includes(item.id)) {
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
    for (const item of originRoleSelectOptions.value) {
      if (item.enableStatus && !formData.value.roleIds.includes(item.id)) {
        formData.value.roleIds.push(item.id);
      }
    }
  } else {
    formData.value.roleIds = [];
  }
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  // 角色信息
  securityApi.getRoleSelectOptions({
    order: 'weight|desc',
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryRoleForm[]) => {
    roleSelectOptions.value = data || [];
    originRoleSelectOptions.value = data || [];
  }, () => {
    roleSelectOptions.value = [];
    originRoleSelectOptions.value = [];
  });
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 其他初始化
}

watch(() => formData.value.userId, () => {
  if (!formData.value.userId) {
    originRoleSelectOptions.value = roleSelectOptions.value;
  }
  queryRoleByUser({userId: formData.value.userId}, (roleIds: string[]) => {
    originRoleSelectOptions.value = roleSelectOptions.value.filter((item: QueryRoleForm) => roleIds.includes(item.id));
  }, () => {
    originRoleSelectOptions.value = roleSelectOptions.value;
  });
}, {deep: true, immediate: true});

watch(() => props, () => {
  if (props.visible === true) {
    loadPage();
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal draggable  v-model:visible="visibleForm"
           :cancel-text="$t('security.user.index.model.cancel.text')"
           :footer="formState!=='view'"
           :ok-text="$t('security.user.index.model.ok.text')"
           :title="title || $t(`security.user.index.model.title.${formState}`)"
           :width="width || ''" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col v-if="!!formData.orgId" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item label="所属组织" field="orgId">
            <GlOrgSelect v-model="formData.orgId" :disabled="true"/>
            <template #help>
              当前用户所属的组织，限定选择人员的范围，
            </template>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item label="选择人员" field="userId">
            <GlOrgUserSelect v-model="formData.userId" :max-count="1" :parameter="props.parameter" :root-org-id="formData.orgId"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item label="选择角色" :rules="[{required: true,message:'这是必填项'}]" field="roleIds">
            <a-select v-model="formData.roleIds" allow-clear allow-search multiple scrollbar
                      placeholder="选择角色，关联当前用户" @change="selectChange">
              <a-option v-for="(item,index) of originRoleSelectOptions" :key="index"
                        :disabled="!item.enableStatus"
                        :label="`${item.weight} ${item.name} ${item.code}`"
                        :title="item.enableStatus?item.description:'已禁用，不可选'"
                        :value="item.id"/>
              <template #header>
                <div class="check-all">
                  <a-checkbox v-model="selectAll" class="check-all-radio" @change="selectAllChange">
                    <span class="check-all-span">{{ $t('searchTable.app.operations.all') }}</span>
                  </a-checkbox>
                </div>
              </template>
            </a-select>
            <template #help>
              <p>1，选择人员，然后选择此人拥有的角色。</p>
              <p>2，直接选角色，已列出所有待选角色。</p>
            </template>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
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