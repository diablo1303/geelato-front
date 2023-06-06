<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      width="32%"
      :cancel-text="$t('sercurity.user.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('sercurity.user.index.model.ok.text')"
      :title="$t(`sercurity.user.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <UserModel ref="userModelRef"></UserModel>
    <a-divider v-if="pageData.formState!=='add'" orientation="left">
      <strong>{{ $t('sercurity.user.index.form.partOrgName') }}</strong>
      <a-tree-select v-model="pageData.orgId" :data="orgSelectOptions" :field-names="{key:'value',title:'label'}"
                     @change="addOrgUser">
        <template #trigger>
          <a-tooltip position="top" :content="$t('sercurity.orgUser.index.model.title.add')">
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
          <a-button v-if="item.defaultOrg===1" type="outline" class="list-action-button-default">{{ $t('sercurity.orgUser.index.form.default') }}</a-button>
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteOrgUser(item.id)">
            <icon-delete v-if="pageData.formState==='edit'&&item.defaultOrg!==1" class="icon-danger"/>
          </a-popconfirm>
        </template>
      </a-list-item>
    </a-list>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import UserModel from '@/views/security/user/model.vue'
import {
  deleteOrgUser as deleteList,
  insertOrgUser as createOrUpdateForm,
  QueryOrgForm,
  queryOrgs,
  QueryOrgUserForm,
  queryOrgUsers,
  QueryUserForm
} from "@/api/service/sercurity_service";
import {ListUrlParams, PageQueryRequest, SelectOption} from '@/api/service/base_service';
import {FormInstance} from "@arco-design/web-vue/es/form";

const pageData = ref({formState: 'add', button: true, orgId: '', userId: ''});
const userModelRef = ref(null);
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
        data.children.push({value: item.id, label: item.name, children: []});
      }
    }
    if (data.children.length > 0) {
      buildOrgOptions(data.children, totalData);
    } else {
      delete data.children;
    }
  }

  return defaultData;
}
const getOrgOptions = async (params: QueryOrgForm = {status: 1} as unknown as QueryOrgForm) => {
  try {
    const {data} = await queryOrgs(params);
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: '根目录', children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children || [];
  } catch (err) {
    console.log(err);
  }
}
const fetchOrgUsers = async (params: PageQueryRequest) => {
  try {
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
    userModelRef.value?.submitModel(done, () => {
      done();
      okSuccessBack();
    }, () => {
      done(false);
    });
  }
};
const handleModelCancel = () => {
  visibleModel.value = false;
}

const deleteOrgUser = (id: string) => {
  deleteData(id, () => {
    orgUserRefresh();
  });
}
const addOrgUser = () => {
  if (pageData.value.orgId && pageData.value.userId) {
    createOrUpdateData({
      userId: pageData.value.userId,
      orgId: pageData.value.orgId,
      defaultOrg: 0
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
    userModelRef.value?.loadModel(urlParams);
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