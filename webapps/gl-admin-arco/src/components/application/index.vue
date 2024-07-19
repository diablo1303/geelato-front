<template>
  <a-list :data="appOptions" style="margin-top: 60px;" class="list-layout">
    <template #item="{ item, index }">
      <a-list-item :key="index" class="list-item" action-layout="vertical">
        <a-list-item-meta class="list-item-meta">
          <template #title>
            {{ item.name }}
          </template>
          <template #description>
            {{ item.description }}
          </template>
          <template #avatar>
            <a-avatar shape="circle" :style="{ backgroundColor: '#ffffff' }" class="list-item-meta-avatar">
              <img alt="avatar" :src="item.logo"/>
            </a-avatar>
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-space class="list-item-actions">
            <a-tooltip content="编辑" position="top">
              <icon-edit class="list-item-actions-icon"/>
            </a-tooltip>
            <a-tooltip content="删除" position="top">
              <icon-delete class="list-item-actions-icon"/>
            </a-tooltip>
          </a-space>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
export default {
  name: 'ApplicationList'
}
</script>
<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {useUserStore} from "@/store";
import {QueryAppForm, queryApps} from "@/api/application";
import favicon from '@/assets/favicon.ico';

// 国际化
const {t} = useI18n();
const route = useRoute();
const userStore = useUserStore();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || userStore.tenantCode as string
});

const appOptions = ref<QueryAppForm[]>();

const queryOptions = async (successBack?: any, failBack?: any) => {
  try {
    const {data} = await queryApps();
    appOptions.value = data;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of appOptions.value) {
      if (!item.logo) {
        item.logo = favicon;
      }
    }
    // eslint-disable-next-line no-unused-expressions
    successBack && successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-unused-expressions
    failBack && failBack(err);
  }
}

/* 对外调用方法 */
const loadModel = () => {
  queryOptions();
}
loadModel();
</script>

<style lang="less" scoped>
.list-layout {
  .list-item {
    cursor: pointer;
    padding: 10px 10px !important;
    border-bottom: 1px solid var(--color-fill-3);

    &-meta {
      &-avatar {
      }
    }

    &-actions {
      &-icon {
        cursor: pointer;
        font-size: 16px;
        margin-left: 10px;
        color: #3370ff;
      }
    }
  }
}

.list-layout .list-item > .arco-list-item-main > .arco-list-item-action {
  display: flex;
  flex-wrap: nowrap;
  align-self: center;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-direction: row-reverse;
}
</style>