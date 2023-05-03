<template>
  <div class="gl-ide-sidebar-components gl-scrollbar-small">
    <div v-for="componentMaterialGroup in componentMaterialGroups">
      <div class="gl-group-title" @click="componentMaterialGroup.opened=!componentMaterialGroup.opened"
           style="border-bottom: 1px solid #04559f;width: 90%">
        <span :title="componentMaterialGroup.name">{{ componentMaterialGroup.text }}</span>
        <span class="gl-tag">{{ componentMaterialGroup.items?.length }}</span>
      </div>
      <div class="gl-group-cards" v-if="componentMaterialGroup.opened">
        <ComponentsDndItem v-for="element in componentMaterialGroup.items" :element="element" :templateInst="createTemplateInst(element)" :size="size">
        </ComponentsDndItem>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlIdePluginCoreComponents'
}
</script>

<script setup lang="ts">
import {computed, type PropType, ref} from "vue";
import {useIdeStore} from "@geelato/gl-ide";
import {utils} from "@geelato/gl-ui";
import {type ComponentMaterial, ComponentMaterialGroup, type ComponentInstance} from "@geelato/gl-ui-schema";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import ComponentsDndItem from "../../dnd/ComponentDndItem.vue";

const enum SizeType {
  normal = 'normal',
  small = 'small',
  mini = 'mini'
}

const props = defineProps({
  size: {
    type: String as PropType<SizeType>,
    default() {
      return 'small'
    }
  },
  componentGroups: {
    type: Array as PropType<Array<ComponentMaterialGroup>>,
    default() {
      return [
        {name: 'layout', text: '布局', opened: true},
        {name: 'navigation', text: '导航', opened: false},
        {name: 'dataEntry', text: '表单', opened: true},
        {name: 'dataDisplay', text: '展示', opened: true},
        {name: 'feedback', text: '反馈', opened: true},
        {name: 'chart', text: '图表', opened: true},
        {name: 'other', text: '其它', opened: true}]
    }
  }
})

const fontSize = computed(() => {
  switch (props.size) {
    case SizeType.normal:
      return '3em'
    case SizeType.small:
      return '2em'
    case SizeType.mini:
      return '1em'
    default:
      return '2em'
  }
})

const ideStore = useIdeStore()
const componentMaterialStore = useComponentMaterialStore()
componentMaterialStore.initRegisterComponentMetas()
const drag = ref(false)
const chooseIndex = ref(-1)


const toUpperCase = (str: String) => {
  if (str.indexOf('_') !== -1)
    return str
  return str[0].toUpperCase() + str.substring(1)
}

const onChoose = (event: any, fromItems: Array<ComponentMaterial>) => {
  chooseIndex.value = event.oldIndex
  const item = JSON.parse(JSON.stringify(fromItems[chooseIndex.value].instance))
}
const onChange = () => {
}
const componentMaterialGroups = ref(new Array<ComponentMaterialGroup>())

const resetComponentMaterialGroups = () => {
  componentMaterialGroups.value = []
  for (let index in props.componentGroups) {
    const componentMaterialItems = componentMaterialStore.componentMaterials.filter((componentMaterial: ComponentMaterial) => {
      return componentMaterial.group === props.componentGroups[index].name
    })
    const componentMaterialGroup = new ComponentMaterialGroup()
    componentMaterialGroup.name = props.componentGroups[index].name
    componentMaterialGroup.text = props.componentGroups[index].text
    componentMaterialGroup.opened = props.componentGroups[index].opened
    componentMaterialGroup.items = componentMaterialItems
    componentMaterialGroups.value.push(componentMaterialGroup)
  }
}
resetComponentMaterialGroups()
const onStartNodeDrag = (e: MouseEvent, element: Object) => {
  // this.$gl.bus.$emit('GlPluginCore_onStartNodeDrag', {e: e, element: element})
}

/**
 * 基于物料创建实例
 * @param element 物料元素
 */
const createTemplateInst = (element:ComponentMaterial) => {
  const item = JSON.parse(JSON.stringify(element.instance))
  item._isTemplateInst = true
  // 更改id
  function generateId(item: ComponentInstance) {
    // @ts-ignore
    let alias = ideStore.componentAlias[item.componentName]
    if (!alias) {
      console.warn('组件[', item.componentName, ']未设置别名，将直接生成无组件别名前缀的组件id。')
    }
    item.id = utils.gid(alias || '')
    // console.log('gl-runtime > gl-x > clone > generateId > new id:', item.id, 'for', item.componentName)
    if (item.children && item.children.length > 0) {
      for (let i in item.children) {
        item.children[i] = generateId(item.children[i])
        // console.log('gl-runtime > gl-x > clone > child item:', item.children[i])
      }
    }
    console.log('gl-runtime > gl-x > createTemplateInst return', item)
    // console.log(JSON.stringify(item))
    return item
  }

  let result = generateId(item)
  // console.log('gl-runtime > gl-x > clone > return', result)
  return result
}


resetComponentMaterialGroups()
</script>

<style>
</style>