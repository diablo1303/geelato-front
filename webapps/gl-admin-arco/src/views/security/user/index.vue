<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['security.user.index.menu.list', 'security.user.index.menu.list.searchTable']"/>
    <a-card class="general-card general-card1">
      <a-row>
        <a-col :span="6">
          <a-spin>{{ $t('security.org.index.menu.list.searchTable') }}</a-spin>
        </a-col>
        <a-col :span="18">
          <a-spin>{{ pageData.treeTitle ? pageData.treeTitle : $t('security.user.index.menu.list.searchTable') }}</a-spin>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-input-search v-model="searchKey" style="margin-left:6%;max-width:88%" allow-clear/>
          <a-scrollbar style="height:470px;overflow:auto;">
            <a-tree
                v-model:selected-keys="selectedKeys"
                v-model:expanded-keys="expandedKeys"
                :data="originTreeData"
                :show-line="true"
                :load-more="loadMore"
                @select="treeClickSelected">
              <template #title="nodeData">
                <template v-if="getMatchIndex(nodeData?.title) < 0">{{ nodeData?.title }}</template>
                <span v-else>{{ nodeData?.title?.substr(0, getMatchIndex(nodeData?.title)) }}
                  <span style="color: var(--color-primary-light-4);">{{ nodeData?.title?.substr(getMatchIndex(nodeData?.title), searchKey.length) }}</span>
                  {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length) }}
                </span>
              </template>
              <template #extra="nodeData">
                <a-tooltip :content="$t('searchTable.actions.refresh')">
                  <IconRefresh v-if="nodeData.level===0" class="tree-extra-icon" @click="treeIconRefreshOne(nodeData)"/>
                </a-tooltip>
              </template>
            </a-tree>
          </a-scrollbar>
        </a-col>
        <a-col :span="18">
          <a-card class="general-card">
            <UserList ref="userListRef"></UserList>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {Notification} from "@arco-design/web-vue";
import {TreeNodeData, TreeNodeProps} from "@arco-design/web-vue/es/tree/interface";
import UserList from '@/views/security/user/list.vue';
import {QueryOrgForm, queryOrgs} from '@/api/service/security_service';

// 国际化
const {t} = useI18n();
// 全局变量
const pageData = ref({formState: 'edit', isModal: true, level: 0, treeKey: '0', treeTitle: ''});
const userListRef = ref(null);
// Tree
const treeData = ref<TreeNodeProps[]>([]);
const searchKey = ref('');
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
/**
 * 树tree，搜索
 * @param keyword
 */
