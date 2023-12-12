<script lang="ts">
export default {
  name: 'GlList'
}
</script>
<script lang="ts" setup>
import {type PropType, type Ref, ref, watch, reactive} from 'vue'
import {entityApi, EntityReader} from '@geelato/gl-ui'
import useLoading from "@/hooks/loading";

const {loading, setLoading} = useLoading(true);
const emits = defineEmits(['update:modelValue', 'click', 'reachBottom'])
const props = defineProps({
  label: {type: String, default: ''},
  modelValue: {type: String, default: ''},
  entityReader: {type: Object as PropType<EntityReader>, required: true},
  size: {type: String as PropType<'small' | 'medium' | 'large'>, default: 'medium'},
  bordered: {type: Boolean, default: true},
  split: {type: Boolean, default: true},
  loading: {type: Boolean, default: false},
  hoverable: {type: Boolean, default: false},
  maxHeight: {type: String || Number, default: 0},
  bottomOffset: {type: String || Number, default: 0},
})
const mv = ref(props.modelValue)
const current = ref(1);
const bottom = ref(false);
const data = reactive([]);
const scrollbar = ref(true);
const searchValue = ref('');
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const items: Ref<Record<string, any>[]> = ref([])
const loadData = () => {
  if (props.entityReader) {
    entityApi.queryByEntityReader(props.entityReader).then((res: any) => {
      items.value = res.data
    })
  }
}

const onClick = (item: any) => {
  emits('click', item)
}
const onReachBottom = (item: any) => {
  emits('reachBottom', item);
}
const onRefresh = (ev?: MouseEvent) => {
  loadData();
}
const onSearch = () => {
  if (searchValue.value) {
    // todo
  }
}
loadData()
</script>

<template>
  <a-card class="gl-list general-card"
          :title="label"
          :bordered="false"
          :header-style="{ paddingBottom: '0' }"
          :body-style="{height: '100%',paddingTop: '16px',display: 'flex',flexFlow: 'column',}">
    <a-space :size="8">
      <a-input-search v-model.trim="searchValue" placeholder="搜索" allow-clear @change="onSearch"/>
      <a-button type="text" title="刷新" @click="onRefresh($event)">
        <GlIconfont type="gl-refresh"/>
      </a-button>
    </a-space>
    <div class="chat-panel-content">
      <a-list :size="props.size" @reach-bottom="onReachBottom">
        <a-list-item v-for="(item,index) in items"
                     :key="index"
                     :scrollbar="scrollbar"
                     :max-height="props.maxHeight"
                     :bordered="props.bordered"
                     :split="props.split"
                     :loading="props.loading"
                     :style="{'cursor':'pointer'}" @click="onClick">
          <a-list-item-meta>
            <template #title>
              {{ item.title }}
            </template>
            <template #description>
              {{ item.description }}
            </template>
            <template #avatar>
              <a-avatar shape="square">
                <img alt="avatar" :src="item.icon"/>
              </a-avatar>
            </template>
          </a-list-item-meta>
          <template #actions>
            <icon-edit/>
            <icon-delete/>
          </template>
        </a-list-item>
        <template #empty>
          <a-empty/>
        </template>
        <template #scroll-loading v-if="items.length > 0">
          已经到底啦~
        </template>
      </a-list>
    </div>
  </a-card>
</template>

<style scoped lang="less">

</style>
