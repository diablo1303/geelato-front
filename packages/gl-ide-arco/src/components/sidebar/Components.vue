<template>
  <div class="gl-ide-sidebar-components gl-scrollbar-small">
    <div v-for="group in groups">
      <div class="gl-group-title" @click="group.opened=!group.opened"
           style="border-bottom: 1px solid #04559f;width: 90%">
        <span>{{ group.text }} {{ toUpperCase(group.name) }}</span>
        <span class="gl-tag">{{ groupMap[group.name]?.length }}</span>
      </div>
      <div class="gl-group-cards" v-if="group.opened">
        <gl-draggable
            v-model="groupMap[group.name]"
            handle=".gl-dnd-item-template-handle"
            :group="{ name: 'layoutItems', pull: 'clone', put: false }"
            ghostClass="ghost"
            :sort="false"
            :clone="($event)=>getCloneItem($event,groupMap[group.name])"
            @start="drag=true"
            @end="drag=false"
            @change="onChange"
            @choose="($event)=>onChoose($event,groupMap[group.name])"
            itemKey="id"
        >
          <template #item="{element}">
            <div class="gl-card"
                 :class="{'gl-dnd-item-template-handle':element.meta.properties?.length>0}"
                 :style="{'cursor':element.meta.properties?.length>0?'move':''}"
                 @mousedown="onStartNodeDrag($event,element)">
              <div class="gl-image">
                <GlIconfont :type="element.iconType"
                            :iconStyle="{fontSize:'3em',color:(element.meta.properties?.length>0?'#1890ff':'#e7e7e7')}"></GlIconfont>
              </div>
              <div class="gl-title">{{ element.title }}</div>
            </div>
          </template>
        </gl-draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType, ref} from "vue";
import {useIdeStore} from "@geelato/gl-ide";
import {utils} from "@geelato/gl-ui";
import type {ComponentMaterial,ComponentInstance} from "@geelato/gl-ui-schema";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";

type ComponentGroupType = {name:String,text:String,opened:Boolean}
export default defineComponent({
  name: 'GlIdePluginCoreComponents',
  props: {
    componentGroups: {
      type: Array as PropType<Array<ComponentGroupType>>,
      default() {
        return [
          {name: 'general', text: '通用', opened: true},
          {name: 'layout', text: '布局', opened: true},
          {name: 'navigation', text: '导航', opened: true},
          {name: 'dataEntry', text: '数据录入', opened: true},
          {name: 'dataDisplay', text: '数据展示', opened: true},
          {name: 'feedback', text: '反馈', opened: true},
          {name: 'chart', text: '图表', opened: true},
          {name: 'other', text: '其它', opened: true}]
      }
    }
  },
  setup(props) {
    console.log('sidebar components props:',props)
    const ideStore = useIdeStore()
    const componentMaterialStore = useComponentMaterialStore()
    componentMaterialStore.init()
    const drag = ref(false)
    const chooseIndex = ref(-1)
    const groupMap: { [key: string]: Array<ComponentMaterial> } | {} = ref({})
    const groups = ref(props.componentGroups)
    const getComponentMaterialByGroupName = (groupName: string) => {
      console.log('groupName:',groupName, componentMaterialStore.componentMaterials)
      return componentMaterialStore.componentMaterials.filter((item) => {
        return item.group === groupName
      })
    }

    const toUpperCase = (str: string) => {
      return str[0].toUpperCase() + str.substring(1)
    }

    const onChoose = (event: any, fromItems: Array<ComponentMaterial>) => {
      chooseIndex.value = event.oldIndex
      const item = JSON.parse(JSON.stringify(fromItems[chooseIndex.value].instance))
    }
    const onChange = () => {
    }
    const resetComponentMaterialGroup = () => {
      for (let groupKey in groups.value) {
        // @ts-ignore
        const groupName: string = groups.value[groupKey].name
        // @ts-ignore
        groupMap.value[groupName] = getComponentMaterialByGroupName(groupName)
        // @ts-ignore
        console.log('groupMap.value[groupName] :',groupMap.value[groupName] )
      }
      // console.log('groupMap:', groupMap)
    }
    resetComponentMaterialGroup()
    const onStartNodeDrag = (e: MouseEvent, element: Object) => {
      // this.$gl.bus.$emit('GlPluginCore_onStartNodeDrag', {e: e, element: element})
    }

    /**
     * 复制实例信息
     * @param event clone事件
     * @param fromItems clone对象来源的对象数组
     */
    const getCloneItem = (event: any, fromItems: Array<ComponentMaterial>) => {
      const item = JSON.parse(JSON.stringify(fromItems[chooseIndex.value].instance))

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
        console.log('gl-runtime > gl-x > getCloneItem return', item)
        // console.log(JSON.stringify(item))
        return item
      }

      let result = generateId(item)
      // console.log('gl-runtime > gl-x > clone > return', result)
      return result
    }

    return {
      componentMaterialStore,
      refreshFlag: false,
      groupMap,
      chooseIndex,
      drag,
      groups,
      toUpperCase,
      resetComponentMaterialGroup,
      getCloneItem,
      onChoose,
      onChange,
      onStartNodeDrag
    };
  },
  created() {
    this.resetComponentMaterialGroup()
  },
  mounted() {
  }
});
</script>

<style>
</style>