<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['model.connect.index.menu.list', 'model.dataBase.index.menu.list']"/>
    <a-card class="general-card general-card1">
      <a-row>
        <a-col :span="6">
          <a-spin>{{ $t('model.dataBase.index.menu.list') }}</a-spin>
        </a-col>
        <a-col :span="18">
          <a-spin>
            {{ pageData.treeTitle !== '' ? pageData.treeTitle : $t('model.connect.index.menu.list.searchTable') }}
          </a-spin>
          <a-spin v-if="pageData.isSystem" style="padding-right: 5px;">
            <a-button v-show="pageData.level===2" class="list-action-button-default" type="primary" status="warning">
              <a-spin>{{ $t('model.table.index.form.sourceType.system') }}</a-spin>
            </a-button>
          </a-spin>
          <a-spin>
            <a-button v-show="pageData.level===2" :disabled="pageData.isSync===0" class="list-action-button-default" type="primary">
              <a-spin v-if="pageData.isSync===2">{{ $t('model.table.index.form.tableName.yes') }}</a-spin>
              <a-spin v-else-if="pageData.isSync===1">{{ $t('model.table.index.form.tableName.edit') }}</a-spin>
              <a-spin v-else>{{ $t('model.table.index.form.tableName.no') }}</a-spin>
            </a-button>
          </a-spin>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-input-search v-model="searchKey" allow-clear style="margin-left:6%;max-width:88%"/>
          <a-scrollbar style="height:510px;overflow:auto;">
            <a-tree
                v-model:expanded-keys="expandedKeys"
                v-model:selected-keys="selectedKeys"
                :data="originTreeData"
                :load-more="loadMore"
                :show-line="true"
                @select="treeClickSelected">
              <template #title="nodeData">
                <template v-if="getMatchIndex(nodeData?.title) < 0">{{ nodeData?.title }}</template>
                <span v-else>{{ nodeData?.title?.substr(0, getMatchIndex(nodeData?.title)) }}
                  <span style="color: var(--color-primary-light-4);">{{
                      nodeData?.title?.substr(getMatchIndex(nodeData?.title), searchKey.length)
                    }}</span>
                  {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length) }}
                </span>
              </template>
              <template #extra="nodeData">
                <a-tooltip :content="$t('searchTable.actions.refresh')">
                  <IconRefresh v-if="nodeData.level===0" class="tree-extra-icon" @click="treeIconRefreshOne(nodeData)"/>
                </a-tooltip>
                <a-tooltip :content="$t('searchTable.actions.swap')">
                  <IconSwap v-if="nodeData.level===0" class="tree-extra-icon" @click="treeIconSwapOne(nodeData)"/>
                </a-tooltip>
              </template>
            </a-tree>
          </a-scrollbar>
        </a-col>
        <a-col :span="18">
          <a-card v-show="pageData.level===0" class="general-card">
            <ConnectList ref="connectListRef"></ConnectList>
          </a-card>
          <a-card v-show="pageData.level===1" class="general-card">
            <TableList ref="tableListRef"></TableList>
          </a-card>
          <a-tabs v-show="pageData.level===2" v-model:active-key="pageData.tabKey" :default-active-tab="1"
                  :position="'top'" type="line" :lazy-load="true">
            <a-tab-pane key="1" :title="$t('model.column.index.menu.list.searchTable')" class="a-tabs-one">
              <a-card class="general-card">
                <ColumnList ref="columnListRef"></ColumnList>
              </a-card>
            </a-tab-pane>
            <a-tooltip :content="$t('model.foreign.index.menu.list.tab.tip')" position="top">
              <a-tab-pane key="2" :title="$t('model.foreign.index.menu.list.searchTable')" class="a-tabs-two">
                <template #title>
                  <a-tooltip :content="$t('model.foreign.index.menu.list.tab.tip')" position="right">
                    {{ $t('model.foreign.index.menu.list.searchTable') }}
                    <icon-question-circle/>
                  </a-tooltip>
                </template>
                <a-card class="general-card">
                  <ForeignList ref="foreignListRef"></ForeignList>
                </a-card>
              </a-tab-pane>
            </a-tooltip>
            <a-tab-pane key="3" :title="$t('model.view.index.menu.list.searchTable')" class="a-tabs-three">
              <a-card class="general-card">
                <ViewList ref="viewListRef"></ViewList>
              </a-card>
            </a-tab-pane>
            <a-tab-pane key="4" :title="$t('model.table.permission.index.menu.list.searchTable')" class="a-tabs-four">
              <a-card class="general-card">
                <TablePermissionForm ref="tablePermissionFormRef"></TablePermissionForm>
              </a-card>
            </a-tab-pane>
            <a-tab-pane key="5" :title="$t('model.column.permission.index.menu.list.searchTable')" class="a-tabs-five">
              <a-card class="general-card">
                <ColumnPermissionForm ref="columnPermissionFormRef"></ColumnPermissionForm>
              </a-card>
            </a-tab-pane>
            <template #extra>
              <a-space v-if="!pageData.isSystem">
                <a-button v-if="pageData.level===2" type="outline" @click="syncFromModelToTable($event)">
                  <template #icon>
                    <icon-sync/>
                  </template>
                  {{ $t('model.connect.index.model.sync.table') }}
                </a-button>
                <a-dropdown v-if="pageData.level===2" position="br">
                  <a-button type="outline">{{ $t('model.connect.index.model.sync.more') }}&nbsp;<icon-down/>
                  </a-button>
                  <template #content>
                    <a-doption @click="syncFromTableToModel($event)">
                      <template #icon>
                        <icon-sync/>
                      </template>
                      {{ $t('model.connect.index.model.sync.model') }}
                    </a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, ref} from "vue";
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {Modal, Notification, TreeNodeData} from "@arco-design/web-vue";
import {IconFolder, IconLink} from '@arco-design/web-vue/es/icon';
import {TreeNodeProps} from "@arco-design/web-vue/es/tree/interface";
import {createOrUpdateModelToTable, QueryConnectForm, queryConnects, QueryTableForm, queryTables, resetModelFormTable} from "@/api/model";
import {PageQueryRequest} from "@/api/base";
// 引用其他页面
import TableList from '@/views/model/table/list.vue';
import ColumnList from '@/views/model/column/list.vue';
import ConnectList from '@/views/model/connect/list.vue';
import ForeignList from '@/views/model/foreign/list.vue';
import ViewList from '@/views/model/view/list.vue';
import TablePermissionForm from '@/views/model/table/permission/form.vue';
import ColumnPermissionForm from '@/views/model/column/permission/form.vue';

