<template>
  <div class="gl-designer-sidebar">
    <div class="leftToolBar" :style="{height:`${themeStore.sidebarHeight}px`,width:`${themeStore.sidebarTabWidth}px`}">
      <div class="leftToolBarBtn" v-for="(panel,index) in panels" :key="index"
           :class="{activated:ideStore.activatedSidebarPanelTitle?(ideStore.activatedSidebarPanelTitle===panel.title):index===0}"
           @click="onLeftToolbarClick(panel.title)" readonly
      >
<!--        <component v-if="panel.iconType" :is="panel.iconType" :style="{'font-size':themeStore.sidebarTabFontSize+'em'}"></component>-->
        <GlIconfont :type="panel.iconType" style="font-size: 1.2em"></GlIconfont>
        <div style="padding-top: 4px">
          {{ panel.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {inject, defineComponent, ref} from 'vue'
import {useThemeStore} from "../stores/UseThemeStore";
import {useIdeStore} from "../stores/UseIdeStore";

export default defineComponent({
  name: "GlDesignerSidebar",
  setup(props, context) {
    const themeStore = useThemeStore()
    const ideStore = useIdeStore()
    const panels = ideStore.findPanelsByType('sidebar')
    ideStore.activatedSidebarPanelTitle = panels && panels.length > 0 ? panels[0].title : ''
    const onLeftToolbarClick = (panelTitle: string) => {
      ideStore.activatedSidebarPanelTitle = panelTitle
    }

    return {
      themeStore,
      ideStore,
      panels,
      onLeftToolbarClick
    }
  }
})
</script>


<style>
.leftToolBar {
  line-height: 1.2em;
  background-color: #f0f0f0;
  display: inline-block;
  text-align: center;
  font-size: 0.857em;
  vertical-align: top;
}


.leftToolBarBtn {
  background-color: #f0f0f0;
  padding: 1em 0.4em;
}

.leftToolBarBtn:hover {
  background-color: #d8d8d8;
  cursor: pointer;
}

.leftToolBarBtn.activated {
  background-color: #d8d8d8;
}
</style>
