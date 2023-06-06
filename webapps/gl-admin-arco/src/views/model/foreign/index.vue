<template v-model="pageData">
  <div class="container">
    <Breadcrumb :items="['model.foreign.index.menu.list', 'model.foreign.index.menu.list.searchTable']"/>
    <a-card :title="$t('model.foreign.index.menu.list.searchTable')" class="general-card">
      <ForeignList ref="foreignListRef"></ForeignList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import ForeignList from '@/views/model/foreign/list.vue';

/* 列表 */
const pageData = ref({});
const foreignListRef = ref(null);

const loadIndex = () => {
  if (foreignListRef.value) {
    foreignListRef.value?.loadList({action: 'edit'});
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