const pageData = ref({
  formState: 'edit', isModal: true, swap: true,
  tabKey: '1',
  level: 0, treeKey: '0', treeTitle: '',
  treeEntity: '', treeConnect: '',
  isSync: 0, isSystem: false
});

interface TreeNode extends TreeNodeProps {
  formData?: QueryConnectForm | QueryTableForm;
  children?: TreeNode[];
}

// 国际化
const {t} = useI18n();
const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});
// 链接页面
const connectListRef = ref(null);
const tableListRef = ref(null);
const columnListRef = ref(null);
const foreignListRef = ref(null);
const viewListRef = ref(null);
const tablePermissionFormRef = ref(null);
const columnPermissionFormRef = ref(null);
// Tree
const treeData = ref<TreeNode[]>([]);
const searchKey = ref('');
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
/**
 * 树tree，搜索
 * @param keyword
 */
const searchData = (keyword: string) => {
  const loop = (data: TreeNode[]) => {
    const result: TreeNode[] = [];
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
  if (!searchKey.value) return (treeData.value as TreeNodeData[]);
  return (searchData(searchKey.value) as TreeNodeData[]);
});

/**
 * 交换按钮，
 * @param item
 */
const swapConnect = (item: QueryConnectForm): string => {
  return `${pageData.value.swap ? `${item.dbConnectName} | ${item.dbName}` : item.dbName}`;
}
const swapConnectTitle = (item: QueryConnectForm): string => {
  // mysql://localhost/geelato
  return `${item.dbConnectName}（${item.dbType && item.dbType.toLowerCase()}://${item.dbHostnameIp}:${item.dbPort}/${item.dbName}）`;
}
const swapTable = (item: QueryTableForm): string => {
  return pageData.value.swap ? `${item.title} | ${item.entityName || item.tableName}` : (item.entityName || item.tableName);
}
const swapTableTitle = (item: QueryTableForm): string => {
  // eslint-disable-next-line no-nested-ternary
  pageData.value.isSync = (item.tableName != null && item.tableName.length > 0) ? (item.synced ? 2 : 1) : 0;
  pageData.value.isSystem = ['system', 'platform'].includes(item.sourceType);
  return `${item.title}（${item.entityName || item.tableName}）`;
}
/**
 * 接口，获取数据连接
 * @param params
 */
