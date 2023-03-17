<template>
  <div class="gl-dnd-placeholder" @dragenter="onDragEnter" @dragleave="onDragLeave">
    <slot></slot>
    <span>{{ info }}</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlDndPlaceholder",
  props: {
    info: {
      type: String,
      default() {
        return '拖放组件到此'
      }
    }
  },
  methods: {
    onDragEnter(event:any) {
      // console.log('onDragEnter() > event:', event)
      if (event.target.classList.contains('gl-drag-enter')) {
        return
      }
      event.target.classList.add('gl-drag-enter')
    },
    onDragLeave(event:any) {
      // console.log('onDragLeave() > event:', event)
      if (event.target.classList.contains('gl-drag-enter')) {
        event.target.classList.remove('gl-drag-enter')
      }
    }
  }
})
</script>

<style>
.gl-dnd-placeholder {
  min-height: 3em;
  line-height: 3em;
  height: 100%;
  width: 99.6%;
  background-color: #f0f0f0;
  border: 1px dotted;
  color: #a7b1bd;
  font-size: 14px;
  text-align: center;
  /*margin: 2px 0;*/
}

.gl-dnd-placeholder.gl-drag-enter {
  background-color: #b3d1e3;
}

/*.gl-dnd-placeholder:hover {*/
/*border: dotted 1px #1890FF;*/
/*}*/

/*.gl-dnd-placeholder:before {*/
/*color: #1890FF;*/
/*}*/

</style>
