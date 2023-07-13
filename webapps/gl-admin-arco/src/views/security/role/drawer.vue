<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('security.role.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.role.index.model.ok.text')"
      :title="$t(`security.role.index.model.title.${pageData.formState}`)"
      width="32%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <RoleModel ref="roleModelRef"></RoleModel>
    <a-divider v-if="pageData.formState!=='add'" orientation="left">
      <strong>{{ $t('security.role.form.tab.title.two') }}</strong>
      <a-select
          v-model="pageData.appId" :field-names="{value: 'id', label: 'name'}" :options="selectAppOptions"
          @change="addOrgUser">
        <template #trigger>
          <a-tooltip :content="$t('security.orgUser.index.model.title.add')" position="top">
            <icon-plus v-if="pageData.formState==='edit'" class="tree-extra-icon"/>
          </a-tooltip>
        </template>
      </a-select>
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
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning">
            <icon-delete v-if="pageData.formState==='edit'&&item.defaultOrg!==1" class="icon-danger"/>
          </a-popconfirm>
        </template>
      </a-list-item>
    </a-list>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {QueryAppForm, queryApps, QueryOrgUserForm, QueryUserForm} from "@/api/security";
import {ListUrlParams, SelectOption} from '@/api/base';
import {FormInstance} from "@arco-design/web-vue/es/form";
import RoleModel from "@/views/security/role/model.vue";

const pageData = ref({formState: 'add', button: true, appId: '', orgId: '', userId: ''});
const validateForm = ref<FormInstance>();
const orgUserOptions = ref<QueryOrgUserForm[]>([]);
const orgSelectOptions = ref<SelectOption[]>([]);
const selectAppOptions = ref<QueryAppForm[]>([]);
const roleModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;

const getSelectOptions = async () => {
  try {
    const {data} = await queryApps();
    selectAppOptions.value = data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
/* 表单 */
const handleModelOk = (done: any) => {
  if (roleModelRef.value) {
    // @ts-ignore
    roleModelRef.value?.submitModel(done, () => {
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


const addOrgUser = () => {
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

  // 加载页面
  if (roleModelRef.value) {
    urlParams.formCol = 1;
    // @ts-ignore
    roleModelRef.value?.loadModel(urlParams);
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