const fetchConnects = async (params: PageQueryRequest = {current: 1, pageSize: 10000}): Promise<TreeNode[]> => {
  let treeOptions: TreeNode[] = [];
  try {
    const {data} = await queryConnects({...params, ...routeParams.value});
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({
        formData: item,
        title: swapConnect(item),
        key: item.id,
        level: 1,
        icon: () => h(IconLink)
      } as unknown as TreeNode);
    }
  } catch (err) {
    treeOptions = [];
  }
  return treeOptions;
}
/**
 * 接口，获取数据表单
 * @param params
 */
const fetchTables = async (params: PageQueryRequest = {current: 1, pageSize: 10000}): Promise<TreeNode[]> => {
  let treeOptions: TreeNode[] = [];
  try {
    const {data} = await queryTables({...params, ...routeParams.value});
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({
        formData: item,
        title: swapTable(item),
        key: item.id,
        level: 2,
        isLeaf: true
      } as unknown as TreeNode);
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
    fetchTables({connectId: `${nodeData.key}`} as unknown as PageQueryRequest).then((data) => {
      nodeData.children = data;
    });
    resolve();
  });
}

/**
 * 树操作，第一层级，刷新
 * @param data TreeNode[]
 */
const refreshTreeOne = (data: TreeNode[]) => {
  treeData.value = [{
    title: t('model.connect.index.menu.list.searchTable'),
    key: '0',
    level: 0,
    icon: () => h(IconFolder),
    children: data
  } as unknown as TreeNode];
  const nodeData: TreeNode = treeData.value[0];
  // 全局属性
  pageData.value.level = nodeData.level;
  pageData.value.treeKey = nodeData.key ? nodeData.key.toString() : '';
  pageData.value.treeTitle = nodeData.title || '';
  // 清理搜索框
  searchKey.value = '';
  // 选中、展开
  expandedKeys.value = [pageData.value.treeKey];
  selectedKeys.value = [pageData.value.treeKey];
  // 在加载一层
  // eslint-disable-next-line no-restricted-syntax
  const itemData = nodeData.children && nodeData.children[0];
  if (itemData && itemData.key) {
    expandedKeys.value.push(itemData.key.toString());
    loadMore(itemData);
  }
}
/**
 * 树操作，第二层级，刷新
 * @param connectId string
 * @param data TreeNode[]
 */
const refreshTreeTwo = (connectId: string, data: TreeNode[]) => {
  const parentData: TreeNode = treeData.value[0];
  parentData.key = parentData.key ? parentData.key.toString() : '';
  // eslint-disable-next-line no-restricted-syntax
  for (const item of parentData.children || []) {
    item.key = item.key ? item.key.toString() : '';
    if (item.key === connectId) {
      item.children = data;
      expandedKeys.value = [parentData.key, item.key];
      selectedKeys.value = [item.key];
      pageData.value.level = 1;
      pageData.value.treeKey = item.key;
      pageData.value.treeTitle = swapConnectTitle(item.formData as unknown as QueryConnectForm);

    }
  }
}

/**
 * 加载，数据连接列表
 */
const loadConnectList = () => {
  if (connectListRef.value) {
    // @ts-ignore
    connectListRef.value?.loadList({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal, modalAddBack: () => {
        fetchConnects().then((data) => {
          refreshTreeOne(data);
        });
      }, modalEditBack: (data: QueryConnectForm) => {
        const parentData: TreeNode = treeData.value[0];
        // eslint-disable-next-line no-restricted-syntax
        for (const item of parentData.children || []) {
          if (item.key === data.id) {
            item.title = swapConnect(data);
          }
        }
      }, modalDeleteBack: (id: string) => {
        fetchConnects().then((data) => {
          refreshTreeOne(data);
        });
      }
    });
  }
}

/**
 * 反向修改 tree中的表格信息
 * @param connectId
 * @param data
 */
