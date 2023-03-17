<template>
  <div :id="id" ref="glToolbarBreadcrumbs" class="gl-toolbar-breadcrumbs"
       :class="clazz"
       @mouseover="componentStore.setCurrentHoverComponentId('glToolbarBreadcrumbs')"
       @mouseleave="componentStore.setCurrentHoverComponentId('')">
    <span class="gl-crumb" v-if="eventType==='Selected'">
      <span class="gl-crumb-nav" @click="componentStore.selectParentComponent" title="点击选择上一层"> <GlIconfont type="gl-breadcrumb" /></span>
      <span :title="componentStore.currentSelectedComponentName">{{ componentStore.currentSelectedComponentName }}</span>
    </span>
    <span class="gl-crumb" v-else-if="eventType==='Hover'">{{ componentStore.currentHoverComponentName }}</span>
    <span class="gl-crumb-actions" v-if="!isDeleteAble">
      <GlIconfont type="gl-save" title="保存为模板片段" />
      <GlIconfont type="gl-copy" title="复制" />
      <GlIconfont type="gl-delete" title="删除"  @click="onComponentDelete" />
    </span>
  </div>
</template>

<script lang="ts">
import {EventNames} from "@geelato/gl-ide"
import {computed, defineComponent} from 'vue'
import {useIdeStore} from "@geelato/gl-ide";
// {'gl-hover':!!$ide.currentHoverComponentId&&eventType==='Hover'&&!$ide.currentDragComponentId,'gl-selected':!!$ide.currentSelectedComponentId&&eventType==='Selected'}
export default defineComponent({
  name: "GlToolbarBreadcrumbs",
  components: {},
  props: {
    eventType: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const componentStore = useIdeStore().componentStore

    const clazz = computed(() => {
      return {
        'gl-hover': !!componentStore.currentHoverComponentId && props.eventType === 'Hover' && !componentStore.currentDragComponentId,
        'gl-selected': !!componentStore.currentSelectedComponentId && props.eventType === 'Selected',
        'gl-layout-active': componentStore.currentSelectedComponentId && (componentStore.currentSelectedComponentId.indexOf('row_') !== -1 || componentStore.currentSelectedComponentId.indexOf('col_') !== -1)
      }
    })

    const isDeleteAble = computed(() => {
      const id = componentStore.currentSelectedComponentId
      return !id || (id.indexOf('pHolder_') !== -1 || id.indexOf('col_') !== -1)
    })

    const onComponentDelete = () => {
      console.log('onComponentDelete', EventNames.GlIdeStageComponentDelete)
      ctx.emit(EventNames.GlIdeStageComponentDelete, {id: componentStore.currentSelectedComponentId})
    }

    return {
      componentStore,
      clazz,
      isDeleteAble,
      id: 'glToolbarBreadcrumbs' + props.eventType,
      onComponentDelete
    }
  }
})
</script>

<style>
.gl-toolbar-breadcrumbs {
  font-size: 12px;
  line-height: 18px;
  position: absolute;
  left: 0;
  top: 0;
  /*width: 100%;*/
  height: 20px;
  margin-top: -20px;
  margin-left: 0;
  padding: 1px 4px;
  z-index: 999;
  display: none;
}

.gl-toolbar-breadcrumbs.gl-hover {
  /*background-color: #FFF;*/
  color: #176bf7;
  display: inline-block;
}

.gl-toolbar-breadcrumbs .gl-crumb-nav {
  cursor: pointer;
  padding-right: 3px;
  margin-right: 3px;
  border-right: 1px solid #f7f7f7;
}

.gl-toolbar-breadcrumbs.gl-selected {
  display: inline-block;
  background-color: #178df7;
  color: #FFF;
}

.gl-toolbar-breadcrumbs.gl-hover.gl-layout-active {
  color: #8f19ff;
}

.gl-toolbar-breadcrumbs.gl-selected.gl-layout-active {
  background-color: #8f19ff;
}

.gl-crumb-actions {
  margin-left: 0.5em;
  border-left: 1px solid #f7f7f7;
}

.gl-crumb-actions > * {
  padding-left: 0.5em;
  cursor: pointer;
  color: #FFF !important;
}
</style>
