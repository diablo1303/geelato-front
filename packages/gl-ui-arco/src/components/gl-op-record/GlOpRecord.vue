<script lang="ts">
export default {
  name: 'GlOpRecord'
}
</script>
<script lang="ts" setup>

import {inject, onUpdated, type Ref, ref} from "vue";
import {entityApi, EntityReader, EntityReaderParam, PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";
import {getFormParams} from "../gl-entity-form/GlEntityForm";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   *  如果组件没有传入，则从页面参数中获取
   */
  recordId: String,
  // 从页面中获取recordId的参数名，如果没有配置，默认通过getFormParams方法，从form.id或$form.id
  recordIdPageParamName: String
})
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const items: Ref<any[]> = ref([])
const fetchData = (opDataId: string) => {
  if (!opDataId) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_oprecord'
  entityReader.setFields('id,opUser,opTime,opUserId,opDescription')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('opDataId', 'eq', opDataId))
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    items.value = res.data
  })
}

const fetch = () => {
  if (props.recordId) {
    fetchData(props.recordId)
  } else {
    // 如果组件没有传入，则从页面参数中获取
    // 若有指定参数名
    if (props.recordIdPageParamName) {
      const recordId = pageProvideProxy.getParamValue(props.recordIdPageParamName)
      if (recordId) {
        fetchData(recordId)
      }
    } else {
      const formParams = getFormParams(pageProvideProxy, undefined)
      if (formParams?.id) {
        fetchData(formParams.id)
      }
    }
  }
}

fetch()

onUpdated(() => {
  // fetchData(props.recordId)
})

interface ContentItem {
  targetName: string,
  op: string,
  content: string,
  isListContent: string
}

const parseToItems = (input: string) => {
  if (!input) return []
  if (input === '新增记录') return ['新增记录']
  return JSON.parse(input)
}

const filter = (content: string) => {
  if (!content) return ''
  if (content.indexOf('更新时间') === 0 || content.indexOf('更新者') === 0) {
    return ''
  }
  if (content.lastIndexOf('修改为') === content.length - 3) {
    return content + '【空】'
  }
  return content
}
const convertDate = (date: string) => {
  return date.substring(0, 10)
}

</script>

<template>
  <div class="gl-op-record">
    <template v-if="items&&items.length>0">
      <div class="gl-item" v-for="item in items">
        <div class="gl-label">
          <a-tag color="#165dff">{{ convertDate(item.opTime) }}</a-tag>
        </div>
        <div class="gl-detail">
          <a-timeline>
            <a-timeline-item label="" lineType="dashed">
              <span class="gl-title">{{ item.opUser }}</span> {{ item.opTime }}
              <br/>
              <!--            <div class="gl-content-item">-->
              <!--              <span class="gl-highlight">订单类型</span><span class="gl-op-type">修改为</span><span-->
              <!--                class="gl-highlight">自拼舱位</span>-->
              <!--            </div>-->
              <div class="gl-content-item" v-for="contentItem in parseToItems(item.opDescription)">
                {{ filter(contentItem) || contentItem }}
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </template>
    <template v-else>
      <a-empty/>
    </template>
  </div>
</template>

<style scoped>
.gl-op-record .gl-item {
  display: flex;
}

.gl-op-record .gl-item .gl-label {
  margin-left: 2em;
  width: 7em;

}

.gl-op-record .gl-item .gl-label .arco-tag {
  border-radius: 4px
}

.gl-op-record .gl-item .gl-detail {
  flex: auto;
}

.gl-op-record .gl-item .gl-detail .gl-title {
  font-weight: 700;
  margin-right: 1em;
}

.gl-op-record .gl-item .gl-detail .gl-content-item {
  margin-top: 4px
}

.gl-op-record .gl-highlight {
  font-weight: 700;
}

.gl-op-record .gl-op-type {
  margin: 0 1em;
}

</style>
