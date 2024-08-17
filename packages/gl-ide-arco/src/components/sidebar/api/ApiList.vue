<script lang="ts">
export default {
  name: 'ApiList',
}
</script>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {utils} from '@geelato/gl-ui'

type Item = {
  id: string
  name: string
  code: string
  remark?: string
  groupName: string
  creator: string
  updateAt: string
  updaterName: string
  creatorName: string
  enableStatus: boolean
}

const emits = defineEmits(['update:modelValue', 'openModal', 'editApiModel', 'deleteApiModel']);
const props = defineProps({
  modelValue: {type: Array<Item>, default: []}
});
const renderItems = ref<Item[]>([])

const openModal = (item: Item) => {
  emits('openModal', item);
}
const editApiModel = (item: Item) => {
  emits('editApiModel', item);
}
const deleteApiModel = (item: Item) => {
  emits('deleteApiModel', item);
}

watch(() => props, () => {
  renderItems.value = props.modelValue || [];
}, {deep: true, immediate: true});
</script>

<template>
  <a-list size="small">
    <template v-for="(item,index) in renderItems" :key="index">
      <a-list-item style="cursor: pointer;" @click="openModal(item)" action-layout="vertical" title="编辑接口脚本">
        <a-list-item-meta>
          <template #title>
            <span :title="item.name">{{ item.name }}</span>
          </template>
          <template #description>
            <span :title="item.remark || item.code">{{ item.remark || item.code }}</span>
          </template>
        </a-list-item-meta>
        <template #extra>
            <span class="gl-actions-description" :title="`${item.updaterName||''}更新@${item.updateAt}`">
              {{ utils.timeAgo(item.updateAt) }}
            </span>
        </template>
        <template #actions>
          <a-tooltip content="编辑接口信息" position="top">
            <a-button size="small" type="text" style="height: 16px;padding: 0;" @click.stop="editApiModel(item)">
              <gl-iconfont type="gl-edit-square"/>
            </a-button>
          </a-tooltip>
          <a-popconfirm content="是否删除该条数据？" position="bl" type="warning" @ok="deleteApiModel(item)">
            <a-tooltip content="删除接口" position="top">
              <a-button size="small" type="text" status="danger" style="height: 16px;padding: 0;" @click.stop>
                <gl-iconfont type="gl-delete"/>
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>
