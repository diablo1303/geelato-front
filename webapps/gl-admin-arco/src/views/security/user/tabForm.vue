<script lang="ts">
export default {
  name: 'UserTabsForm'
};
</script>

<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import useLoading from "@/hooks/loading";
import {Message} from "@arco-design/web-vue";
import {generateRandom} from "@/utils/strings";
import {getUser, QueryUserForm as QueryForm} from "@/api/security";
import UserModel from './model.vue';
import UserOrgList from './org/list.vue';
import UserRoleList from './role/list.vue';

// 页面所需 参数
type PageParams = {
  orgId: string; // 组织主键
  orgName: string; // 组织名称
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
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

const {loading, setLoading} = useLoading(false);
const visibleForm = ref<boolean>(false);
const formData = ref<QueryForm>({} as unknown as QueryForm);
const tableFormRef = shallowRef(UserModel);
const tabsKey = ref<number>(1);// 定位tabs页面
const loadUserOrg = ref<string>(generateRandom());
const baseHeight = ref<number>((props.height as number) - 85);
// 关联组织
const orgListParams = ref({
  visible: false,
  parameter: {userId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: (props.height as number) - 300,
  pageSize: 20,
});
// 关联角色
const roleListParams = ref({
  visible: false,
  parameter: {userId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: (props.height as number) - 300,
  pageSize: 20,
});


/**
 * 获取应用信息
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getUser(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 更新应用信息
 */
const updateForm = () => {
  setLoading(true)
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryForm) => {
      setLoading(false);
      Message.success("更新成功！");
      if (formData.value.orgName !== data.orgName) {
        loadUserOrg.value = generateRandom();
        setTimeout(() => {
          tabsKey.value = 2;
        }, 3 * 1000);
      }
      formData.value = data;
      emits('saveSuccess', data, props.formState);
    }, () => {
      setLoading(false);
    });
  }
};

watch(() => props, () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    formData.value.id = props.modelValue;
    if (props.modelValue) {
      getData(props.modelValue, (data: QueryForm) => {
        // 表格数据处理
        data.seqNo = Number(data.seqNo);
        formData.value = data;
        // 关联组织
        Object.assign(orgListParams.value, {
          visible: true, formState: props.formState,
          parameter: {
            userId: props.modelValue,
            appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
          }
        });
        // 关联角色
        Object.assign(roleListParams.value, {
          visible: true, formState: props.formState,
          parameter: {
            userId: props.modelValue,
            appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
          }
        });
      });
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  if (visibleForm.value === false) {
    orgListParams.value.visible = false;
    roleListParams.value.visible = false;
  }
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});

watch(() => props.height, () => {
  baseHeight.value = (props.height as number) - 85;
  orgListParams.value.height = (props.height as number) - 300;
  roleListParams.value.height = (props.height as number) - 300;
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-if="isModal" v-model:visible="visibleForm" :footer="false"
           :title="title || $t(`security.user.index.model.title.${formState}`)"
           :width="width || ''" title-align="start">
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="{height:`${height}px`}" position="left" type="line">
      <a-tab-pane :key="1" :title="$t('security.user.form.tab.title.one')">
        <a-card class="">
          <template #extra>
            <a-space>
              <a-popconfirm content="是否更新该用户的基本信息？" position="br" type="info" @ok="updateForm">
                <a-button :disabled="formState==='view'" :loading="loading" class="app-button" type="text">
                  <template #icon>
                    <icon-save/>
                  </template>
                  更新
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <a-scrollbar :style="{overflow:'auto',height:`${baseHeight}px`}">
            <div style="width: 98.6%;">
              <UserModel ref="tableFormRef"
                         :visible="visibleForm"
                         :parameter="parameter"
                         :formState="formState"
                         :modelValue="formData.id"
                         :formCol="formCol"/>
            </div>
          </a-scrollbar>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="2" :title="$t('security.user.form.tab.title.two')">
        <a-card class="">
          <UserOrgList :key="loadUserOrg"
                       :filterCol="orgListParams.filterCol"
                       :formState="orgListParams.formState"
                       :height="orgListParams.height"
                       :pageSize="orgListParams.pageSize"
                       :parameter="orgListParams.parameter"
                       :visible="orgListParams.visible"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="3" :title="$t('security.user.form.tab.title.three')">
        <a-card class="">
          <UserRoleList :filterCol="roleListParams.filterCol"
                        :formState="roleListParams.formState"
                        :height="roleListParams.height"
                        :pageSize="roleListParams.pageSize"
                        :parameter="roleListParams.parameter"
                        :visible="roleListParams.visible"/>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style lang="less" scoped>

</style>