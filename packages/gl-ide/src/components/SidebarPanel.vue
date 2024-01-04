<template>
  <div class="gl-ide-sidebar">
    <!--    <div class="leftToolBar" :style="{height:`${themeStore.sidebarHeight}px`,width:`${themeStore.sidebarLeftToolbarWidth}px`}">-->
    <!--      <div class="leftToolBarBtn" v-for="(panel,index) in panels" :key="index"-->
    <!--           :class="{activated:selectedPanelTitle?(selectedPanelTitle===panel.title):index===0}"-->
    <!--           @click="onLeftToolbarClick(panel.title)" readonly>-->
    <!--        <component v-if="panel.icon" :is="panel.icon"></component>-->
    <!--        {{ panel.title }}-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="rightPanel" :style="{padding:`${themeStore.panelPadding}px`}" style="width: 100%" v-show="showPanel">
      <template v-for="(panel,index) in panels" :key="index">
        <component
            v-if="ideStore.activatedSidebarPanelTitle?(ideStore.activatedSidebarPanelTitle===panel.title):index===0"
            :is="panel.componentName"
            :style="{height:`${themeStore.ideMainHeight}px`}"></component>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useThemeStore} from "../stores/UseThemeStore";
import {useIdeStore} from "../stores/UseIdeStore";

const themeStore = useThemeStore()
const ideStore = useIdeStore()
const panels = ideStore.findPanelsByType('sidebar')

const showPanel = ref(true)

</script>


<style>

.gl-ide-sidebar {
}

.gl-ide-sidebar .rightPanel {
  display: inline-block;
}

/***
 * 提供默认的组件卡片式样式
 */
.gl-ide-sidebar .gl-group-cards {
}

.gl-ide-sidebar .gl-component-dnd-item {
  display: inline-block;
  min-width: 82px;
  text-align: center;
  border: 1px solid rgba(231, 231, 231, 0.57);
  padding: 0.5em 0;
  user-select: none;
}

.gl-ide-sidebar .gl-component-dnd-item:hover {
  box-shadow: 0 0 2px 1px rgba(4, 103, 194, 0.76);
}

.gl-ide-sidebar .gl-group-title {
  margin: 1em;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}

.gl-ide-sidebar .gl-group-title > .gl-tag {
  float: right;
  background-color: #41a4fc;
  color: white;
  width: 1.5em;
  text-align: center;
  border-radius: 4px
}

.gl-ide-sidebar .gl-component-dnd-item > .gl-title {
  font-weight: 400;
  font-size: 12px;
  opacity: .80;
}

.gl-ide-sidebar .gl-component-dnd-item:hover > .gl-title {
  opacity: 1;
  font-weight: 600;
  color: rgba(4, 103, 194, 0.76);
}

</style>
