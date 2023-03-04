<template>
  <div class="gl-ide-arco-stage-main" v-if="componentStore.currentComponentTree.length>0"
       :id="componentStore.currentComponentTree[0].id"
       style="padding-top: 2em">
    <GlToolbarBreadcrumbs eventType="Hover"></GlToolbarBreadcrumbs>
    <GlToolbarBreadcrumbs eventType="Selected"></GlToolbarBreadcrumbs>
    <gl-x :glComponentInst="componentStore.currentComponentTree[0]"></gl-x>
    <gl-json ref="codeViewer" v-model="componentStore.currentComponentTree[0]" style="display: none"></gl-json>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {utils} from "@geelato/gl-ui";
import {useIdeStore} from "@geelato/gl-ide";
import {emitter} from "@geelato/gl-ui";
export default defineComponent({
  name: "GlIdePluginCoreStageFreePage",
  setup(props, ctx) {
    const test = ref('')
    const componentStore = useIdeStore().componentStore
    const showCodeViewer = () => {
      // this.codeViewerVisible = true
      this.$refs.codeViewer.openModal()
      this.$refs.codeViewer.reset()
    }

    /**
     * 设置工具条的位置
     * @param toolbarBreadcrumbsId 一般该Id值为'glToolbarBreadcrumbsHover'或'glToolbarBreadcrumbsSelected'
     * @param moveToTargetId
     */
    const setToolbarBreadcrumbsPosition = (toolbarBreadcrumbsId:string, moveToTargetId:string) => {
      // console.log('setToolbarBreadcrumbsPosition,toolbarBreadcrumbsId:', toolbarBreadcrumbsId, 'moveToTargetId:',moveToTargetId)
      if (!moveToTargetId || moveToTargetId === 'glToolbarBreadcrumbsHover' || moveToTargetId === 'glToolbarBreadcrumbsSelected' || moveToTargetId === 'glToolbarBreadcrumbs') {
        return
      }
      let toolbarBreadcrumbsDiv = document.getElementById(toolbarBreadcrumbsId);
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      const target = typeof moveToTargetId === 'string' ? document.getElementById(moveToTargetId) : moveToTargetId
      if (!target) {
        console.error('通过moveToTargetId(' + moveToTargetId + ')找不到停靠的对象。')
        return
      }
      // @ts-ignore
      const stageDom = document.getElementById(componentStore.currentComponentTree[0].id)
      const stageDomRect = stageDom?.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      // @ts-ignore
      // 对高度低于32的组件进行位置校正 targetRect.height<32?32:targetRect.height
      toolbarBreadcrumbsDiv.style.top = scrollTop + targetRect.top-(targetRect.height<32?32:targetRect.height)-2  + "px";
      // @ts-ignore
      toolbarBreadcrumbsDiv.style.left = scrollLeft + targetRect.left-stageDomRect.left  + "px";
    }

    emitter.on('setCurrentSelectedComponentId',(data)=>{
      setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', componentStore.currentSelectedComponentId)
    })
    emitter.on('setCurrentHoverComponentId',(data)=>{
      setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsHover', componentStore.currentHoverComponentId)
    })

    return {
      test,
      componentStore,
      /**
       *  初始的组件树
       */
      items: [
        {
          componentName: 'GlRoot',
          id: utils.gid('GlRoot'),
          props: {},
          children: [
            {
              componentName: 'GlDndPlaceholder',
              id: utils.gid('pHolder'),
              props: {
                info: undefined
              },
              children: []
            }
          ]
        }
      ],
      codeViewerVisible: false,
      showCodeViewer
    }
  },
  created() {
    // this.$gl.bus.$on('GlDesignerToolbar.showCodeViewer', this.showCodeViewer)
  },
  mounted() {
    this.componentStore.currentComponentTree.push(...this.items)
  },
  unmounted() {
    // emitter.off('currentSelectedComponentId')
  },
  // watch: {
  // '$ide.currentHoverComponentId': function (val, oval) {
  // }
  // }
})
</script>

<style>
.gl-ide-arco-stage-main {
  padding: 10px 10px 2em 10px;
  overflow: hidden;
}

/*.gl-dnd-container-placeholder {*/
/*background-color: #91d5ff;*/
/*width: 100%;*/
/*min-height: 60px;*/
/*}*/
/*.ghost {*/
/*line-height: 4em;*/
/*background-color: #e0e0e0;*/
/*opacity: 1*/
/*}*/
</style>
