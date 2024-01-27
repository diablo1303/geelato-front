<script lang="ts">
export default {
  name: 'GlAppSelect'
}
</script>
<script lang="ts" setup>
import {inject, onMounted, type Ref, ref, watch} from 'vue'
import { entityApi, EntityReader } from '@geelato/gl-ui'
import {ComponentSetterProvideKey, ComponentSetterProvideProxy} from "@geelato/gl-ide";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  将选择加载的完整应用源数据信息设置到ComponentSetterProvideProxy的上下文环境变量中
   */
  exposeVarAppId: {
    type: String,
    default() {
      return 'appId'
    }
  }
})

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

const apps: Ref<Array<Record<string, any>>> = ref([])

const fetchData = () => {
  const er: EntityReader = new EntityReader()
  er.entity = 'platform_app'
  entityApi.queryByEntityReader(er).then((res) => {
    apps.value = res.data
  })
}

const mv = ref(props.modelValue)
watch(
  mv,
  () => {
    emits('update:modelValue', mv.value)
  }
)
fetchData()

const onChange = (appId:string)=>{
  console.log('appId',appId)
  componentSetterProvideProxy.setVarValue(props.exposeVarAppId, appId)
}

</script>

<template>
  <a-select v-model="mv" allow-search @change="onChange">
    <a-option v-for="item in apps" :value="item.id" :class="{ 'gl-selected': mv === item.id }">
      {{ item.name }}
    </a-option>
  </a-select>
</template>
