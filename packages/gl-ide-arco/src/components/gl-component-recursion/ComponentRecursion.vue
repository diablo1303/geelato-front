<template>
  <component v-if="glComponentInst" :id="glComponentInst.id" :ref="glComponentInst.id"
             :class="{'gl-hover':componentStore.currentHoverComponentId===glComponentInst.id,'gl-selected':componentStore.currentSelectedComponentId===glComponentInst.id}"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
             :style="glComponentInst.style"
             :glComponentInst="glComponentInst"
             :parentId="glComponentInst.id"
             :glChildren="glComponentInst.children"
             @click="onClick"
             @mouseover="onMouseOver"
             @mouseleave="onMouseLeave"
             @dragenter="onDragEnter"
             @dragleave="onDragLeave"
             @start="onStart($event,glComponentInst)"
             @end="onEnd($event,glComponentInst)"
  >
    <!-- 通过加入空span 解决按钮组件动态slot时，按钮大小不随内容变化的问题-->
    <template v-for="(slotItem,slotName) in glComponentInst.slots">
      <component :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style" v-slot:[slotName]></component>
      <!--<GlIconfont :type="slotItem.gl_font_class"></GlIconfont>  -->
<!--      <template v-if="slotItem.handler==='ComponentHandler'">-->
<!--        <component :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style"-->
<!--                   v-slot:[slotName]></component>-->
<!--        &lt;!&ndash; 用于按钮附加文本 &ndash;&gt;-->
<!--        &lt;!&ndash; {{slotItem.props.gl_text}} &ndash;&gt;-->
<!--      </template>-->
<!--      <template v-else-if="slotItem.handler==='FunctionHandler'">-->
<!--        TODO FunctionHandler-->
<!--      </template>-->
<!--      &lt;!&ndash;  在组件内直接插入html&ndash;&gt;-->
<!--      <div v-else-if="slotItem.handler==='HtmlHandler'" v-html="slotItem.props.html">-->
<!--      </div>-->
    </template>
    <GlComponentRecursion v-for="childElement in getChildElements(glComponentInst)"
                          :glComponentInst="childElement"></GlComponentRecursion>
  </component>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {mixins} from "@geelato/gl-ui";
import {useIdeStore} from "@geelato/gl-ide";

export default defineComponent({
  name: "GlComponentRecursion",
  props: mixins.props,
  emits:['onComponentClick','onComponentMounted'],
  setup(props, ctx) {
    const componentStore = useIdeStore().componentStore

    const onClick = () => {
      console.log('gl-component > onClick() > arguments:', arguments, props.glComponentInst)
      // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
      for (let i in arguments) {
        let event = arguments[i]
        if (event && typeof event.stopPropagation === 'function') {
          event.stopPropagation()
        }
      }
      componentStore.setCurrentSelectedComponentById(props.glComponentInst.id)
      ctx.emit('onComponentClick', {arguments: arguments, glComponentInst: props.glComponentInst})
    }
    const onMouseOver = () => {
      for (let i in arguments) {
        let event = arguments[i]
        if (event && typeof event.stopPropagation === 'function') {
          event.stopPropagation()
        }
      }
      componentStore.setCurrentHoverComponentId(props.glComponentInst.id)
      componentStore.currentHoverComponentName = props.glComponentInst.id
    }
    const onMouseLeave = () => {
      for (let i in arguments) {
        let event = arguments[i]
        if (event && typeof event.stopPropagation === 'function') {
          event.stopPropagation()
        }
      }
      componentStore.currentHoverComponentId = ''
      // componentStore.currentHoverComponentName = ''
    }
    const onStart = (event:any, glComponentInst:any) => {
    }
    const onEnd = (event:any, glComponentInst:any) => {
    }
    const onDragEnter = (event:DragEvent) => {
      console.log('onDragEnter() > event:', event)
      if (event?.target?.classList.contains('gl-drag-enter')) {
        return
      }
      event.target.classList.add('gl-drag-enter')
    }
    const onDragLeave = (event) => {
      console.log('onDragLeave() > event:', event)
      if (event.target.classList.contains('gl-drag-enter')) {
        event.target.classList.remove('gl-drag-enter')
      }
    }
    return {
      componentStore,
      onClick,
      onMouseOver,
      onMouseLeave,
      onDragEnter,
      onDragLeave,
      onStart,
      onEnd
    }
  },
  mounted() {
    console.log('GlComponentRecursion > glComponentInst:', this.glComponentInst.id, this.glComponentInst)
    console.log('GlComponentRecursion > this.$el:', this.$el, this.onMouseover)
    // 一些组件不能通过 <component :id='xxx'></component>的方式来绑定id，需这里再设置一次
    // 如无根节点的组件、svg等
    // 相应的事件也需通过dom操作进行绑定
    // if (!this.$el.getAttribute('id')) {
    //   // this.$el.setAttribute('result-no-id', this.glComponentInst.id)
    //   this.$el.setAttribute('id', this.glComponentInst.id)
    //   this.$el.setAttribute('result-draggable', true)
    //   this.$el.addEventListener('click', this.onClick)
    //   this.$el.addEventListener('mouseover', this.onMouseOver)
    //   this.$el.addEventListener('mouseleave', this.onMouseLeave)
    //   this.$el.addEventListener('dragenter', this.onDragEnter)
    //   this.$el.addEventListener('dragleave', this.onDragleave)
    // }
    this.$emit('onComponentMounted', {})
  },
  unmounted() {
  },
  methods: {
    /**
     *  由于部分组件，如AStep，采用template两层嵌套迭代用component渲染时，样式名称渲染为undefined
     *  在这里改成取出最终的迭代元素组成一层数据组，直接在component上迭代
     */
    getChildElements(glComponentInst: Object) {
      let result: Array<any> = []
      for (let key in glComponentInst.children) {
        for (let childElement of glComponentInst.children[key]) {
          result.push(childElement)
        }
      }
      // console.log('getChildElements> result:', result)
      return result
    }
  }
})
</script>

<style>
.gl-component {
}

.gl-component.gl-hover, .gl-component.gl-selected {
  border: 1px solid #178df7;
}

.gl-component.gl-drag-enter {
  /*border: 1px solid red;*/
}

.gl-drag-start {
  border: #ff0014 2px solid;
}
</style>
