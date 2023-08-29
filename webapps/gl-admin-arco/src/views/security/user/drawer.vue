<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('security.user.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.user.index.model.ok.text')"
      :title="$t(`security.user.index.model.title.${pageData.formState}`)"
      width="32%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <UserModel ref="userModelRef"></UserModel>
    <a-divider v-if="pageData.formState!=='add'" orientation="left">
      <strong>{{ $t('security.user.index.form.partOrgName') }}</strong>
      <a-tree-select
          v-model="pageData.orgId" :data="orgSelectOptions" :field-names="{key:'value',title:'label'}"
          @change="addOrgUser">
        <template #trigger>
          <a-tooltip :content="$t('security.orgUser.index.model.title.add')" position="top">
            <icon-plus v-if="pageData.formState==='edit'" class="tree-extra-icon"/>
          </a-tooltip>
        </template>
      </a-tree-select>
    </a-divider>
    <a-list v-if="pageData.formState!=='add'">
      <a-list-item v-for="(item,index) in orgUserOptions" :key="item.id" style="padding: 5px 20px;">
        <a-list-item-meta :title="item.orgName">
          <template #avatar>
            <a-avatar shape="square" style="width: 20px;height: 20px;font-size: 16px;">
              {{ index + 1 }}
            </a-avatar>
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button v-if="item.defaultOrg===1" class="list-action-button-default" type="outline">
            {{ $t('security.orgUser.index.form.default') }}
          </a-button>
          <a-popconfirm
              :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning"
              @ok="deleteOrgUser(item.id)">
            <icon-delete v-if="pageData.formState==='edit'&&item.defaultOrg!==1" class="icon-danger"/>
          </a-popconfirm>
        </template>
      </a-list-item>
    </a-list>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import UserModel from '@/views/security/user/model.vue'
import {ListUrlParams, PageQueryRequest, SelectOption} from '@/api/base';
import {
  deleteOrgUser as deleteList,
  insertOrgUser as createOrUpdateForm,
  QueryOrgForm,
  queryOrgs,
  QueryOrgUserForm,
  queryOrgUsers,
  QueryUserForm
} from "@/api/security";
import {FormInstance} from "@arco-design/web-vue/es/form";

// 国际化
const {t} = useI18n();
const route = useRoute();
const pageData = ref({formState: 'add', button: true, orgId: '', userId: ''});
const userModelRef = shallowRef(UserModel);
const orgUserOptions = ref<QueryOrgUserForm[]>([]);
const validateForm = ref<FormInstance>();
const orgSelectOptions = ref<SelectOption[]>([]);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;
const buildOrgOptions = (defaultData: SelectOption[], totalData: QueryOrgForm[]): SelectOption[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (item.pid === data.value) {
        data.children?.push({value: item.id, label: item.name, children: []});
      }
    }
    if (data.children && data.children.length > 0) {
      buildOrgOptions(data.children, totalData);
    } else {
      delete data.children;
    }
  }

  return defaultData;
}
const getOrgOptions = async (params: QueryOrgForm = {status: 1} as unknown as QueryOrgForm) => {
  try {
    params.tenantCode = (route.params && route.params.tenantCode as string) || '';
    const {data} = await queryOrgs(params);
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: '根目录', children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children || [];
  } catch (err) {
    console.log(err);
  }
}
const fetchOrgUsers = async (params: PageQueryRequest) => {
  try {
    // @ts-ignore
    params.tenantCode = (route.params && route.params.tenantCode as string) || '';
    const {data} = await queryOrgUsers(params);
    orgUserOptions.value = data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
const orgUserRefresh = () => {
  fetchOrgUsers({userId: pageData.value.userId} as unknown as PageQueryRequest);
}
const deleteData = async (id: string, successBack: any) => {
  try {
    await deleteList(id);
    successBack();
  } catch (err) {
    console.log(err);
  }
};
const createOrUpdateData = async (params: QueryOrgUserForm) => {
  try {
    await createOrUpdateForm(params);
    orgUserRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
/* 表单 */
const handleModelOk = (done: any) => {
  if (userModelRef.value) {
    userModelRef.value.submitModel(done, () => {
      done();
      okSuccessBack();
    }, () => {
      done(false);
    });
  }
};
const handleModelCancel = (e: Event) => {
  visibleModel.value = false;
}

const deleteOrgUser = (id: string) => {
  deleteData(id, () => {
    orgUserRefresh();
  });
}

const addOrgUser = (value: any) => {
  if (pageData.value.orgId && pageData.value.userId) {
    createOrUpdateData({
      userId: pageData.value.userId,
      orgId: pageData.value.orgId,
      defaultOrg: 0,
      tenantCode: (route.params && route.params.tenantCode as string) || ''
    } as unknown as QueryOrgUserForm);
  }
}

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.userId = urlParams.id || "";
  urlParams.loadFailBack = () => {
    pageData.value.button = false;
  }
  urlParams.loadSuccessBack = (data: QueryUserForm) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  if (pageData.value.userId) {
    fetchOrgUsers({userId: pageData.value.userId} as unknown as PageQueryRequest);
    getOrgOptions();
  }
  // 加载页面
  if (userModelRef.value) {
    urlParams.formCol = 1;
    userModelRef.value.loadModel(urlParams);
  }
  // 显示
  visibleModel.value = true;
  okSuccessBack = urlParams.closeBack || null;
}

// 将方法暴露出去
defineExpose({openForm});
</script>

<style lang="less" scoped>
.tree-extra-icon {
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}

.icon-danger {
  color: rgb(245, 63, 63);
}

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
  margin-right: -20px;
}
</style>