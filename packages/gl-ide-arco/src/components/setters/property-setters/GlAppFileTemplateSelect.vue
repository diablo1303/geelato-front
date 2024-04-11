<template>
  <a-select v-model="mv.templateId" allow-search>
    <a-option v-for="item in fileTemplates" :value="item.id"
              :class="{'gl-selected':mv.templateId===item.id}">
      {{ item.title }}
    </a-option>
  </a-select>
</template>
<script lang="ts">
export default {
  name: 'GlAppFileTemplateSelect'
}

type FileTemplate = {
  id: string,
  title: string,
  fileType: string
}

export class AppTemplateSelectResult {
  appCode: string = ''
  templateId: string = ''
}
</script>

<script lang="ts" setup>
import {type PropType, type Ref, ref, watch} from 'vue'
import {entityApi, EntityReader} from "@geelato/gl-ui";


const props = defineProps({
  modelValue: {
    type: Object as PropType<AppTemplateSelectResult>,
    default() {
      return new AppTemplateSelectResult()
    }
  },
  /**
   *  类型，useType:'export'、'import'
   */
  useType:{
    type:String
  }
})
const emits = defineEmits(['update:modelValue'])
const fileTemplates: Ref<FileTemplate[]> = ref([])


const fetchData = () => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_export_template'
  entityReader.setFields('id,title,fileType')
  if(props.useType&&['export','import'].includes(props.useType)){
    entityReader.addParam('useType','eq',props.useType)
  }
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    fileTemplates.value = res.data
  })
}

const mv = ref(props.modelValue)
watch(mv, (val) => {
  emits('update:modelValue', val)
}, {deep: true})

fetchData()

// 初始化
// if (props.modelValue && props.modelValue.templateId) {
//   onFileTemplateChange(props.modelValue.templateId)
// }
</script>

<style scoped>

</style>
