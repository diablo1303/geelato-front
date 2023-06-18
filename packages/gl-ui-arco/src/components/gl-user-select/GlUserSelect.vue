<script lang="ts">
export default {
  name: 'GlUserSelect'
}
</script>

<script setup lang="ts">

import {computed, inject, ref, watch} from "vue";
import {entityApi, EntityReader, EntityReaderParam, FieldMeta, PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

/**
 *  需各loadUserDataItems方法中加载的数据列保持一致
 */
class UserDataItem {
  id: string = ''
  name: string = ''
}


const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   *  值为一个用户id，如果是多选模式，则是多个id中间用“,”分隔
   */
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  userId: {
    type: String,
    default() {
      return ''
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
  /**
   *  选择的名称绑定的组件id
   *  在选择人员时，同时将名称值绑定到另一个组件中，如果不设置，则不需绑定
   */
  nameFieldBindComponentId: {
    type: String,
    default() {
      return ''
    }
  },
})

const visible = ref(false)
const searchName = ref('')
const selectingItems = ref<Array<UserDataItem>>([])
const selectedNames = ref('')
/**
 *  正在选择的人，未更新选人组件上
 */
const selectingNames = ref('')
const selectingIds = ref('')
const selectedIds = ref('')
// 所有的人员清单
const userDataItems = ref<Array<UserDataItem>>([])


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
  selectedNames.value = selectingNames.value
  selectedIds.value = selectingIds.value
  pageProvideProxy.setComponentValue(props.nameFieldBindComponentId, selectedNames.value)
  emits('update:modelValue', selectedIds.value)
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

const loadUserDataItems = (ids?: Array<any>) => {
  const reader = new EntityReader()
  reader.entity = 'platform_user'
  reader.fields = []
  reader.fields.push(new FieldMeta('ID', 'id'))
  reader.fields.push(new FieldMeta('名称', 'name'))
  reader.params = []
  reader.params.push(new EntityReaderParam('delStatus', 'eq', 0))
  if (ids && ids.length > 0) {
    if (ids.length === 1) {
      reader.params.push(new EntityReaderParam('id', 'eq', ids[0]))
    } else {
      reader.params.push(new EntityReaderParam('id', 'in', ids))
    }
  }
  return entityApi.queryByEntityReader(reader)
}


const init = () => {
  // 基于输入的参数，或当前控件已选中的信息，设置弹出面板中的选择人员信息
  selectedIds.value = props.modelValue
  console.log('init(), selectedIds.value is ', selectedIds.value, 'props.modelValue is', props.modelValue)
  if (selectedIds.value) {
    loadUserDataItems([selectedIds.value]).then((resp: any) => {
      resp.data.data.forEach((dataItem: UserDataItem) => {
        setUserSelectingInfo(dataItem)
        selectedNames.value = dataItem.name
        pageProvideProxy.setComponentValue(props.nameFieldBindComponentId, selectedNames.value)
      })
    })
  }
}


/**
 *  打开选人窗口前
 */
const onBeforeOpen = () => {
  if (userDataItems.value.length === 0) {
    loadUserDataItems().then((resp: any) => {
      userDataItems.value = resp.data.data
    })
  } else {
    const userIds = props.modelValue || selectedIds.value
    console.log('setSelectInfo(), userId is ', userIds, 'props.modelValue is', props.modelValue)
    if (userIds) {
      loadUserDataItems([userIds]).then((resp: any) => {
        resp.data.data.forEach((dataItem: UserDataItem) => {
          setUserSelectingInfo(dataItem)
        })
      })
    }
  }
}


const setUserSelectingInfo = (userDataItem: UserDataItem, index?: number) => {
  console.log('setUserSelectingInfo', userDataItem)
  selectingItems.value.length = 0
  selectingItems.value.push(userDataItem)
  selectingNames.value = userDataItem.name
  selectingIds.value = userDataItem.id
}


const clearMultipleSelected = (userDataItems: Array<any>) => {
  selectingItems.value.length = 0
  selectedNames.value = ''
}
const clearOneSelected = (userDataItem: any) => {
  const foundIndex = selectingItems.value.findIndex((item) => {
    return item.id === userDataItem.id
  })
  if (foundIndex >= 0) {
    selectingItems.value.splice(foundIndex, 1)
  }
}

init()
watch(() => {
  return props.modelValue
}, () => {
  init()
})
</script>

<template>
  <div>
    <a-input :style="{width:'100%'}" allow-clear v-model="selectedNames" @clear="clearMultipleSelected(selectingItems)">
      <template #prefix>
        <a-button type="primary" @click="onOpenModal" style="margin-left: -12px">
          <GlIconfont type="gl-user"></GlIconfont>
          选择人员
        </a-button>
      </template>
    </a-input>
    <a-modal>
      <a-modal width="800px" v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" @beforeOpen="onBeforeOpen">
        <template #title>
          选择人员
        </template>
        <div style="display: flex;min-height:500px">
          <div style="flex: 1;border-right: 1px solid silver;padding: 0 0.5em">
            <a-input style="width: 100%;margin-bottom: 4px" v-model="searchName"/>
            <template v-if="multipleSelect">

            </template>
            <a-radio-group v-else style="width: 100%" direction="vertical" v-model="selectingIds">
              <a-radio v-for="(userDataItem,index) in searchResult"
                       :key="index"
                       :value="userDataItem.id"
                       @click="setUserSelectingInfo(userDataItem,index)"
              >
                {{ userDataItem.name }}
              </a-radio>
            </a-radio-group>
          </div>
          <div style="flex: 1;padding: 0 0.5em">
            <div style="line-height: 2.4em">
              <span>已选择({{ selectingItems.length }})</span>
<!--              <a-button type="text" style="float: right">清空</a-button>-->
            </div>
            <div style="margin-top: 4px">
              <span v-for="item in selectingItems">
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