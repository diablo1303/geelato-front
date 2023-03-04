<template>
  <gl-draggable
      v-model="glComponentInst.children"
      class="gl-x"
      animation="700"
      handle=".gl-dnd-item"
      itemKey="id"
      ghostClass="gl-dnd-item-ghost"
      dragClass="gl-dnd-item-drag"
      filter=".gl-dnd-placeholder"
      :group="{ name: 'layoutItems',pull:'clone'}"
      :sort="true"
      :scroll="false"
      @add="onAdd($event,glComponentInst.children)"
      @remove="onRemove($event,glComponentInst.children)"
      @start="onStart($event,glComponentInst.children)"
      @end="onEnd($event,glComponentInst.children)"
      @clone="onClone($event,glComponentInst.children)"
      @unchoose="onUnchoose"
  >
    <template #item="{element}">
      <GlComponentRecursion class="gl-dnd-item gl-x-item" :glComponentInst="element">
      </GlComponentRecursion>
    </template>
  </gl-draggable>

</template>
<script lang="ts">
import {defineComponent, nextTick, ref} from 'vue'
import {mixins, utils} from "@geelato/gl-ui"
import {Events} from "@geelato/gl-ide";
import {useIdeStore} from "@geelato/gl-ide";
import type {ComponentInstance, ComponentMaterial} from "@geelato/gl-ui-schema";

type Event = { item: { classList: any, id: any }, pullMode: string, oldIndex: number, newIndex: number }

export default defineComponent({
  name: "GlX",
  mixins:[mixins],
  setup(props, ctx) {
    const componentStore = useIdeStore().componentStore
    const dragging = ref(false)
    const gid = utils.gid('glx')
    let chooseIndex = -1
    const setData = (dataTransfer: DataTransfer, dragEl: HTMLElement) => {
      console.log('setData>', dataTransfer, dragEl)
    }
    const onAdd = (event: any, items: Array<ComponentInstance>) => {
      // 添加之后去掉占位组件
      if (items.length > 0 && items.length < 3) {
        for (let key in items) {
          if (items[key].componentName === 'GlDndPlaceholder') {
            items.splice(Number.parseInt(key), 1)
            break
          }
        }
      }
      let addedItem = items[items.length === 1 ? 0 : event.newIndex]


      console.log('gl-x > onAdd() > addedItem:',addedItem)

      nextTick(() => {
        componentStore.setCurrentSelectedComponentById(addedItem.id)
        ctx.emit(Events.GlIdeStageComponentAdd, {event, addedItem})
      })
    }
    const onStart = (event: Event, items: Array<any>) => {
      dragging.value = true
      let item = items[items.length === 1 ? 0 : event.oldIndex]
      componentStore.currentDragComponentId = item.id
      // console.log('GlX > onStart()', this.gid, event, event.item.classList.contains('gl-drag-start'))
      componentStore.setCurrentSelectedComponentById('')
      if (event.item.classList.contains('gl-drag-start')) {
        return
      }
      event.item.classList.add('gl-drag-start')
      // console.log('GlX > onStart()', event.item.classList.contains('gl-drag-start'), event.item.classList)

    }
    const onEnd = (event: Event, items: Array<any>) => {
      dragging.value = false
      let item = items[items.length === 1 ? 0 : event.newIndex]
      componentStore.currentDragComponentId = ''
      componentStore.setCurrentSelectedComponentById(event.item.id)
      console.log('GlX > onEnd()', gid, event)
      if (event.pullMode === 'clone') {
        console.log('props.glComponentInst.children:', props.glComponentInst.children)
        // 存在placeHolder的情况
        props.glComponentInst.children.splice(event.oldIndex, 1)
      }
      tryAddDndPlaceholder(items)
    }
    const onRemove = (event: Event, items: Array<any>) => {
      console.log('GlX > onRemove()')
    }
    const onChange = () => {

    }
    const onChoose = (event: Event, items: Array<any>) => {
      console.log('GlX > onChoose()')
      // console.log('gl-ide-plugin-layout > sidebar > onChoose: ', event, event.oldIndex)
      chooseIndex = event.oldIndex
    }
    const onUnchoose = (event: Event, items: Array<any>) => {
      console.log('GlX > onUnchoose()')
    }
    const onClone = (event: Event, items: Array<any>) => {
      console.log('GlX > clone()')
      if (chooseIndex < 0) {
        return
      }
      return items[chooseIndex]
    }
    const onDelete = (result: { id: string }) => {
      console.log('onDelete:', result, props.glComponentInst.children)
      // 选清空当前的选择组件信息
      componentStore.setCurrentSelectedComponentId( '')
      componentStore.currentSelectedComponentName = ''
      componentStore.currentSelectedComponentInstance = undefined
      // 再处主页面的显示，是否需要增加Placeholder
      for (let i in props.glComponentInst.children) {
        if (props.glComponentInst.children[i].id === result.id) {
          props.glComponentInst.children.splice(i, 1)
          tryAddDndPlaceholder(props.glComponentInst.children)
          // 设置状态信息
          chooseIndex = -1
          componentStore.setCurrentSelectedComponentId( '')
          componentStore.currentSelectedComponentName = ''
          return true
        }
      }
    }
    /**
     * 清空之后，自动补上占位组件，items.length === 0表示清空
     * @param items
     * @param info
     */
    const tryAddDndPlaceholder = (items: Array<any>, info?: string) => {
      let item = {
        componentName: 'GlDndPlaceholder',
        id: utils.gid('pHolder'),
        props: {
          info: info
        }
      }
      if (items.length === 0) {
        items.push(item)
      }
      return
    }

    return {
      dragging,
      gid,
      chooseIndex,
      onAdd,
      onEnd,
      onStart,
      onRemove,
      onClone,
      onUnchoose
    }
  },
  created() {
    // this.$gl.bus.$on(Events.GlIdeStageComponentDelete, this.onDelete)
  },
  unmounted() {
    // this.$gl.bus.$off(Events.GlIdeStageComponentDelete, this.onDelete)
  }
})
</script>

<style>
/**
 *  解决有时未能将gl-dnd-item-ghost加到元素上的问题
 *  解决方式： .gl-x > *:nth-last-child(2):first-child:not(.gl-dnd-placeholder)[draggable=true], .gl-dnd-placeholder + *
 */
.gl-dnd-item-ghost, .gl-dnd-placeholder + * {
  font-size: 0px !important;
  border-top: solid 2px red !important;
  line-height: 0 !important;
  max-height: 2px !important;
  width: 100%;
  /*padding: 0 !important;*/
  /*margin: 0 !important;*/
  /*display: inline-block;*/
  vertical-align: top !important;
  /*background-color: #178df7 !important;*/
}

/*.gl-dnd-item-ghost > *, .gl-x > *:nth-last-child(2):first-child:not(.gl-dnd-placeholder) > *, .gl-dnd-placeholder + * > * {*/
/*display: none !important;*/
/*!*opacity: 0.1;*!*/
/*}*/

/*.gl-dnd-item.gl-dragenter:not(.gl-dnd-placeholder):before {*/
/*content: '';*/
/*width: 100%;*/
/*height: 2px;*/
/*border-radius: 10px;*/
/*display: inline-block;*/
/*background-color: red;*/
/*}*/

/*.gl-dnd-item-ghost > * {*/
/*!*display: none !important;*!*/
/*}*/

.gl-dnd-item-drag {
  border: 2px red solid;
  /*display: none;*/
}
</style>
