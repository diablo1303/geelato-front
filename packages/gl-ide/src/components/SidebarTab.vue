<template>
  <div class="gl-ide-sidebar">
    <div
      class="leftToolBar"
      :style="{ height: `${themeStore.sidebarHeight}px`, width: `${themeStore.sidebarTabWidth}px` }"
    >
      <div
        class="leftToolBarBtn"
        v-for="(panel, index) in panels"
        :key="index"
        :class="{
          activated: ideStore.activatedSidebarPanelTitle
            ? ideStore.activatedSidebarPanelTitle === panel.title
            : index === 0
        }"
        @click="onLeftToolbarClick(panel.title)"
      >
        <div>
          <!--        <component v-if="panel.iconType" :is="panel.iconType" :style="{'font-size':themeStore.sidebarTabFontSize+'em'}"></component>-->
          <GlIconfont
            :type="panel.iconType"
            style="color: #0066bf"
            :style="{ 'font-size': themeStore.sidebarTabWidth / 22 / 1.5 + 'em' }"
          ></GlIconfont>
          <div style="padding-top: 4px">
            {{ panel.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useThemeStore } from '../stores/UseThemeStore'
import { useIdeStore } from '../stores/UseIdeStore'

export default defineComponent({
  name: 'GlDesignerSidebar',
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
  padding: 8px 2px;
  width: 40px;
}

.leftToolBarBtn > div {
  padding: 4px;
  border-radius: 5px;
}

.leftToolBarBtn > div:hover {
  background-color: #FFFFFF;
  cursor: pointer;
}

.leftToolBarBtn.activated > div {
  background-color: #FFFFFF;
}
</style>