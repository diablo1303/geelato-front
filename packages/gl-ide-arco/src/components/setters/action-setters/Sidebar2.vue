<template>
  <div class="gl-command-editor-sidebar">
    <template v-for="blockMetaGroup in blockMetaGroups">
      <div>
        <span>{{ blockMetaGroup.title }}</span>
        <gl-draggable
            v-model="blockMetaGroup.blocks"
            class="gl-command-blocks"
            animation="700"
            handle=".gl-dnd-block-handle"
            itemKey="name"
            ghostClass="gl-dnd-item-ghost"
            dragClass="gl-dnd-item-drag"
            :group="{ name: 'blockItems', pull: 'clone', put: false }"
            :sort="false"
            :scroll="false"
            @choose="onChoose"
            :clone="clone"
        >
          <template #item="{element}">
            <div class="gl-block-item gl-dnd-block-handle" :class="blockMetaGroup.name">
              {{ element.title }}
            </div>
          </template>
        </gl-draggable>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import blockMetaGroups from "./blocks/CommandBlockMetaGroups";
import BlockMeta from "../../../../../gl-ui-schema/src/entity/actions/BlockMeta";
import BlockInstance from "packages/gl-ui-schema/src/entity/actions/BlockInstance";
import {ref} from "vue";

const chooseIndex = ref(0)
const onChoose = (e: any) => {
  chooseIndex.value = e.oldIndex
}
const clone = (block: BlockMeta, items:Array<BlockInstance>) => {
  console.log('clone:',block,items)
  let blockItem = {props: {}}
  Object.assign(blockItem, block)
  return JSON.parse(JSON.stringify(blockItem))
}
</script>

<style scoped>

</style>
