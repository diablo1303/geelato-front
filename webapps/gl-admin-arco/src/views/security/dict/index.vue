<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['security.dict.index.menu.list', 'security.dict.index.menu.list.searchTable']"/>
    <a-card class="general-card general-card1">
      <a-row>
        <a-col :span="6">
          <a-spin>{{ $t('security.dict.index.menu.list.searchTable') }}</a-spin>
        </a-col>
        <a-col :span="18">
          <a-spin>{{
              pageData.treeTitle ? pageData.treeTitle : $t('security.dictItem.index.menu.list.searchTable')
            }}
          </a-spin>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-input-search v-model="searchKey" allow-clear style="margin-left:6%;max-width:88%"/>
          <a-scrollbar style="height:470px;overflow:auto;">
            <a-tree
                v-model:expanded-keys="expandedKeys"
                v-model:selected-keys="selectedKeys"
                :data="originTreeData"
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
                <a-dropdown position="bl" trigger="click">
                  <a-tooltip :content="$t('security.dict.index.modal.more')">
                    <IconMore class="tree-extra-icon1" @click="treeSelected(nodeData.key,nodeData)"/>
                  </a-tooltip>
                  <template #content>
                    <a-doption v-if="nodeData.level===0" @click="dropOptionDictRefresh(nodeData)">
                      <template #icon>
                        <icon-refresh/>
                      </template>
                      <template #default>{{ $t('searchTable.actions.refresh') }}</template>
                    </a-doption>
                    <a-divider v-if="nodeData.level===0" margin="0px 0px"/>
                    <a-doption v-if="nodeData.level===0" @click="dropOptionDictAdd(nodeData)">
                      <template #icon>
                        <icon-plus/>
                      </template>
                      <template #default>{{ $t('security.dict.index.model.title.add') }}</template>
                    </a-doption>
                    <a-doption v-if="nodeData.level===1" @click="dropOptionDictEdit(nodeData)">
                      <template #icon>
                        <icon-edit/>
                      </template>
                      <template #default>{{ $t('security.dict.index.model.title.edit') }}</template>
                    </a-doption>
                    <a-doption v-if="nodeData.level===1" @click="dropOptionDictDelete(nodeData)">
                      <template #icon>
                        <icon-delete/>
                      </template>
                      <template #default>{{ $t('security.dict.index.model.title.delete') }}</template>
                    </a-doption>
                    <a-divider v-if="nodeData.level===1" margin="0px 0px"/>
                    <a-doption v-if="nodeData.level===1" @click="dropOptionDictItemAdd(nodeData)">
                      <template #icon>
                        <icon-plus/>
                      </template>
                      <template #default>{{ $t('security.dictItem.index.model.title.add') }}</template>
                    </a-doption>
                  </template>
                </a-dropdown>
              </template>
            </a-tree>
          </a-scrollbar>
        </a-col>
        <a-col :span="18">
          <a-card v-if="pageData.level===0" class="general-card">
            <DictList ref="dictListRef"></DictList>
          </a-card>
          <a-card v-if="pageData.level===1" class="general-card">
            <DictItemList ref="dictItemListRef"></DictItemList>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <DictDrawer ref="dictDrawerRef"></DictDrawer>
    <DictItemDrawer ref="dictItemDrawerRef"></DictItemDrawer>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, shallowRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {Modal, Notification, TreeNodeData} from "@arco-design/web-vue";
import {TreeNodeProps} from "@arco-design/web-vue/es/tree/interface";
import {deleteDict, QueryDictForm as QueryForm, queryDicts} from '@/api/service/security_service';
import DictList from '@/views/security/dict/list.vue';
import DictDrawer from "@/views/security/dict/drawer.vue";
import DictItemList from '@/views/security/dict/item/list.vue';
import DictItemDrawer from "@/views/security/dict/item/drawer.vue";

// 国际化
const {t} = useI18n();
// 全局变量
const pageData = ref({formState: 'edit', isModal: true, level: 0, treeKey: '0', treeTitle: ''});
const dictListRef = ref(null);
const dictItemListRef = ref(null);
const dictDrawerRef = shallowRef(DictDrawer);
const dictItemDrawerRef = shallowRef(DictItemDrawer);
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
const fetchDictionary = async (): Promise<TreeNodeProps[]> => {
  let treeOptions: TreeNodeProps[] = [];
  try {
    const {data} = await queryDicts();
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({title: item.dictName, key: item.id, level: 1} as TreeNodeProps);
    }
  } catch (err) {
    treeOptions = [];
  }
  return treeOptions;
}
/**
 * 接口，从数据库中删除字典
 * @param id
 * @param successBack
 */
