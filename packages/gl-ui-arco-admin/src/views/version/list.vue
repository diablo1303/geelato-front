<script lang="ts">
export default {
  name: 'GlAppVersionList'
};
</script>
<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import type {PageQueryFilter, PageQueryRequest, QueryAppForm, QueryAppVersionForm} from '@geelato/gl-ui';
import {utils, applicationApi, versionApi} from '@geelato/gl-ui'
import useLoading from '../../hooks/loading';
import type {Pagination} from "../../types/global";
import {getPackageSourceMark, packageStatusOptions} from "./searchTable";

// 页面所需 参数
type PageParams = {
  versionInfo?: string; // 版本信息
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

interface QueryForm extends QueryAppVersionForm {
  sort: number;
  active: boolean;
}

const emits = defineEmits(['update:modelValue', 'listSelected']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'edit'}, // 页面状态
  pageSize: {type: Number, default: 10000}, // 列表 - 条数
  height: {type: Number, default: 500}, // 列表 - 数据列表高度，滑动条高度
});

const {t} = useI18n();// 国际化
const {loading, setLoading} = useLoading(false);
const noMoreData = ref(false);// 没有更多数据
const scrollbar = ref(true);
const dataSource = ref<QueryForm[]>([]);
const renderData = ref<QueryForm[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const orderBy = ref<string>("packetTime|desc");
const searchText = ref<string>('');// 搜索框内容
const selectedKey = ref<string>(props.modelValue);

const generateRenderItems = () => {
  if (!searchText.value) {
    renderData.value.length = 0
    renderData.value.push(...dataSource.value)
  } else {
    renderData.value = dataSource.value.filter((item) => {
      return (
          item.version.indexOf(searchText.value) !== -1 || item.version?.indexOf(searchText.value) !== -1
      )
    })
  }
}

const selectItemMeta = (item: QueryForm) => {
  item.active = true;
  for (let i = 0; i < dataSource.value.length; i += 1) {
    if (dataSource.value[i].id !== item.id) {
      dataSource.value[i].active = false;
    }
  }
  selectedKey.value = item.id;
  emits('listSelected', item);
}

const fetchData = async () => {
  setLoading(true);
  try {
    const {data} = await versionApi.pageQueryAppVersions({
      ...basePagination, ...props.parameter, order: orderBy.value, version: searchText.value,
    } as PageQueryRequest)
    if (data.items && data.items.length > 0) {
      for (let i = 0; i < data.items.length; i += 1) {
        dataSource.value.push({
          ...data.items[i],
          sort: i + 1 + (basePagination.current - 1) * basePagination.pageSize,
          active: false,
        } as unknown as QueryForm);
      }
    }
    basePagination.current += 1
    noMoreData.value = data.total <= dataSource.value.length;
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    generateRenderItems();
    selectItemMeta(dataSource.value.find(item => item.id === selectedKey.value) || {} as QueryForm);
  }
}

const resetVersion = () => {
  searchText.value = '';
  selectedKey.value = props.modelValue || '';
  noMoreData.value = false;
  dataSource.value.length = 0;
  basePagination.current = 1;
  fetchData();
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  searchText.value = '';
  selectedKey.value = props.modelValue || '';
  noMoreData.value = false;
  dataSource.value.length = 0;
  basePagination.current = 1;
  generateRenderItems();
  selectItemMeta({id: selectedKey.value} as QueryForm);
}

watch(() => props, (val) => {
  if (props.visible === true) {
    if (selectedKey.value !== props.modelValue) resetVersion();
  }
}, {deep: true, immediate: true});

watch(searchText, () => {
  generateRenderItems()
})
</script>

<template>
  <a-space style="justify-content: flex-start;min-width: 295px;">
    <a-input-search v-model="searchText" allow-clear placeholder="版本查询" style="min-width: 250px;"/>
    <a-button style="height: 27px;" type="outline" @click="resetVersion">
      <template #icon>
        <a-tooltip content="重置">
          <icon-refresh/>
        </a-tooltip>
      </template>
    </a-button>
  </a-space>
  <a-divider style="margin: 5px 0px;"/>
  <a-scrollbar :style="{overflow:'auto',height:`${props.height}px`}">
    <a-list :bordered="false" :loading="loading"
            class="version-list" size="small" @reach-bottom="fetchData">
      <template #scroll-loading>
        <div v-if="noMoreData">~ 没有更多的数据 ~</div>
        <a-spin v-else/>
      </template>
      <a-list-item v-for="(item,index) of renderData" :key="index" :class="item.active?'active':''"
                   action-layout="vertical">
        <a-list-item-meta style="cursor: pointer;" @click="selectItemMeta(item)">
          <template #title>
            {{ `${item.sort},` }}
            <span v-if="item.version===parameter.versionInfo" style="font-weight: bold;">{{ ` ${item.version}` }}</span>
            <span v-else>{{ ` ${item.version}` }}</span>
          </template>
          <template #description>
            <div :title="item.description"
                 style="display: -webkit-box;overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
              {{ item.description }}
            </div>
            <div>
              <a-tooltip content="版本来源">
                <span :style="{color:'#165DFF'}">{{ getPackageSourceMark(item.packageSource) }}</span>
              </a-tooltip>
              <span> | </span>
              <a-tooltip content="版本状态">
                <span v-if="item.version===parameter.versionInfo" style="color: #165DFF;font-weight: bold;">当前版本</span>
                <span v-else :style="{color:`${['draft','unused'].includes(item.status)?'#FF7D00':'#165DFF'}`}">
                {{ utils.getOptionLabel(item.status, packageStatusOptions) }}
              </span>
              </a-tooltip>
              <span> | </span>
              <span>{{ item.packetTime || item.createAt }}</span>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-scrollbar>
</template>

<style lang="less">
.version-list .arco-list-item {
  padding: 1px 14px 1px 0px !important;
}

.version-list .arco-list-item .arco-list-item-main {
  margin-left: 8px !important;
}

.version-list .arco-list-item.active {
  background-color: rgb(var(--primary-1)) !important;
}

.version-list .arco-list-item-meta-title {
  white-space: nowrap;
}

.version-list .arco-list-item-meta-description {
  font-size: 11px;
}

.version-list .arco-list-item-action {
  font-size: 13px;
  margin-top: 0px !important;
}

.version-list .list-action-button-default {
  cursor: auto;
  font-size: 11px;
  height: 16px;
  line-height: 16px;
  padding: 0 3px;
  margin-left: 2px;
  border-radius: 5px;
  /*  color: var(--color-text-3) !important;
    border-color: 1px solid var(--color-text-3) !important;*/
}
</style>