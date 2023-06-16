<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['model.view.index.menu.list', 'model.view.index.menu.list.searchTable']"/>
    <a-card :title="$t('model.view.index.menu.list.searchTable')" class="general-card">
      <ViewList ref="viewListRef"></ViewList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import ViewList from '@/views/model/view/list.vue';

/* 列表 */
const pageData = ref({});
const viewListRef = ref(null);

const loadIndex = () => {
  if (viewListRef.value) {
    // @ts-ignore
    viewListRef.value?.loadList({action: 'edit'});
  }
}

onMounted(() => {
  loadIndex();
});
</script>

<script lang="ts">
export default {
  name: 'SearchTable'
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
