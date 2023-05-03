<script lang="ts">
export default {
  name: 'GlUserSelect'
}
</script>

<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {entityApi} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  /**
   *  是否支持多选
   */
  multipleSelect: {
    type: Boolean,
    default() {
      return false
    }
  },
})

const visible = ref(false)
const searchName = ref('')
const selectedItems = ref<Array<any>>(props.modelValue)
const selectedNames = ref('')
// 所有的人员清单
const userDataItems = ref([])


const searchResult = computed(() => {
  if (!searchName.value) {
    return userDataItems.value
  }
  return userDataItems.value.filter((item: any) => {
    if (item.name.match(searchName.value)) {
      return true
    } else {
      return false
    }
  })
})

const onOpenModal = () => {
  visible.value = true
}
const handleOk = () => {
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

const onRadioClick = (userDataItem: any, index: number) => {
  selectedItems.value.length = 0
  selectedItems.value.push(userDataItem)
  selectedNames.value = userDataItem.name
  emits('update:modelValue', selectedItems.value)
}

const loadUserDataItems = () => {
  return entityApi.query("platform_user", 'id,name', {delStatus: 0}, false)
}

const clearMultipleSelected = (userDataItems: Array<any>) => {
  selectedItems.value.length = 0
  selectedNames.value = ''
}
const clearOneSelected = (userDataItem: any) => {
  const foundIndex = selectedItems.value.findIndex((item) => {
    return item.id === userDataItem.id
  })
  if (foundIndex >= 0) {
    selectedItems.value.splice(foundIndex, 1)
  }
}

loadUserDataItems().then((resp: any) => {
  userDataItems.value = resp.data.data
})
</script>

<template>
  <div>
    <a-input :style="{width:'100%'}" allow-clear v-model="selectedNames" @clear="clearMultipleSelected(selectedItems)">
      <template #prefix>
        <a-button type="primary" @click="onOpenModal" style="margin-left: -12px">
          <GlIconfont type="gl-user"></GlIconfont>
          选择人员
        </a-button>
      </template>
    </a-input>
    <a-modal>
      <a-modal width="800px" v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
        <template #title>
          选择人员
        </template>
        <div style="display: flex;min-height:500px">
          <div style="flex: 1;border-right: 1px solid silver;padding: 0 0.5em">
            <a-input style="width: 100%;margin-bottom: 4px" v-model="searchName"/>
            <template v-if="multipleSelect">

            </template>
            <a-radio-group v-else style="width: 100%" direction="vertical">
              <a-radio v-for="(userDataItem,index) in searchResult"
                       :key="index"
                       :value="userDataItem.id"
                       @click="onRadioClick(userDataItem,index)"
              >
                {{ userDataItem.name }}
              </a-radio>
            </a-radio-group>
          </div>
          <div style="flex: 1;padding: 0 0.5em">
            <div style="line-height: 2.4em">
              <span>已选择({{ selectedItems.length }})</span>
              <a-button type="text" style="float: right">清空</a-button>
            </div>
            <div style="margin-top: 4px">
              <span v-for="item in selectedItems">
                <a-tag closable @close="clearOneSelected(item)">
                  {{ item.name }}
                </a-tag>
              </span>
            </div>
          </div>
        </div>
      </a-modal>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
