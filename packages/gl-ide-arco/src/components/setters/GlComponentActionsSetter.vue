<template>
  <div>
    <!--    <div style="padding-bottom: 4px">-->
    <!--      <a-dropdown position="bl" @select="handleSelect">-->
    <!--        <a-button type="primary">添加动作</a-button>-->
    <!--        <template #content>-->
    <!--          <a-doption style="width: 100%" :value="action" v-for="(action) in componentMeta.actions">{{ action.name }}-->
    <!--            {{ action.title }}-->
    <!--          </a-doption>-->
    <!--        </template>-->
    <!--      </a-dropdown>-->
    <!--    </div>-->
    <div class="gl-table">
      <div class="gl-table-row" v-for="(action) in componentMeta.actions">
        <div class="gl-table-cell gl-label" style="position: relative;width: 8em">{{ action.name }} {{
            action.title
          }}
        </div>
        <div class="gl-table-cell">
          <GlArrayBaseSetter v-slot:default="slotProps" v-model="componentInstance.actions"
                             :defaultItemForAdd="{name:action.name,title:action.title,action:action.name}" @addItem="update"
                             @removeItem="update">
            <div style="width:100%;display: flex;margin-bottom: 1px">
              <div style="flex:auto" @click="onSelectItem(element,index)">
                <a-input v-model="componentInstance.actions[slotProps.index].name"></a-input>
              </div>
              <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
                <GlIconfont type="gl-setting" @click="openActionSetter(action)"
                            style="cursor: pointer"></GlIconfont>
              </div>
            </div>
          </GlArrayBaseSetter>
        </div>
      </div>
    </div>
    <a-modal draggable :visible="actionCodeEditorVisible" title="动作（事件）编排" @ok="()=>{actionCodeEditorVisible=false}" @cancel="()=>{actionCodeEditorVisible=false}" :width="1024" style="top: 20px">
      xxxx
    </a-modal>
  </div>

</template>
<script lang="ts">
export default {
  name: "GlComponentActionsSetter"
}
</script>
<script lang="ts" setup>
import {type PropType, ref} from 'vue'
import {Action, ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import GlArrayBaseSetter from "./property-setters/GlArrayBaseSetter.vue";

const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: ComponentInstance
  }
})

const handleSelect = (val: Action) => {
  console.log('handleSelect action:', val)
}
const update = () => {

}
const actionCodeEditorVisible = ref(false)
const openActionSetter = (action:Action) => {
  actionCodeEditorVisible.value = true
}
</script>

<style scoped>

</style>