const deleteData = async (id: string, successBack: any) => {
  try {
    await deleteDict(id);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

/**
 * 刷新第一层树，根目录
 * @param data TreeNodeProps[]
 */
const refreshTreeOne = (data: TreeNodeProps[]) => {
  treeData.value = [{
    title: t('security.dict.index.menu.list.searchTable'),
    key: '0',
    level: 0,
    children: data
  } as unknown as TreeNodeProps];
  const nodeData: TreeNodeProps = treeData.value[0];
  pageData.value.level = treeData.value[0].level;
  pageData.value.treeKey = nodeData.key ? nodeData.key.toString() : '';
  pageData.value.treeTitle = nodeData.title || '';
  // 清理搜索框
  searchKey.value = '';
  // 选中、展开
  expandedKeys.value = [pageData.value.treeKey];
  selectedKeys.value = [pageData.value.treeKey];
}

/**
 * 页面加载完成后
 */
const loadedPage = () => {
  fetchDictionary().then((data) => {
    refreshTreeOne(data);
    setTimeout(() => {
      loadDictList();
    }, 200);
  });
}
loadedPage();

/**
 * 加载，字典列表
 */
const loadDictList = () => {
  if (dictListRef.value) {
    // @ts-ignore
    dictListRef.value.loadList({
      action: pageData.value.formState, pageSize: 5,
      isModal: pageData.value.isModal, modalAddBack: () => {
        fetchDictionary().then((data) => {
          refreshTreeOne(data);
        });
      }, modalEditBack: (data: QueryForm) => {
        const parentData: TreeNodeData = treeData.value[0];
        // eslint-disable-next-line no-restricted-syntax
        for (const item of parentData.children || []) {
          if (item.key === data.id) {
            item.title = data.dictName;
          }
        }
      }, modalDeleteBack: () => {
        fetchDictionary().then((data) => {
          refreshTreeOne(data);
        });
      }
    });
  }
}
/**
 * 加载，字典项列表
 * @param dictId string
 * @param dictName string
 */
const loadDictItemList = (dictId: string, dictName: string) => {
  if (dictItemListRef.value) {
    // @ts-ignore
    dictItemListRef.value.loadList({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: dictId, pName: dictName}
    });
  }
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
    loadDictList();
    loadDictItemList(pageData.value.treeKey, pageData.value.treeTitle);
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

/**
 * 下拉菜单，第一层，刷新
 * @param nodeData TreeNodeProps
 */
const dropOptionDictRefresh = (nodeData: TreeNodeProps) => {
  fetchDictionary().then((data) => {
    refreshTreeOne(data);
    setTimeout(() => {
      loadDictList();
    }, 200);
    Notification.info(t('model.connect.index.model.info.refresh'));
  });
}
/**
 * 下拉菜单，第一层，新增字典
 * @param nodeData TreeNodeProps
 */
const dropOptionDictAdd = (nodeData: TreeNodeProps) => {
  if (dictDrawerRef.value) {
    dictDrawerRef.value.openForm({
      action: 'add', closeBack: (data: QueryForm) => {
        loadedPage();
      }
    });
  }
}
/**
 * 下拉菜单，第二层，新增字典项
 * @param nodeData TreeNodeProps
 */
const dropOptionDictItemAdd = (nodeData: TreeNodeProps) => {
  const dictId = nodeData.key ? nodeData.key.toString() : '';
  const dictName = nodeData.title || '';
  if (dictItemDrawerRef.value) {
    dictItemDrawerRef.value.openForm({
      action: 'add', params: {pId: dictId, pName: dictName}, closeBack: () => {
        setTimeout(() => {
          loadDictItemList(dictId, dictName);
        }, 200);
      }
    });
  }
}
/**
 * 下拉菜单，第二层，编辑字典
 * @param nodeData TreeNodeProps
 */
const dropOptionDictEdit = (nodeData: TreeNodeProps) => {
  const dictId = nodeData.key ? nodeData.key.toString() : '';
  if (dictDrawerRef.value) {
    dictDrawerRef.value?.openForm({
      action: 'edit', 'id': dictId, closeBack: (data: QueryForm) => {
        nodeData.title = data.dictName;
        pageData.value.treeTitle = data.dictName;
      }
    });
  }
}
/**
 * 下拉菜单，第二层，删除字典
 * @param nodeData TreeNodeProps
 */
const dropOptionDictDelete = (nodeData: TreeNodeProps) => {
  const dictId = nodeData.key ? nodeData.key.toString() : '';
  Modal.open({
    title: t('security.dict.index.modal.title'),
    width: '300px',
    titleAlign: 'start',
    content: t('security.dict.index.modal.content'),
    cancelText: t('security.dict.index.modal.cancel.text'),
    okText: t('security.dict.index.modal.ok.text'), onOk() {
      deleteData(dictId, () => {
        loadedPage();
      });
    }
  });
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
  padding: 10px 0 0 10px;
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