const tableEditFeedBack = (connectId: string, data: QueryTableForm) => {
  const parentData: TreeNode = treeData.value[0];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of parentData.children || []) {
    if (item.key === connectId) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of item.children || []) {
        if (child.key === data.id) {
          child.formData = data;
          child.title = swapTable(data);
          if (pageData.value.level === 2) {
            pageData.value.treeTitle = swapTableTitle(data);
            pageData.value.treeEntity = data.entityName || data.tableName;
            pageData.value.treeConnect = data.connectId;
          }
        }
      }
    }
  }
}
/**
 * 加载，数据表单列表
 * @param connectId string
 * @param connectName string
 */
const loadTableList = (connectId: string, connectName: string) => {
  if (tableListRef.value) {
    // @ts-ignore
    tableListRef.value?.loadList({
      action: pageData.value.formState, pageSize: 6,
      isModal: pageData.value.isModal,
      params: {pId: connectId, pName: connectName}, modalAddBack: (data: QueryTableForm) => {
        fetchTables({connectId: `${connectId}`} as unknown as PageQueryRequest).then((nodes) => {
          refreshTreeTwo(connectId, nodes);
          selectedKeys.value = [data.id];
          // eslint-disable-next-line no-use-before-define
          treeSelected(data.id, {level: 2, key: data.id, title: data.title, formData: data} as TreeNode);
        });
      }, modalEditBack: (data: QueryTableForm) => {
        tableEditFeedBack(connectId, data);
      }, modalDeleteBack: () => {
        fetchTables({connectId: `${connectId}`} as unknown as PageQueryRequest).then((data) => {
          refreshTreeTwo(connectId, data);
        });
      }
    });
  }
}
/**
 * 加载，表单字段、外键列表
 * @param tableId string
 * @param tableName string
 */
const loadColumnAndForeignList = (tableId: string, tableName: string, connectId: string, appId?: string) => {
  if (columnListRef.value) {
    // @ts-ignore
    columnListRef.value?.loadList({
      action: pageData.value.isSystem ? "view" : pageData.value.formState,
      pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: tableId, pName: tableName, 'appId': appId || ''}
    });
  }
  if (foreignListRef.value) {
    // @ts-ignore
    foreignListRef.value?.loadList({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: tableName, pName: tableName, 'appId': appId || ''}
    });
  }
  if (viewListRef.value) {
    // @ts-ignore
    viewListRef.value?.loadList({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: connectId, pName: tableName, isSync: pageData.value.isSync === 2, 'appId': appId || ''}
    });
  }
  if (tablePermissionFormRef.value) {
    // @ts-ignore
    tablePermissionFormRef.value?.loadList({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: connectId, pName: tableName, pType: 'dp,mp', 'appId': appId || ''}
    });
  }
  if (columnPermissionFormRef.value) {
    // @ts-ignore
    columnPermissionFormRef.value?.loadList({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: tableId, pName: tableName, pType: 'cp', isSystem: pageData.value.isSystem, 'appId': appId || ''}
    });
  }
}

/**
 * 树操作，第一层级，刷新
 * @param nodeData
 */
const treeIconRefreshOne = (nodeData: TreeNode) => {
  fetchConnects().then((data) => {
    refreshTreeOne(data);
    setTimeout(() => {
      loadConnectList();
    }, 200);
    Notification.info(t('model.connect.index.model.info.refresh'));
  });
}
/**
 * 树操作，交换
 * 数据连接 连接名称 <==> 数据库名
 * 数据表单 表单名称 <==> 表名
 * @param nodeData
 */
const treeIconSwapOne = (nodeData: TreeNode) => {
  pageData.value.swap = !pageData.value.swap;
  fetchConnects().then((data) => {
    refreshTreeOne(data);
    setTimeout(() => {
      loadConnectList();
    }, 200);
    // Notification.info(t('model.connect.index.model.info.swap'));
  });
}

/**
 * 树tree，点击事件，选中节点
 * @param selectedKey string
 * @param nodeData TreeNode
 */
