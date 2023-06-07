<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['model.table.index.menu.list', 'model.table.index.menu.list.searchTable']"/>
    <a-card :title="$t('model.table.index.menu.list.searchTable')" class="general-card">
      <TableList ref="tableListRef"></TableList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import TableList from '@/views/model/table/list.vue';

/* 列表 */
const pageData = ref({});
const tableListRef = ref(null);

const loadIndex = () => {
  if (tableListRef.value) {
    // @ts-ignore
    tableListRef.value?.loadList({action: 'edit'});
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
