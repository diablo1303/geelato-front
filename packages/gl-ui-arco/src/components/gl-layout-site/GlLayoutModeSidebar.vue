<script lang="ts">
export default {
  name: 'GlLayoutModeSidebar'
}
</script>
<script lang="ts" setup>
import {  ref, watch } from 'vue'
import { LayoutStore } from './LayoutStore'
import {useGlobal} from "@geelato/gl-ui";
import ThemeSetting from "./ThemeSetting.vue";

const global = useGlobal()
const layoutStore = LayoutStore()

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  menuItems: Array
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const currentSelectedItemName = ref('')

const themeSettingVisible = ref(false)
const openChangeThemeModal = () => {
  themeSettingVisible.value = true
}
</script>

<template>
  <div class="gl-layout-mode-sidebar">
    <div
      class="gl-layout-sidebar"
      :style="{
        width: layoutStore.sidebarPanelWidth + 'px',
        height: layoutStore.sidebarPanelHeight + 'px'
      }"
    >
      <div class="gl-sidebar-left" :style="{ width: layoutStore.sidebarLeftPanelWidth + 'px' }">
        <div class="gl-logo">
          <a-avatar src="/logo.png" aria-readonly="true"></a-avatar>
        </div>
        <div class="gl-sidebar-left-main">
          <router-link to="/desktop">
            <div
              class="gl-item"
              @click="currentSelectedItemName = 'desktop'"
              :class="{ 'gl-selected': currentSelectedItemName === 'desktop' }"
            >
              <div class="gl-icon" title="桌面">
                <gl-iconfont type="gl-desktop"></gl-iconfont>
              </div>
<!--              <div class="gl-title"></div>-->
            </div>
          </router-link>
          <router-link to="/project">
            <div
              class="gl-item"
              @click="currentSelectedItemName = 'components'"
              :class="{ 'gl-selected': currentSelectedItemName === 'components' }"
            >
              <div class="gl-icon">
                <gl-iconfont type="gl-components"></gl-iconfont>
              </div>
              <div class="gl-title">项目</div>
            </div>
          </router-link>
          <router-link to="/todo">
            <div
              class="gl-item"
              @click="currentSelectedItemName = 'task'"
              :class="{ 'gl-selected': currentSelectedItemName === 'task' }"
            >
              <div class="gl-icon">
                <gl-iconfont type="gl-task"></gl-iconfont>
              </div>
              <div class="gl-title">任务</div>
            </div>
          </router-link>
          <router-link to="/schedule">
            <div
              class="gl-item"
              @click="currentSelectedItemName = 'schedule'"
              :class="{ 'gl-selected': currentSelectedItemName === 'schedule' }"
            >
              <div class="gl-icon">
                <gl-iconfont type="gl-schedule"></gl-iconfont>
              </div>
              <div class="gl-title">日历</div>
            </div>
          </router-link>
        </div>
        <div class="gl-item gl-action">
          <gl-iconfont type="gl-notation"></gl-iconfont>
        </div>
        <div class="gl-item gl-action" @click="openChangeThemeModal">
          <gl-iconfont type="gl-color" title="自定义皮肤"></gl-iconfont>
          <a-modal title="皮肤配置" :visible="themeSettingVisible">
            <ThemeSetting></ThemeSetting>
          </a-modal>
        </div>
        <router-link to="/me">
          <div class="gl-item" style="padding: 0.8em 0">
            <a-avatar src="/avator/4043260_avatar_male_man_portrait_icon.png" />
          </div>
        </router-link>
      </div>
      <slot
        name="sidebarRightPanel"
        :style="{ width: layoutStore.sidebarRightPanelWidth + 'px' }"
      ></slot>
    </div>
    <div class="gl-layout-stage">
      <slot name="stageBannerPanel"></slot>
      <slot
        name="stageMainPanel"
        :style="{
          width: layoutStore.stagePanelWidth + 'px',
          height: layoutStore.stageMainPanelHeight + 'px',
          padding: '1em'
        }"
      ></slot>
    </div>
    <div class="gl-layout-setter">
      <slot name="setter"></slot>
    </div>
  </div>
</template>

<style>
.gl-layout-mode-sidebar {
  display: flex;
  overflow-x: hidden;
}

.gl-layout-sidebar {
  border-right: 1px solid var(--gl_nav_dark-gray);
  /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
  /*box-shadow: 1px 0px 2px 1px rgba(231, 231, 231, 0.81);*/
}

.gl-layout-stage {
  /*margin: 1em 0 0 1em;*/
}

.gl-sidebar-left {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  /*布局方向是垂直的*/
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: var(--gl_nav_white);
  /*background-color: #0467c2;*/
}

.gl-sidebar-left .gl-logo {
  margin: 1em auto 2em auto;
  width: 3em;
  height: 3em;
}

/*.gl-sidebar-left .gl-item.gl-end {*/
/*  margin-bottom: 1.5em;*/
/*}*/

.gl-sidebar-left-main {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.gl-sidebar-left .gl-item {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 6px;
  border-radius: 10px;
  height: 36px;
  width: 36px;
  /*width: 5em;*/
}

.gl-sidebar-left .gl-item:hover,
.gl-sidebar-left .gl-item.gl-selected {
  background-color: rgb(198, 226, 255);
  color: var(--gl_nav_main);
  cursor: pointer;
}

.gl-sidebar-left .gl-icon {
  /*color: var(--gl_nav_main);*/
  font-size: 1.2em;
  line-height: 36px;
}

.gl-sidebar-left .gl-title {
  /* font-size: 0.9em; */
}

.gl-sidebar-left .gl-item .gl-title {
  color: black;
}

.gl-sidebar-left .gl-item.gl-selected .gl-title {
  color: var(--gl_nav_main);
}

.gl-sidebar-left .gl-item .gl-action {
  padding: 14px 0;
  margin-bottom: -8px;
}
</style>