const treeSelected = (selectedKey: string, nodeData: TreeNode) => {
  // 全局属性
  pageData.value.level = nodeData.level || 0;
  pageData.value.treeKey = nodeData.key ? nodeData.key.toString() : '';
  // tab页面
  pageData.value.tabKey = pageData.value.level === 2 ? '1' : pageData.value.tabKey;
  pageData.value.treeEntity = '';
  let tableName = nodeData.title || '';
  let tableAppId = '';
  if (pageData.value.level === 1) {
    nodeData.formData = (nodeData.formData as unknown as QueryConnectForm);
    pageData.value.treeTitle = swapConnectTitle(nodeData.formData);
    pageData.value.treeConnect = nodeData.formData.id;
  } else if (pageData.value.level === 2) {
    nodeData.formData = (nodeData.formData as unknown as QueryTableForm);
    pageData.value.treeTitle = swapTableTitle(nodeData.formData);
    tableName = nodeData.formData.entityName || nodeData.formData.tableName;
    tableAppId = nodeData.formData.appId;
    pageData.value.treeConnect = nodeData.formData.connectId;
    pageData.value.treeEntity = tableName;
  } else {
    pageData.value.treeTitle = nodeData.title || '';
  }
  // 加载列表页面
  setTimeout(() => {
    if (pageData.value.level === 0) {
      loadConnectList();
    } else if (pageData.value.level === 1) {
      loadTableList(pageData.value.treeKey, '');
    } else if (pageData.value.level === 2) {
      loadColumnAndForeignList(pageData.value.treeKey, tableName, pageData.value.treeConnect, tableAppId);
    }
  }, 200);
}

/**
 * 树tree，点击事件，选中节点
 * @param selectedKey string
 * @param data TreeNode
 */
const treeClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNode[];
  node?: TreeNode | undefined;
  e?: Event | undefined;
}) => {
  treeSelected(selectedKey[0].toString(), data.node as unknown as TreeNode);
}


fetchConnects().then((data) => {
  refreshTreeOne(data);
  setTimeout(() => {
    loadConnectList();
  }, 200);
});

const createOrUpdateTable = async (entityName: string, successBack: any, failBack: any) => {
  try {
    await createOrUpdateModelToTable(entityName);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    failBack(err);
  }
}
const resetModel = async (entityName: string, successBack: any, failBack: any) => {
  try {
    await resetModelFormTable(entityName);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    failBack(err);
  }
}

const syncFromTableToModel = (ev: MouseEvent) => {
  if (pageData.value.level === 2 && pageData.value.treeEntity) {
    Modal.open({
      title: t('security.dict.index.modal.title'),
      titleAlign: 'start',
      content: `${pageData.value.treeEntity}，${t('model.table.index.modal.table.content')}`,
      cancelText: t('security.dict.index.modal.cancel.text'),
      okText: t('security.dict.index.modal.ok.text'), onOk() {
        resetModel(pageData.value.treeKey, () => {
          Notification.success({content: t("model.table.index.notice.update.success")});
          fetchTables({
            id: `${pageData.value.treeKey}`,
            entityName: `${pageData.value.treeEntity}`,
            connectId: `${pageData.value.treeConnect}`
          } as unknown as PageQueryRequest).then((data) => {
            tableEditFeedBack(pageData.value.treeConnect, data[0].formData as QueryTableForm);
            setTimeout(() => {
              loadColumnAndForeignList(pageData.value.treeKey, pageData.value.treeEntity, pageData.value.treeConnect, data[0]?.formData?.appId);
            }, 200);
          });
        }, () => {
          Notification.error({content: t("model.table.index.notice.update.fail")});
        });
      }
    });
  }
}
const syncFromModelToTable = (ev: MouseEvent) => {
  if (pageData.value.level === 2 && pageData.value.treeEntity) {
    Modal.open({
      title: t('security.dict.index.modal.title'),
      titleAlign: 'start',
      content: `${pageData.value.treeEntity}，${t('model.table.index.modal.model.content')}`,
      cancelText: t('security.dict.index.modal.cancel.text'),
      okText: t('security.dict.index.modal.ok.text'), onOk() {
        createOrUpdateTable(pageData.value.treeEntity, () => {
          Notification.success({content: t("model.table.index.notice.update.success")});
          fetchTables({
            id: `${pageData.value.treeKey}`,
            entityName: `${pageData.value.treeEntity}`,
            connectId: `${pageData.value.treeConnect}`
          } as unknown as PageQueryRequest).then((data) => {
            tableEditFeedBack(pageData.value.treeConnect, data[0].formData as QueryTableForm);
            setTimeout(() => {
              loadColumnAndForeignList(pageData.value.treeKey, pageData.value.treeEntity, pageData.value.treeConnect, data[0]?.formData?.appId);
            }, 200);
          });
        }, () => {
          Notification.error({content: t("model.table.index.notice.update.fail")});
        });
      }
    });
  }
}

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

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
}
</style>