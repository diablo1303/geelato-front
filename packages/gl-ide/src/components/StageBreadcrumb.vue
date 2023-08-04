<script lang="ts">
export default {
  name: 'StageBreadcrumb'
}
</script>
<script lang="ts" setup>
import {useComponentStore} from "../stores/UseComponentStore";
import {ComponentInstance} from "@geelato/gl-ui-schema";

const componentStore = useComponentStore()

const onMouseOver = (item: ComponentInstance) => {
  componentStore.setCurrentHoverComponentId(item.id)
}
</script>

<template>
  <div class="gl-designer-stage-crumb">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="item in componentStore.getBreadcrumb()">
        <a-tag class="gl-item"
               :color="item.id===componentStore.currentSelectedComponentId||item.id===componentStore.currentHoverComponentId?'blue':''"
               @click.stop="componentStore.setCurrentSelectedComponent(item)"
               @mouseover="onMouseOver(item)"
        >{{ item.componentName }}
        </a-tag>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<style>
.gl-designer-stage-crumb {
  border-top: solid 1px rgb(157, 156, 156);
  padding-top: 2px;
  height: 24px;
}

.gl-designer-stage-crumb .gl-item {
  cursor: pointer
}

.gl-designer-stage-crumb .arco-breadcrumb-item {
  padding: 0 !important;
}

.gl-designer-stage-crumb .arco-breadcrumb-item-separator {
  margin: 0 !important;
}
</style>
