<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['sercurity.dict.index.menu.list', 'sercurity.dict.index.menu.list.searchTable']"/>
    <a-card class="general-card general-card1">
      <a-row>
        <a-col :span="4">
          <a-spin>{{ $t('sercurity.dict.index.menu.list.searchTable') }}</a-spin>
        </a-col>
        <a-col :span="20">
          <a-spin>{{ pageData.params.dictName ? pageData.params.dictName : $t('sercurity.dictItem.index.menu.list.searchTable') }}</a-spin>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">
          <a-space style="padding-bottom: 10px;">
            <a-button :disabled="pageData.formState!=='edit'" type="outline" @click="addDict">
              <template #icon>
                <icon-plus/>
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-button type="outline" @click="refreshDict">
              <template #icon>
                <icon-refresh/>
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
          <a-list :loading="loading" :max-height="480" :scrollbar="scrollbar">
            <a-list-item v-for="item of listData" :id="item.id" :key="item.id" class="list-item1" @click="selectedList(`${item.id}`)">
              {{ item.dicName }}
            </a-list-item>
          </a-list>
        </a-col>
        <a-col :span="20">
          <a-tabs v-model:active-key="pageData.tabKey" :default-active-tab="1" :position="'top'" type="rounded" @tab-click="tabsChange">
            <a-tab-pane key="1" :title="$t('sercurity.dict.index.menu.list.searchTable1')">
              <DictModel ref="dictModelRef"></DictModel>
              <a-space v-show="pageData.formState==='edit'" style="padding-left: 128px;">
                <a-button :loading="loading" type="primary" @click="saveForm">{{ $t('sercurity.dict.index.model.save.text') }}</a-button>
                <a-button type="primary" @click="deleteForm">{{ $t('sercurity.dict.index.model.delete.text') }}</a-button>
              </a-space>
            </a-tab-pane>
            <a-tab-pane key="2" :title="$t('sercurity.dictItem.index.menu.list.searchTable')">
              <a-card class="general-card">
                <DictItemList ref="dictItemListRef"></DictItemList>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {Modal, Notification} from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import {deleteDict, getDict, QueryDictForm, queryDicts} from '@/api/sercurity_service'
import DictModel from '@/views/security/dict/model.vue'
import DictItemList from '@/views/security/dict/item/list.vue'

const {loading, setLoading} = useLoading(true);
const dictModelRef = ref(null);
const dictItemListRef = ref(null);
const {t} = useI18n();
const pageData = ref({formState: 'edit', tabKey: '1', isModal: true, params: {dictId: '', dictName: ''}});
/* 字典列表 */
const listData = ref<QueryDictForm[]>([]);
const scrollbar = ref(true);
/* 字典列表 */
const queryDictList = async (dicName: string, successBack?: any) => {
  setLoading(true);
  try {
    const {data} = await queryDicts();
    listData.value = data;
    successBack();
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const selectedActive = (id?: string) => {
  const list = document.getElementsByClassName("list-item1");
  for (let i = 0; i < list.length; i += 1) {
    let classVal = list[i].className;
    classVal = classVal.replace(/active/g, '');
    if (list[i].id === id) {
      classVal = classVal.concat(" active");
    }
    list[i].setAttribute("class", classVal);
  }
}
/**
 * 新增字典
 */
const addDict = () => {
  // 基础信息清空、页面信息复原、重置字典项、跳至基本信息
  pageData.value.tabKey = '1';
  selectedActive();
  // 页面信息
  pageData.value.params.dictId = '';
  pageData.value.params.dictName = '';
  // 刷新表单、列表
  loadModelAndList();
}
const refreshDict = () => {
  // 基础信息清空、页面信息复原、重置字典项、重置字典
  selectedActive();
  queryDictList('');
  // 页面信息
  pageData.value.params.dictId = '';
  pageData.value.params.dictName = '';
  // 刷新表单、列表
  loadModelAndList();
}
const selectedList = (id: string) => {
  if (id && id !== pageData.value.params.dictId) {
    getData(id, (data: QueryDictForm) => {
      selectedActive(data.id);
      // 页面信息
      pageData.value.params.dictId = data.id;
      pageData.value.params.dictName = data.dicName;
      // 重置字典项
      loadModelAndList();
    });
  }
}

const tabsChange = (key: string) => {
  pageData.value.tabKey = key;
}
/* 字典表单 */
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getDict(id);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
const deleteData = async (id: string, successBack: any) => {
  try {
    const {data} = await deleteDict(id);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const saveForm = () => {
  if (dictModelRef.value) {
    setLoading(true);
    dictModelRef.value?.submitModel(null, (data: QueryDictForm) => {
      // 成功提示、复写数据、重置字典、设置页面信息、重置字典项
      Notification.info(t('sercurity.dict.index.notice.success'));
      queryDictList('', () => {
        const saveSuccess = setTimeout(() => {
          // 页面信息
          pageData.value.params.dictId = data.id;
          pageData.value.params.dictName = data.dicName;
          // 重新加载页面
          loadModelAndList();
          setLoading(false);
          // 选中
          selectedActive(data.id);
        }, 250);
      });
    }, () => {
      setLoading(false);
    });
  }
}
const deleteForm = () => {
  const formId = pageData.value.params.dictId;
  if (formId && formId.trim().length > 0) {
    Modal.open({
      title: t('sercurity.dict.index.modal.title'),
      titleAlign: 'start',
      content: t('sercurity.dict.index.modal.content'),
      cancelText: t('sercurity.dict.index.modal.cancel.text'),
      okText: t('sercurity.dict.index.modal.ok.text'), onOk() {
        deleteData(formId, () => {
          refreshDict();
        });
      }
    });
  } else {
    Notification.warning(t('sercurity.dict.index.notice.warning1'));
  }
}

// 初始页面加载
queryDictList('', () => {
  loadModelAndList();
});

const loadModelAndList = () => {
  // 表单
  if (dictModelRef.value) {
    dictModelRef.value?.loadModel({action: pageData.value.formState, 'id': pageData.value.params.dictId});
  }
  // 列表
  if (dictItemListRef.value) {
    dictItemListRef.value?.loadList({action: pageData.value.formState, pageSize: 5, params: pageData.value.params, isModal: pageData.value.isModal});
  }
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
</style>
