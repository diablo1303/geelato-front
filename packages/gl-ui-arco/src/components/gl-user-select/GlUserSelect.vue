<script lang="ts">
export default {
  name: 'GlUserSelect'
}
</script>

<script setup lang="ts">
import { computed, inject, type PropType, ref, watch } from 'vue'
import {
  entityApi,
  EntityReader,
  EntityReaderParam,
  FieldMeta,
  PageProvideKey,
  PageProvideProxy, utils
} from '@geelato/gl-ui'

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
  /**
   *  0；内部账号
   *  1、外部账号
   *  2、系统账号
   *  默认为内部账号
   */
  userTypes:{
    type: Array as PropType<Array<string>>,
    default(){
      return ['0']
    }
  }
})

const visible = ref(false)
const searchName = ref('')
const selectedNames = ref('')
/**
 *  正在选择的人，未更新选人组件上
 */
const selectingItems = ref<Array<UserDataItem>>([])
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

  if (props.nameFieldBindComponentId) {
    const ids = props.nameFieldBindComponentId.split(',')
    ids.forEach((id: string) => {
      pageProvideProxy.setComponentValue(id, selectedNames.value)
    })
  }

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
  reader.fields.push(new FieldMeta('id', '', 'ID'))
  reader.fields.push(new FieldMeta('name', '', '名称'))
  reader.params = []
  reader.params.push(new EntityReaderParam('enableStatus', 'eq', 1))
  if (ids && ids.length > 0) {
    if (ids.length === 1) {
      reader.params.push(new EntityReaderParam('id', 'eq', ids[0]))
    } else {
      reader.params.push(new EntityReaderParam('id', 'in', ids))
    }
  }
  // 去掉空值，因存在[""]的情况
  const types = props.userTypes.filter((item: any) => {
    return !utils.isEmpty(item)
  })
  if(types&&types.length > 0) {
    reader.params.push(new EntityReaderParam('type', 'in', types))
  }
  return entityApi.queryByEntityReader(reader)
}

const init = () => {
  // 基于输入的参数，或当前控件已选中的信息，设置弹出面板中的选择人员信息
  selectedIds.value = props.modelValue
  // console.log('init(), selectedIds.value is ', selectedIds.value, 'props.modelValue is', props.modelValue)
  if (selectedIds.value) {
    loadUserDataItems([selectedIds.value]).then((resp: any) => {
      resp.data.forEach((dataItem: UserDataItem) => {
        setUserSelectingInfo(dataItem)
        selectedNames.value = dataItem.name
        pageProvideProxy.setComponentValue(props.nameFieldBindComponentId, selectedNames.value)
      })
    })
  } else {
    selectingItems.value.length = 0
    selectedNames.value = ''
  }
}

/**
 *  打开选人窗口前
 */
const onBeforeOpen = () => {
  if (userDataItems.value.length === 0) {
    loadUserDataItems().then((resp: any) => {
      userDataItems.value = resp.data
    })
  } else {
    const userIds = props.modelValue || selectedIds.value
    console.log('setSelectInfo(), userId is ', userIds, 'props.modelValue is', props.modelValue)
    if (userIds) {
      loadUserDataItems([userIds]).then((resp: any) => {
        resp.data.forEach((dataItem: UserDataItem) => {
          setUserSelectingInfo(dataItem)
        })
      })
    }
  }
}

const setUserSelectingInfo = (userDataItem: UserDataItem, index?: number) => {
  // console.log('setUserSelectingInfo', userDataItem)
  selectingItems.value.length = 0
  selectingItems.value.push(userDataItem)
  selectingNames.value = userDataItem.name
  selectingIds.value = userDataItem.id
}

const clearMultipleSelected = (userDataItems: Array<any>) => {
  selectingItems.value.length = 0
  selectedNames.value = ''
  selectedIds.value = ''
  emits('update:modelValue', selectedIds.value)
}
const clearOneSelected = (userDataItem: any) => {
  console.log('selectingItems', selectingItems, userDataItem)
  const foundIndex = selectingItems.value.findIndex((item) => {
    return item.id === userDataItem.id
  })
  if (foundIndex >= 0) {
    selectingItems.value.splice(foundIndex, 1)
  }
  const ids: string[] = []
  const names: string[] = []
  selectingItems.value.forEach((item) => {
    ids.push(item.id)
    ids.push(item.name)
  })
  selectingNames.value = names.join(',')
  selectingIds.value = names.join(',')
}

init()
watch(
  () => {
    return props.modelValue
  },
  () => {
    init()
  }
)
</script>

<template>
  <div class="gl-user-select">
    <a-input
      :style="{ width: '100%' }"
      allow-clear
      v-model="selectedNames"
      @clear="clearMultipleSelected(selectingItems)"
      readonly
    >
      <template #prefix>
        <a-button type="primary" @click="onOpenModal" style="margin-left: -12px" title="选择人员">
          <GlIconfont type="gl-user"></GlIconfont>
        </a-button>
      </template>
    </a-input>
    <a-modal
      width="800px"
      v-model:visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      @beforeOpen="onBeforeOpen"
      draggable
    >
      <template #title> 选择人员</template>
      <div style="display: flex; min-height: 500px; overflow-y: hidden; margin: -14px">
        <div
          style="
            flex: 1;
            border-right: 1px solid silver;
            padding: 0 0.5em;
            height: 500px;
            overflow-y: scroll;
          "
        >
          <a-input style="width: 100%; margin-bottom: 4px" v-model="searchName" />
          <template v-if="multipleSelect"></template>
          <a-radio-group v-else style="width: 100%" direction="vertical" v-model="selectingIds">
            <a-radio
              v-for="(userDataItem, index) in searchResult"
              :key="index"
              :value="userDataItem.id"
              @click="setUserSelectingInfo(userDataItem, index)"
            >
              {{ userDataItem.name }}
            </a-radio>
          </a-radio-group>
        </div>
        <div style="flex: 1; padding: 0 0.5em">
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
  </div>
</template>

<style scoped></style>
