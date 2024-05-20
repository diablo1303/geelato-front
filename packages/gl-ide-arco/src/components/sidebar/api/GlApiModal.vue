<script lang="ts">
export default {
  name: 'GlApiModal'
}
export type GlApi = {
  id: string
  creator: string
  updateAt: string
  updaterName: string
  creatorName: string
  name: string
  // action实例的
  sourceContent: string
  // 最终的执行脚本 格式为：function(ctx){}
  releaseContent: string
  remark?: string
}
</script>
<script lang="ts" setup>
import { provide, type Ref, ref, watch, onMounted } from 'vue'
import {
  entityApi,
  EntityReader,
  EntityReaderParam,
  EntitySaver,
  useGlobal,
  utils
} from '@geelato/gl-ui'
import {
  ComponentSetterProvideKey,
  ComponentSetterProvideProxy,
  useAppStore
} from '@geelato/gl-ide'
import { Action } from '@geelato/gl-ui-schema'
import GlCommandEditor from '../../setters/action-setters/GlCommandEditor.vue'
import type { GenerateScriptConfig } from '@/components/setters/action-setters/GlCommandEditor.vue'

const emits = defineEmits(['update:modelValue'])
const global = useGlobal()
const appStore = useAppStore()

const componentSetterProvideProxy = new ComponentSetterProvideProxy()
provide(ComponentSetterProvideKey, componentSetterProvideProxy)

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  apiId: String
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const currentAction = ref(new Action())
// 初始id
currentAction.value.id = utils.gid('api')
const api: Ref<GlApi | undefined> = ref()

const fetchData = async () => {
  if (!props.apiId) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_api'
  entityReader.setFields('id,creator,creatorName,updateAt,updaterName,sourceContent')
  entityReader.params = []
  // entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))
  entityReader.params.push(new EntityReaderParam('id', 'eq', props.apiId))
  entityApi.queryByEntityReader(entityReader).then(
    (res: any) => {
      if (res.data && res.data.length > 0) {
        api.value = res.data[0]
        if (api.value!.sourceContent) {
          currentAction.value = JSON.parse(api.value!.sourceContent)
        }
      }
    },
    () => {
      global.$message.error({ content: `通过接口ID（${props.apiId}）获取应用的接口信息失败` })
    }
  )
}

// apiScriptInst

const save = () => {
  console.log('save', 'xxxxxxxxxxxxxxxx')

  currentAction.value.id = props.apiId
  const entitySaver = new EntitySaver()
  entitySaver.entity = 'platform_api'
  entitySaver.record = {
    id: props.apiId,
    sourceContent: JSON.stringify(currentAction.value),
    releaseContent: currentAction.value.body
  }

  return entityApi.saveEntity(entitySaver).then((res) => {})
}

const generateScriptConfig: GenerateScriptConfig = {
  header: 'function($gl){',
  footer: '}'
}

fetchData()

defineExpose({ save })
</script>

<template>
  <div>
    <!--    <div class="gl-segment" style="background-image: ">-->
    <!--      <div style="width: 100px; text-align: center; padding: 1em 4em">-->
    <!--        <gl-iconfont type="gl-api" style="font-size: 8em"></gl-iconfont>-->
    <!--      </div>-->
    <!--      <div style="padding: 1em">-->
    <!--        <h2>XXX接口</h2>-->
    <!--        <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div></div>-->
    <GlCommandEditor
      :key="currentAction.id"
      :generateScriptConfig="generateScriptConfig"
      v-model:action="currentAction"
      component-store-id="useComponentApiBlockStore"
    ></GlCommandEditor>
  </div>
</template>

<style scoped>
.gl-segment {
  display: flex;
}
</style>