const searchData = (keyword: string) => {
  const loop = (data: TreeNodeData[]) => {
    const result: TreeNodeData[] = [];
    data.forEach(item => {
      if (item.title && item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({...item});
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(treeData.value);
}
const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
const originTreeData = computed(() => {
  if (!searchKey.value) return treeData.value;
  return searchData(searchKey.value);
});
/**
 * 接口，从数据库获取字典信息
 */
const fetchOrgs = async (params: QueryOrgForm = {pid: '0'} as unknown as QueryOrgForm): Promise<TreeNodeProps[]> => {
  let treeOptions: TreeNodeProps[] = [];
  try {
    const {data} = await queryOrgs(params);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({title: item.name, key: item.id, level: 1} as TreeNodeProps);
    }
  } catch (err) {
    treeOptions = [];
  }
  return treeOptions;
}
/**
 * 树事件，加载更多
 * @param nodeData TreeNodeData
 */
const loadMore = (nodeData: TreeNodeData) => {
  return new Promise<void>((resolve) => {
    fetchOrgs({pid: `${nodeData.key}`} as unknown as QueryOrgForm).then((data) => {
      nodeData.children = data;
    });
    resolve();
  });
}
/**
 * 刷新第一层树，根目录
 * @param data TreeNodeProps[]
 */
const refreshTreeOne = (data: TreeNodeProps[]) => {
  treeData.value = [{title: t('security.org.index.menu.list.searchTable'), key: '0', level: 0, children: data} as unknown as TreeNodeProps];
  const nodeData: TreeNodeData = treeData.value[0];
  pageData.value.level = treeData.value[0].level;
  pageData.value.treeKey = nodeData.key ? nodeData.key.toString() : '';
  pageData.value.treeTitle = nodeData.title || '';
  // 选中、展开
  selectedKeys.value = [pageData.value.treeKey];
  expandedKeys.value = [pageData.value.treeKey];
  // 展开第二层
  // eslint-disable-next-line no-restricted-syntax
  for (const item of nodeData.children || []) {
    if (item.key) {
      expandedKeys.value.push(item.key.toString());
      loadMore(item);
    }
  }
}

/**
 * 页面加载完成后
 */
const loadedPage = () => {
  fetchOrgs().then((data) => {
    refreshTreeOne(data);
    setTimeout(() => {
      loadUserList(pageData.value.treeKey, pageData.value.treeTitle);
    }, 200);
    searchKey.value = '';
  });
}
loadedPage();

/**
 * 加载，字典列表
 */
const loadUserList = (orgId: string, orgName: string) => {
  orgName = orgId === '0' ? '' : orgName;
  orgId = orgId === '0' ? '' : orgId;
  if (userListRef.value) {
    // @ts-ignore
    userListRef.value?.loadList({
      action: pageData.value.formState, pageSize: 5,
      isModal: pageData.value.isModal,
      params: {'orgId': orgId, 'orgName': orgName}
    });
  }
}
/**
 * 树操作，第一层级，刷新
 * @param nodeData
 */
const treeIconRefreshOne = (nodeData: TreeNodeProps) => {
  fetchOrgs().then((data) => {
    refreshTreeOne(data);
    setTimeout(() => {
      loadUserList(pageData.value.treeKey, pageData.value.treeTitle);
    }, 200);
    searchKey.value = '';
    Notification.info(t('model.connect.index.model.info.refresh'));
  });
}
/**
 * 树tree，选中节点
 * @param selectedKey string
 * @param data TreeNodeProps
 */
const treeSelected = (selectedKey: string, data: TreeNodeProps) => {
  // 全局变量
  pageData.value.level = data.level || 0;
  pageData.value.treeKey = data.key ? data.key.toString() : '';
  pageData.value.treeTitle = data.title || '';
  // 选中
  selectedKeys.value = [pageData.value.treeKey];
  // 加载列表
  setTimeout(() => {
    loadUserList(pageData.value.treeKey, pageData.value.treeTitle);
  }, 200);
}
/**
 * 树tree，点击事件，选中节点
 * @param selectedKey string
 * @param data TreeNodeProps
 */
const treeClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeProps[];
  node?: TreeNodeProps | undefined;
  e?: Event | undefined;
}) => {
  treeSelected(selectedKey[0].toString(), data.node as unknown as TreeNodeProps);
}
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
  position: relative;
}

.general-card1 .list-item1 {
  cursor: pointer;
  padding: 10px 10px !important;
}

.general-card1 .list-item1.active {
  background-color: var(--color-fill-3);
  color: rgb(var(--primary-6));
}

.arco-btn {
  border-radius: 6px;
}

.arco-btn-size-medium {
  /* padding: 0 8px; */
}

.general-card > .arco-tabs-content {
  padding: 10px 0px 0px 10px;
}

.general-card1 > .arco-card-body > .arco-row:first-child {
  height: auto;
  padding: 20px;
  border: none;
}

.general-card1 > .arco-card-body > .arco-row > .arco-col > .arco-spin {
  flex: 1;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5715;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


.form {
  width: 500px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.tree-extra-icon {
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}

.tree-extra-icon1 {
  position: initial;
  font-size: 18px;
  color: #3370ff;
  width: 42px;
  margin-right: 15px;
}
</style>
